import type { AnalysisResult, Ecosystem, WalletSnapshot } from "../types";

export function shortenAddress(address: string) {
  if (address.length <= 14) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function createAnalysis(ecosystem: Ecosystem, snapshot: WalletSnapshot): AnalysisResult {
  const activityScore = Math.min(35, snapshot.activeDays * 2 + snapshot.dexTouches);
  const nativeBalance = Number(snapshot.nativeBalance ?? 0);
  const valueScore = snapshot.stableVolume > 0
    ? Math.min(25, Math.round(snapshot.stableVolume / 160))
    : Math.min(25, Math.round(nativeBalance * 18) + Math.min(12, Math.round(snapshot.txCount / 12)));
  const proofScore = Math.min(20, snapshot.credentialSignals * 5 + snapshot.strengths.length * 2);
  const riskPenalty = snapshot.riskFlags.length * 6;
  const score = Math.max(38, Math.min(96, 28 + activityScore + valueScore + proofScore - riskPenalty));
  const riskLevel = score > 78 ? "Low" : score > 58 ? "Medium" : "High";
  const topHook = ecosystem.sponsorHooks[0];
  const indexerSummary = snapshot.indexerStatus === "synced"
    ? `, plus ${snapshot.tokenTransferCount ?? 0} indexed token transfers and ${snapshot.contractInteractionCount ?? 0} contract methods`
    : "";
  const valueSummary = snapshot.source === "live-rpc"
    ? `${snapshot.nativeBalance ?? "0"} ${snapshot.nativeSymbol ?? ""} native balance, ${snapshot.blockNumber?.toLocaleString() ?? "latest"} verified block${indexerSummary}`
    : `$${snapshot.stableVolume.toLocaleString()} in stablecoin-style demo volume`;

  return {
    score,
    riskLevel,
    summary: `${shortenAddress(snapshot.address)} shows enough activity to support a ${ecosystem.name} demo, with ${snapshot.txCount} transactions, ${snapshot.dexTouches} action clusters, and ${valueSummary}.`,
    signals: [
      `${ecosystem.chainLabel} adapter: ${ecosystem.adapterStatus}`,
      `Data source: ${snapshot.sourceLabel}`,
      `Indexer: ${snapshot.indexerStatus ?? "not configured"}`,
      `Sponsor hook: ${topHook}`,
      `Activity density: ${snapshot.activeDays} active days`,
      `Credential signal count: ${snapshot.credentialSignals}`,
    ],
    nextActions: ecosystem.demoActions.map((action) => `${action.label}: ${action.detail}`),
    judgeNarrative: `For ${ecosystem.contest}, ChainAgent Radar turns raw wallet behavior into a clear AI operating brief. The demo highlights ${ecosystem.sponsorHooks.slice(0, 3).join(", ")} so judges can see a contest-specific integration instead of a generic dashboard.`,
  };
}
