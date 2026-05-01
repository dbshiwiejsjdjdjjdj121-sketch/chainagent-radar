# BNB ChainAgent Submission Draft

## Project Name

BNB ChainAgent Radar

## Live Demo

https://chainagent-radar-5q5euc7w4-yiwangyuai-7161s-projects.vercel.app

## Short Description

BNB ChainAgent Radar is an AI wallet intelligence dashboard that turns a BNB Smart Chain wallet address into a live operating brief: native balance, transaction activity, latest block verification, risk signals, and sponsor-specific next actions.

## Why It Fits BNB Hack

- Uses live BNB Smart Chain public RPC data.
- Focuses on AI-powered wallet analysis and business intelligence.
- Creates a working guardrail path toward agentic wallet actions, payment sessions, and stablecoin workflows.
- Designed for rolling BNB Hack submissions, where each update can add a new sponsor adapter.

## Current Live Integration

- Public BNB RPC: `https://bsc-dataseed1.bnbchain.org/`
- Methods used: `eth_getBalance`, `eth_getTransactionCount`, `eth_blockNumber`, `eth_chainId`, `eth_gasPrice`, `eth_estimateGas`
- Optional Etherscan API V2 indexer: `chainid=56`, `module=account`, `action=tokentx` and `action=txlist`
- Output: wallet readiness score, native BNB balance, latest block, token transfer count, contract method count, activity density, risk flags, recommended next actions, and a human-approval AgentPay simulation
- Submission pack: copy-ready Markdown generated in-app after the live brief and AgentPay simulation

## Demo Script

1. Open the BNB tab.
2. Paste a full EVM wallet address or use the public sample wallet.
3. Click `Run AI brief`.
4. Show the Live RPC banner, BNB balance, latest block, and transaction count.
5. If an API key is configured, show the indexer panel with ERC-20 transfers, contract methods, top token symbols, and stablecoin-style volume.
6. Click `Simulate AgentPay`.
7. Show the approval ticket: gas limit, gas price, estimated fee, session budget, and policy checks.
8. Open the BNB submission pack panel and copy the generated Markdown.
9. Explain how ChainAgent Radar converts raw wallet/indexer data into safe next actions for BNB users and builders.
10. Show the future action path: stablecoin payment flow, sponsor-specific agent tools, and bi-weekly submission pack.

## Honest Scope Disclosure

This version uses live BNB RPC data for wallet balance, nonce, latest block, chain ID, gas price, and gas estimation. It can optionally enrich the snapshot with Etherscan API V2 token transfers and normal transactions when `VITE_ETHERSCAN_API_KEY` is configured. The AgentPay simulation does not sign or broadcast transactions; it only creates a policy-checked approval ticket.

## Next Milestones

- Add wallet risk rules for contract approvals, failed transactions, and unusual activity spikes.
- Add a BNB sponsor adapter for stablecoin payment or agent wallet actions.
- Add a real wallet signing path behind explicit human approval and testnet-only safeguards.
