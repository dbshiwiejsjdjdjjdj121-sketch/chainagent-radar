import type { AgentPaymentSimulation, AnalysisResult, Ecosystem, WalletSnapshot } from "../types";
import { shortenAddress } from "./analysis";

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
  const liveData = [
    `Data source: ${snapshot.sourceLabel}`,
    `Wallet: ${snapshot.address}`,
    `Readiness score: ${analysis.score}/100`,
    `Risk level: ${analysis.riskLevel}`,
    `BNB balance: ${snapshot.nativeBalance ? `${snapshot.nativeBalance} ${snapshot.nativeSymbol}` : "not synced"}`,
    `Latest block: ${snapshot.blockNumber?.toLocaleString() ?? "not synced"}`,
    `Transactions: ${snapshot.txCount.toLocaleString()}`,
    `Indexer status: ${snapshot.indexerStatus ?? "not configured"}`,
    `Token transfers: ${(snapshot.tokenTransferCount ?? 0).toLocaleString()}`,
    `Contract methods: ${(snapshot.contractInteractionCount ?? 0).toLocaleString()}`,
  ];
  const agentPay = simulation
    ? [
        `Simulation status: ${simulation.status}`,
        `Dry-run amount: ${simulation.amountNative} ${simulation.nativeSymbol}`,
        `Gas limit: ${simulation.gasLimit.toLocaleString()}`,
        `Gas price: ${simulation.gasPriceGwei} gwei`,
        `Estimated fee: ${simulation.estimatedFeeNative} ${simulation.nativeSymbol}`,
        `Session budget: ${simulation.sessionBudgetNative} ${simulation.nativeSymbol}`,
        `Approval required: ${simulation.approvalRequired ? "yes" : "no"}`,
      ]
    : ["Run the AgentPay simulation before recording the final demo."];
  const policyChecks = simulation
    ? simulation.policyChecks.map((check) => `${check.passed ? "[pass]" : "[block]"} ${check.label}`)
    : ["[pending] AgentPay policy checks not generated yet."];

  return `# BNB ChainAgent Radar

## Short Description

BNB ChainAgent Radar is an AI wallet intelligence dashboard for BNB Chain. It turns a wallet address into a live operating brief with RPC data, optional Etherscan V2 indexer enrichment, risk signals, sponsor-specific next actions, and an AgentPay approval simulation.

## Problem

Web3 users and builders can see raw wallet data, but they often cannot quickly decide what is safe, what is actionable, and how an AI agent should operate without overstepping. ChainAgent Radar converts wallet and transaction data into a clear, judge-friendly action brief.

## Live Demo Flow

1. Open the BNB tab.
2. Paste or keep the sample wallet ${shortenAddress(snapshot.address)}.
3. Click \`Run AI brief\` to sync live BNB RPC data.
4. Review wallet score, risk level, balance, latest block, token/indexer status, and recommended actions.
5. Click \`Simulate AgentPay\` to estimate gas and produce a human-approval ticket.
6. Explain that no private key is requested and no transaction is broadcast.

## Current Integration

${list(liveData)}

## AgentPay Guardrail

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

This demo uses live BNB RPC data and optional Etherscan API V2 enrichment. The AgentPay flow is a dry-run approval simulation only: it estimates gas and checks policy rules, but does not sign or broadcast transactions. Production deployment should proxy indexer calls through a backend and move real signing to testnet-only safeguards first.
`;
}

