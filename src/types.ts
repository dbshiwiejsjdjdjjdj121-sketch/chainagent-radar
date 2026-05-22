export type EcosystemId = "mantle" | "qie" | "bnb" | "zerog" | "hackindia";

export type ActionType = "swap" | "credential" | "payment" | "report";

export type Ecosystem = {
  id: EcosystemId;
  name: string;
  contest: string;
  deadline: string;
  track: string;
  prizeShape: string;
  chainLabel: string;
  primaryColor: string;
  accentColor: string;
  adapterStatus: "ready" | "mocked" | "needs-sdk";
  rpcTarget?: RpcTarget;
  sponsorHooks: string[];
  demoActions: Array<{
    type: ActionType;
    label: string;
    detail: string;
  }>;
};

export type RpcTarget = {
  id: "bnb-mainnet" | "bnb-testnet" | "qie-testnet";
  name: string;
  chainId: number;
  nativeSymbol: string;
  rpcUrl: string;
  explorerUrl: string;
};

export type SnapshotSource = "demo" | "live-rpc";

export type IndexerStatus = "not-configured" | "synced" | "partial" | "error";

export type TransferDirection = "in" | "out" | "self";

export type TokenTransfer = {
  hash: string;
  tokenSymbol: string;
  tokenName: string;
  value: string;
  direction: TransferDirection;
  counterparty: string;
  timestamp: string;
  contractAddress: string;
};

export type NormalTransaction = {
  hash: string;
  direction: TransferDirection;
  valueNative: string;
  method: string;
  timestamp: string;
  isError: boolean;
};

export type AgentPaymentSimulation = {
  status: "simulated" | "blocked";
  from: string;
  to: string;
  amountNative: string;
  nativeSymbol: string;
  gasLimit: number;
  gasPriceGwei: string;
  estimatedFeeNative: string;
  sessionBudgetNative: string;
  approvalRequired: boolean;
  policyChecks: Array<{
    label: string;
    passed: boolean;
  }>;
  message: string;
  simulatedAt: string;
};

export type WalletSnapshot = {
  address: string;
  txCount: number;
  activeDays: number;
  stableVolume: number;
  dexTouches: number;
  credentialSignals: number;
  riskFlags: string[];
  strengths: string[];
  source: SnapshotSource;
  sourceLabel: string;
  nativeBalance?: string;
  nativeSymbol?: string;
  chainId?: number;
  blockNumber?: number;
  rpcLatencyMs?: number;
  updatedAt?: string;
  indexerStatus?: IndexerStatus;
  indexerMessage?: string;
  tokenTransferCount?: number;
  contractInteractionCount?: number;
  topTokenSymbols?: string[];
  recentTokenTransfers?: TokenTransfer[];
  recentTransactions?: NormalTransaction[];
};

export type AnalysisResult = {
  score: number;
  summary: string;
  riskLevel: "Low" | "Medium" | "High";
  signals: string[];
  nextActions: string[];
  judgeNarrative: string;
};

declare global {
  interface Window {
    ethereum?: {
      request: <T = unknown>(args: { method: string; params?: unknown[] }) => Promise<T>;
    };
  }
}
