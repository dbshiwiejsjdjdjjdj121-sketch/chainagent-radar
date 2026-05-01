import type { IndexerStatus, NormalTransaction, RpcTarget, TokenTransfer, TransferDirection } from "../types";

type EtherscanResponse<T> = {
  status: "0" | "1";
  message: string;
  result: T | string;
};

type TokenTransferRow = {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  contractAddress: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
};

type NormalTransactionRow = {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  input: string;
  functionName?: string;
  isError: string;
};

export type IndexerEnrichment = {
  status: IndexerStatus;
  message: string;
  tokenTransfers: TokenTransfer[];
  recentTransactions: NormalTransaction[];
  tokenTransferCount: number;
  contractInteractionCount: number;
  stablecoinVolume: number;
  topTokenSymbols: string[];
  riskFlags: string[];
  strengths: string[];
};

const etherscanApiUrl = "https://api.etherscan.io/v2/api";
const stablecoinSymbols = new Set(["BSC-USD", "USDT", "USDC", "FDUSD", "DAI", "USDD", "TUSD", "PYUSD"]);

function getIndexerKey() {
  return import.meta.env.VITE_ETHERSCAN_API_KEY || import.meta.env.VITE_BSCSCAN_API_KEY || "";
}

function directionFor(address: string, from: string, to: string): TransferDirection {
  const normalized = address.toLowerCase();

  if (from.toLowerCase() === normalized && to.toLowerCase() === normalized) return "self";
  return to.toLowerCase() === normalized ? "in" : "out";
}

function formatTokenValue(value: string, decimals: string) {
  const parsedDecimals = Number.parseInt(decimals || "18", 10);
  const decimalCount = Number.isFinite(parsedDecimals) ? parsedDecimals : 18;
  const numeric = tokenValueToNumber(value, decimalCount);

  if (!Number.isFinite(numeric)) return "0";
  if (numeric >= 1000) return numeric.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (numeric >= 1) return numeric.toLocaleString(undefined, { maximumFractionDigits: 4 });

  return numeric.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function tokenValueToNumber(value: string, decimals: number) {
  const raw = BigInt(value || "0");
  const divisor = 10n ** BigInt(Math.max(0, decimals));
  const whole = raw / divisor;
  const fraction = raw % divisor;
  const fractionText = fraction.toString().padStart(decimals, "0").slice(0, 8);

  return Number(`${whole.toString()}.${fractionText || "0"}`);
}

function formatWei(value: string) {
  const numeric = Number(value) / 10 ** 18;

  if (!Number.isFinite(numeric)) return "0";
  if (numeric >= 1) return numeric.toLocaleString(undefined, { maximumFractionDigits: 5 });
  return numeric.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function formatTimestamp(timestamp: string) {
  return new Date(Number.parseInt(timestamp, 10) * 1000).toISOString();
}

function buildEndpoint(target: RpcTarget, action: "tokentx" | "txlist", address: string, apiKey: string) {
  const params = new URLSearchParams({
    chainid: String(target.chainId),
    module: "account",
    action,
    address,
    startblock: "0",
    endblock: "999999999",
    page: "1",
    offset: "25",
    sort: "desc",
    apikey: apiKey,
  });

  return `${etherscanApiUrl}?${params.toString()}`;
}

async function fetchEtherscanRows<T>(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Etherscan indexer returned HTTP ${response.status}`);
  }

  const payload = (await response.json()) as EtherscanResponse<T[]>;

  if (payload.status === "1" && Array.isArray(payload.result)) {
    return payload.result;
  }

  if (payload.message === "No transactions found" || payload.result === "No transactions found") {
    return [];
  }

  throw new Error(typeof payload.result === "string" ? payload.result : payload.message);
}

function toTokenTransfer(address: string, row: TokenTransferRow): TokenTransfer {
  const direction = directionFor(address, row.from, row.to);
  const counterparty = direction === "in" ? row.from : row.to;

  return {
    hash: row.hash,
    tokenSymbol: row.tokenSymbol || "TOKEN",
    tokenName: row.tokenName || "Unknown token",
    value: formatTokenValue(row.value, row.tokenDecimal),
    direction,
    counterparty,
    timestamp: formatTimestamp(row.timeStamp),
    contractAddress: row.contractAddress,
  };
}

function toNormalTransaction(address: string, row: NormalTransactionRow): NormalTransaction {
  return {
    hash: row.hash,
    direction: directionFor(address, row.from, row.to),
    valueNative: formatWei(row.value),
    method: row.functionName || (row.input && row.input !== "0x" ? "contract call" : "native transfer"),
    timestamp: formatTimestamp(row.timeStamp),
    isError: row.isError === "1",
  };
}

function summarizeTokens(transfers: TokenTransfer[]) {
  const counts = new Map<string, number>();

  for (const transfer of transfers) {
    counts.set(transfer.tokenSymbol, (counts.get(transfer.tokenSymbol) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([symbol]) => symbol);
}

export async function fetchBnbIndexerEnrichment(address: string, target: RpcTarget): Promise<IndexerEnrichment> {
  const apiKey = getIndexerKey();

  if (!apiKey) {
    return {
      status: "not-configured",
      message: "Add VITE_ETHERSCAN_API_KEY to enable ERC-20 transfers and normal transaction indexing.",
      tokenTransfers: [],
      recentTransactions: [],
      tokenTransferCount: 0,
      contractInteractionCount: 0,
      stablecoinVolume: 0,
      topTokenSymbols: [],
      riskFlags: [],
      strengths: ["Public RPC path is active; indexer enrichment is optional for local demos"],
    };
  }

  try {
    const [tokenRows, txRows] = await Promise.all([
      fetchEtherscanRows<TokenTransferRow>(buildEndpoint(target, "tokentx", address, apiKey)),
      fetchEtherscanRows<NormalTransactionRow>(buildEndpoint(target, "txlist", address, apiKey)),
    ]);

    const tokenTransfers = tokenRows.map((row) => toTokenTransfer(address, row));
    const recentTransactions = txRows.map((row) => toNormalTransaction(address, row));
    const contractInteractionCount = recentTransactions.filter((tx) => tx.method !== "native transfer").length;
    const stablecoinVolume = tokenRows.reduce((total, row) => {
      const parsedDecimals = Number.parseInt(row.tokenDecimal || "18", 10);
      return stablecoinSymbols.has(row.tokenSymbol)
        ? total + tokenValueToNumber(row.value, Number.isFinite(parsedDecimals) ? parsedDecimals : 18)
        : total;
    }, 0);
    const riskFlags: string[] = [];
    const strengths: string[] = [];

    if (tokenTransfers.length === 0) {
      riskFlags.push("No recent ERC-20 transfers returned by the indexer");
    } else {
      strengths.push(`${tokenTransfers.length} recent ERC-20 transfers indexed`);
    }

    if (contractInteractionCount === 0) {
      riskFlags.push("No recent contract interaction methods detected");
    } else {
      strengths.push(`${contractInteractionCount} recent contract interactions classified`);
    }

    if (recentTransactions.some((tx) => tx.isError)) {
      riskFlags.push("Recent failed transaction detected");
    }

    return {
      status: "synced",
      message: `Etherscan V2 indexer synced ${tokenTransfers.length} token transfers and ${recentTransactions.length} normal transactions.`,
      tokenTransfers,
      recentTransactions,
      tokenTransferCount: tokenTransfers.length,
      contractInteractionCount,
      stablecoinVolume,
      topTokenSymbols: summarizeTokens(tokenTransfers),
      riskFlags,
      strengths,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Indexer enrichment failed.",
      tokenTransfers: [],
      recentTransactions: [],
      tokenTransferCount: 0,
      contractInteractionCount: 0,
      stablecoinVolume: 0,
      topTokenSymbols: [],
      riskFlags: ["Indexer enrichment failed; RPC data is still available"],
      strengths: [],
    };
  }
}
