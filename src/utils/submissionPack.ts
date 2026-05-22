import type { AgentPaymentSimulation, AnalysisResult, Ecosystem, WalletSnapshot } from "../types";
import { shortenAddress } from "./analysis";
import { qieProof } from "../data/qieProof";
import { formatShortHash, zeroGProof } from "../data/zeroGProof";

type SubmissionPackInput = {
  ecosystem: Ecosystem;
  snapshot: WalletSnapshot;
  analysis: AnalysisResult;
  simulation: AgentPaymentSimulation | null;
};

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function createSubmissionMarkdown({ ecosystem, snapshot, analysis, simulation }: SubmissionPackInput) {
  const hasLiveRpc = Boolean(ecosystem.rpcTarget && snapshot.source === "live-rpc");
  const projectName =
    ecosystem.id === "bnb"
      ? "BNB ChainAgent Radar"
      : ecosystem.id === "zerog"
        ? "0G Agent Memory Radar"
        : ecosystem.id === "qie"
          ? "QIE Growth Copilot"
          : `ChainAgent Radar for ${ecosystem.name}`;
  const liveData = [
    `Data source: ${snapshot.sourceLabel}`,
    `Wallet: ${snapshot.address}`,
    `Readiness score: ${analysis.score}/100`,
    `Risk level: ${analysis.riskLevel}`,
    `Native balance: ${hasLiveRpc && snapshot.nativeBalance ? `${snapshot.nativeBalance} ${snapshot.nativeSymbol}` : "not synced"}`,
    `Latest block: ${hasLiveRpc ? snapshot.blockNumber?.toLocaleString() ?? "not synced" : "not synced"}`,
    `Transactions: ${snapshot.txCount.toLocaleString()}`,
    `Indexer status: ${snapshot.indexerStatus ?? "not configured"}`,
    `Token transfers: ${(snapshot.tokenTransferCount ?? 0).toLocaleString()}`,
    `Contract methods: ${(snapshot.contractInteractionCount ?? 0).toLocaleString()}`,
  ];
  const adapterPlan = [
    `Contest: ${ecosystem.contest}`,
    `Track: ${ecosystem.track}`,
    `Chain target: ${ecosystem.chainLabel}`,
    `Adapter status: ${ecosystem.adapterStatus}`,
    `Required next integration: ecosystem-native SDK/API calls before final recording`,
  ];
  const qieProofItems = [
    `Network: ${qieProof.network}`,
    `Chain ID: ${qieProof.chainId}`,
    `RPC: ${qieProof.rpcUrl}`,
    `Explorer: ${qieProof.explorerUrl}`,
    `Contract status: ${qieProof.status === "deployed" ? qieProof.deployment.contractAddress : "ready to deploy after faucet funding"}`,
    `Faucet: ${qieProof.faucetUrl}`,
  ];
  const actionDemoName = ecosystem.id === "qie" ? "QIE dry-run action" : "AgentPay simulation";
  const agentPay = ecosystem.rpcTarget && simulation
    ? [
        `Simulation status: ${simulation.status}`,
        `Dry-run amount: ${simulation.amountNative} ${simulation.nativeSymbol}`,
        `Gas limit: ${simulation.gasLimit.toLocaleString()}`,
        `Gas price: ${simulation.gasPriceGwei} gwei`,
        `Estimated fee: ${simulation.estimatedFeeNative} ${simulation.nativeSymbol}`,
        `Session budget: ${simulation.sessionBudgetNative} ${simulation.nativeSymbol}`,
        `Approval required: ${simulation.approvalRequired ? "yes" : "no"}`,
    ]
    : ecosystem.rpcTarget
      ? [`Run the ${actionDemoName} before recording the final ${ecosystem.name} demo.`]
      : ["No live AgentPay simulator is enabled for this contest adapter yet.", ...adapterPlan];
  const policyChecks = ecosystem.rpcTarget && simulation
    ? simulation.policyChecks.map((check) => `${check.passed ? "[pass]" : "[block]"} ${check.label}`)
    : ecosystem.rpcTarget
      ? ["[pending] AgentPay policy checks not generated yet."]
      : ["[pending] Replace blueprint with a live contest-specific action before final submission."];
  const zeroGProofItems = [
    "0G component: 0G Storage memory record",
    `Status: uploaded on ${zeroGProof.network}`,
    `Root hash: ${zeroGProof.rootHash}`,
    `Transaction hash: ${zeroGProof.txHash}`,
    `Signer: ${zeroGProof.signerAddress}`,
    `Payload SHA-256: ${zeroGProof.payloadSha256}`,
    `0G ChainScan: ${zeroGProof.chainScanUrl}`,
    `0G StorageScan: ${zeroGProof.storageScanUrl} (search ${formatShortHash(zeroGProof.rootHash)})`,
  ];

  return `# ${projectName}

## Short Description

${projectName} is an AI wallet intelligence dashboard for ${ecosystem.name}. It turns wallet and ecosystem activity into a contest-specific operating brief with risk signals, sponsor-specific next actions, and a clear submission pack.

## Problem

Web3 users and builders can see raw wallet data, but they often cannot quickly decide what is safe, what is actionable, and how an AI agent should operate without overstepping. ChainAgent Radar converts wallet and transaction data into a clear, judge-friendly action brief for ${ecosystem.contest}.

## Live Demo Flow

1. Open the ${ecosystem.name} tab.
2. Paste or keep the sample wallet ${shortenAddress(snapshot.address)}.
3. Click \`${ecosystem.rpcTarget ? "Run AI brief" : "Refresh blueprint"}\`.
4. Review wallet score, risk level, sponsor hooks, adapter status, and recommended actions.
5. ${ecosystem.rpcTarget ? `Click \`Simulate ${actionDemoName}\` to estimate gas and produce a human-approval ticket.` : "Explain the adapter blueprint and what must become live before the final contest video."}
6. Explain the honest scope disclosure and next integration milestone.

## Current Integration

${list(liveData)}

${ecosystem.id === "zerog" ? `## 0G Integration Proof Checklist

${list(zeroGProofItems)}
` : ""}
${ecosystem.id === "qie" ? `## QIE Integration Proof Checklist

${list(qieProofItems)}
` : ""}

## Action Guardrail

${list(agentPay)}

## Policy Checks

${list(policyChecks)}

## Sponsor Fit

${list(ecosystem.sponsorHooks)}

## AI Brief

${analysis.summary}

${analysis.judgeNarrative}

## Recommended Next Actions

${list(analysis.nextActions)}

## Honest Scope Disclosure

${ecosystem.rpcTarget
    ? ecosystem.id === "qie"
      ? "This QIE demo uses public QIE testnet RPC data and a small proof-contract workflow. The payment/action flow is a dry-run approval simulation only: it estimates gas and checks policy rules, but does not sign or broadcast transactions from the browser. The final hackathon version should show the deployed QIEGrowthProof contract and explorer transaction."
      : "This demo uses live BNB RPC data and optional Etherscan API V2 enrichment. The AgentPay flow is a dry-run approval simulation only: it estimates gas and checks policy rules, but does not sign or broadcast transactions. Production deployment should proxy indexer calls through a backend and move real signing to testnet-only safeguards first."
    : ecosystem.id === "zerog"
      ? "This is the 0G-specific contest version of the ChainAgent Radar shell. The current build includes a real Galileo testnet 0G Storage upload proof for the generated agent-memory payload; production use should add deeper Agent ID integration and richer live wallet indexing."
    : `This is a ${ecosystem.name} contest blueprint inside the ChainAgent Radar motherbase. It must receive a live ${ecosystem.chainLabel} integration, contest-specific README, and dedicated demo video before final submission.`}
`;
}
