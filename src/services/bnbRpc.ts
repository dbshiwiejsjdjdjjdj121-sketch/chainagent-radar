import type { AgentPaymentSimulation, RpcTarget, WalletSnapshot } from "../types";
import { fetchBnbIndexerEnrichment } from "./etherscanIndexer";

type RpcResponse<T> = {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
};

const evmAddressPattern = /^0x[a-fA-F0-9]{40}$/;

export function isEvmAddress(address: string) {
  return evmAddressPattern.test(address.trim());
}

function hexToNumber(hex: string) {
  return Number.parseInt(hex, 16);
}

function formatWeiToNative(hexWei: string) {
  const wei = BigInt(hexWei);
  const whole = wei / 10n ** 18n;
  const fraction = wei % 10n ** 18n;
  const fractionText = fraction.toString().padStart(18, "0").slice(0, 5).replace(/0+$/, "");

  return fractionText ? `${whole.toString()}.${fractionText}` : whole.toString();
}

function decimalNativeToWei(amount: string) {
  const [whole = "0", fraction = ""] = amount.split(".");
  const normalizedFraction = fraction.padEnd(18, "0").slice(0, 18);

  return BigInt(whole || "0") * 10n ** 18n + BigInt(normalizedFraction || "0");
}

function weiToNativeText(wei: bigint, fractionDigits = 8) {
  const whole = wei / 10n ** 18n;
  const fraction = wei % 10n ** 18n;
  const fractionText = fraction.toString().padStart(18, "0").slice(0, fractionDigits).replace(/0+$/, "");

  return fractionText ? `${whole.toString()}.${fractionText}` : whole.toString();
}

function weiToHex(wei: bigint) {
  return `0x${wei.toString(16)}`;
}

function gasPriceToGweiText(gasPriceWei: bigint) {
  const gwei = Number(gasPriceWei) / 10 ** 9;
  return gwei.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

async function callRpc<T>(target: RpcTarget, method: string, params: unknown[] = []) {
  const response = await fetch(target.rpcUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`${target.name} RPC returned HTTP ${response.status}`);
  }

  const payload = (await response.json()) as RpcResponse<T>;

  if (payload.error) {
    throw new Error(payload.error.message);
  }

  if (payload.result === undefined) {
    throw new Error(`${method} returned no result`);
  }

  return payload.result;
}

export async function fetchBnbWalletSnapshot(address: string, target: RpcTarget): Promise<WalletSnapshot> {
  const normalized = address.trim();

  if (!isEvmAddress(normalized)) {
    throw new Error("Enter a full EVM address, for example 0x followed by 40 hex characters.");
  }

  const startedAt = performance.now();
  const [balanceHex, txCountHex, blockHex, chainIdHex] = await Promise.all([
    callRpc<string>(target, "eth_getBalance", [normalized, "latest"]),
    callRpc<string>(target, "eth_getTransactionCount", [normalized, "latest"]),
    callRpc<string>(target, "eth_blockNumber"),
    callRpc<string>(target, "eth_chainId"),
  ]);

  const txCount = hexToNumber(txCountHex);
  const blockNumber = hexToNumber(blockHex);
  const chainId = hexToNumber(chainIdHex);
  const nativeBalance = formatWeiToNative(balanceHex);
  const nativeAsNumber = Number(nativeBalance);
  const indexer = await fetchBnbIndexerEnrichment(normalized, target);
  const riskFlags: string[] = [];
  const strengths: string[] = [`Live ${target.name} RPC verified at block ${blockNumber.toLocaleString()}`];

  if (chainId !== target.chainId) {
    riskFlags.push(`Expected chain ${target.chainId}, RPC returned ${chainId}`);
  }

  if (txCount === 0) {
    riskFlags.push("No outbound transactions found on this chain");
  } else {
    strengths.push(`${txCount.toLocaleString()} outbound transactions found`);
  }

  if (nativeAsNumber <= 0) {
    riskFlags.push(`No ${target.nativeSymbol} balance for gas or payment demos`);
  } else {
    strengths.push(`${nativeBalance} ${target.nativeSymbol} available for gas`);
  }

  if (txCount > 80 && nativeAsNumber < 0.01) {
    riskFlags.push("Active wallet with a very small native gas balance");
  }

  return {
    address: normalized,
    txCount,
    activeDays: Math.max(1, Math.min(120, Math.ceil(txCount / 3))),
    stableVolume: indexer.stablecoinVolume,
    dexTouches: Math.min(18, Math.max(indexer.contractInteractionCount, Math.max(0, Math.min(18, Math.floor(txCount / 8))))),
    credentialSignals: indexer.topTokenSymbols.length > 0 ? 2 : txCount > 0 ? 1 : 0,
    riskFlags: [...riskFlags, ...indexer.riskFlags],
    strengths: [...strengths, ...indexer.strengths],
    source: "live-rpc",
    sourceLabel: indexer.status === "synced" ? `${target.name} + Etherscan V2` : target.name,
    nativeBalance,
    nativeSymbol: target.nativeSymbol,
    chainId,
    blockNumber,
    rpcLatencyMs: Math.round(performance.now() - startedAt),
    updatedAt: new Date().toISOString(),
    indexerStatus: indexer.status,
    indexerMessage: indexer.message,
    tokenTransferCount: indexer.tokenTransferCount,
    contractInteractionCount: indexer.contractInteractionCount,
    topTokenSymbols: indexer.topTokenSymbols,
    recentTokenTransfers: indexer.tokenTransfers,
    recentTransactions: indexer.recentTransactions,
  };
}

export async function simulateBnbAgentPayment(
  fromAddress: string,
  target: RpcTarget,
  amountNative = "0.01",
  sessionBudgetNative = "0.05",
): Promise<AgentPaymentSimulation> {
  const from = fromAddress.trim();

  if (!isEvmAddress(from)) {
    throw new Error("Enter a full EVM address before simulating an action.");
  }

  const amountWei = decimalNativeToWei(amountNative);
  const budgetWei = decimalNativeToWei(sessionBudgetNative);
  const [gasPriceHex, gasLimitHex, balanceHex] = await Promise.all([
    callRpc<string>(target, "eth_gasPrice"),
    callRpc<string>(target, "eth_estimateGas", [
      {
        from,
        to: from,
        value: weiToHex(amountWei),
        data: "0x",
      },
    ]),
    callRpc<string>(target, "eth_getBalance", [from, "latest"]),
  ]);
  const gasLimit = BigInt(gasLimitHex);
  const gasPriceWei = BigInt(gasPriceHex);
  const feeWei = gasLimit * gasPriceWei;
  const totalWei = amountWei + feeWei;
  const balanceWei = BigInt(balanceHex);
  const checks = [
    {
      label: `Estimated total is within ${sessionBudgetNative} ${target.nativeSymbol} session budget`,
      passed: totalWei <= budgetWei,
    },
    {
      label: "Wallet balance covers transfer amount plus gas",
      passed: balanceWei >= totalWei,
    },
    {
      label: "No private key or transaction signature requested",
      passed: true,
    },
    {
      label: "Human approval is required before any sendTransaction call",
      passed: true,
    },
  ];
  const passed = checks.every((check) => check.passed);
  const actionName = target.id === "qie-testnet" ? "QIE dry-run action" : "AgentPay simulation";

  return {
    status: passed ? "simulated" : "blocked",
    from,
    to: from,
    amountNative,
    nativeSymbol: target.nativeSymbol,
    gasLimit: Number(gasLimit),
    gasPriceGwei: gasPriceToGweiText(gasPriceWei),
    estimatedFeeNative: weiToNativeText(feeWei),
    sessionBudgetNative,
    approvalRequired: true,
    policyChecks: checks,
    message: passed
      ? `${actionName} passed. The app produced an approval ticket without sending a transaction.`
      : `${actionName} was blocked by at least one policy check.`,
    simulatedAt: new Date().toISOString(),
  };
}
