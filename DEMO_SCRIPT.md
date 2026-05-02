# Demo Video Script

Target length: 2 to 3 minutes.

Recommended format: screen recording with English voiceover and English subtitles.

## Before Recording

- Open the live demo: https://chainagent-radar-5q5euc7w4-yiwangyuai-7161s-projects.vercel.app
- Open the GitHub repo in another tab: https://github.com/dbshiwiejsjdjdjjdj121-sketch/chainagent-radar
- Use a 16:9 screen size.
- Do not show private keys, seed phrases, exchange accounts, or personal documents.
- Speak slowly. It is okay if the English is simple.

## 2-Minute Voiceover

### 0:00 - 0:15 Opening

Hi, this is ChainAgent Radar.

It is an AI wallet intelligence dashboard for BNB Chain. The goal is to help users and builders understand wallet activity, risk, and the next safe action before using an on-chain agent.

### 0:15 - 0:35 Problem

Today, most Web3 tools show raw wallet data, but users still need to decide what the data means.

For AI agents, this is even more important. An agent should not move funds or take actions without clear limits, risk checks, and human approval.

### 0:35 - 1:15 Live BNB Wallet Brief

Now I will run a live wallet brief.

I keep the BNB tab selected, use the sample wallet address, and click "Run AI brief".

The app connects to BNB Smart Chain public RPC in real time. It reads the chain ID, latest block, native BNB balance, transaction count, gas price, and wallet status.

Then ChainAgent Radar converts that raw data into a readiness score, risk level, and recommended next actions.

If an Etherscan API key is configured, the app can also enrich the wallet with token transfers and normal transaction history through Etherscan API V2 using chain ID 56.

### 1:15 - 1:50 AgentPay Guardrail Demo

Next, I click "Simulate AgentPay".

This is not a real transaction. It does not ask for a private key, does not request a signature, and does not broadcast anything on-chain.

Instead, it uses BNB Chain RPC methods like eth_gasPrice and eth_estimateGas to simulate a bounded 0.01 BNB payment action.

The app creates a human approval ticket with gas limit, gas price, estimated fee, session budget, and policy checks.

The key safety rule is simple: the AI agent can prepare an action, but a human must approve before any real wallet transaction.

### 1:50 - 2:20 Submission Pack

Finally, I scroll to the BNB submission pack.

The app generates copy-ready Markdown for the hackathon submission, including the project description, live integration details, demo flow, policy checks, and honest scope disclosure.

This makes ChainAgent Radar reusable for future hackathons. The same product base can be adapted for sponsor-specific wallet intelligence, payment actions, and ecosystem onboarding.

### 2:20 - 2:40 Closing

ChainAgent Radar is built to make AI wallet actions safer and easier to understand.

The current version already uses live BNB Chain RPC data and gas estimation. The next milestones are deeper transaction risk scoring, richer indexer data, and testnet-only wallet signing with explicit human approval.

Thank you for watching.

## If You Want A Shorter Version

Hi, this is ChainAgent Radar, an AI wallet intelligence dashboard for BNB Chain.

It turns a wallet address into a live operating brief with BNB balance, transaction count, latest block, risk level, and recommended next actions.

The app connects to BNB Smart Chain public RPC in real time. When I click "Run AI brief", it reads live chain data and converts raw wallet information into a clear readiness score.

Next, I click "Simulate AgentPay". This is only a dry run. It does not sign or broadcast a transaction. It estimates gas and creates a human approval ticket before any future agent action.

Finally, the app generates a copy-ready submission pack for hackathons. This includes the project description, integration details, demo flow, safety disclosure, and roadmap.

ChainAgent Radar helps users understand wallet risk and gives AI agents a safer path to on-chain actions.

## YouTube Or Loom Title

ChainAgent Radar - AI Wallet Intelligence for BNB Chain

## Video Description

ChainAgent Radar is an AI wallet intelligence dashboard for BNB Chain. It uses live BNB Smart Chain RPC data, optional Etherscan API V2 enrichment, and a safe AgentPay simulation to turn wallet activity into a readiness score, risk explanation, and human-approved action plan.

Live demo: https://chainagent-radar-5q5euc7w4-yiwangyuai-7161s-projects.vercel.app

GitHub: https://github.com/dbshiwiejsjdjdjjdj121-sketch/chainagent-radar

