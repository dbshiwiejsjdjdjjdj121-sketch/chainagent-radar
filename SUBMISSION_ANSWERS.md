# Submission Answers

## Project Name

BNB ChainAgent Radar

## One-Line Summary

AI wallet intelligence for BNB Chain with live RPC analysis, optional indexer enrichment, and a safe AgentPay approval simulation.

## Links

- Live demo: https://chainagent-radar-q68jzwivy-yiwangyuai-7161s-projects.vercel.app/?contest=bnb
- GitHub repository: https://github.com/dbshiwiejsjdjdjjdj121-sketch/chainagent-radar
- Demo video: pending recording

## Short Description

BNB ChainAgent Radar turns a BNB wallet address into a live operating brief. It reads BNB Smart Chain RPC data, summarizes wallet readiness and risk, optionally enriches activity through Etherscan API V2, and simulates a bounded AgentPay action with gas estimation and human approval checks.

## Problem

Web3 users and builders often see raw wallet activity without a clear answer to: what is safe, what should happen next, and how should an AI agent act without accidentally moving funds. BNB ChainAgent Radar converts wallet data into a judge-friendly action brief and adds guardrails before any agent payment action.

## BNB Integration

- BNB Smart Chain public RPC: `https://bsc-dataseed1.bnbchain.org/`
- RPC methods: `eth_getBalance`, `eth_getTransactionCount`, `eth_blockNumber`, `eth_chainId`, `eth_gasPrice`, `eth_estimateGas`
- Optional Etherscan API V2 with `chainid=56`
- Optional account actions: `tokentx`, `txlist`

## Main Features

- Live wallet balance, transaction count, chain ID, and latest block.
- AI-style readiness score and risk narrative.
- Optional ERC-20 transfer and transaction enrichment.
- AgentPay dry-run simulation with gas estimate and session budget checks.
- Human approval policy checks before any future signing path.
- Copy-ready Markdown submission pack.

## Safety Disclosure

The AgentPay demo does not request a private key, does not request a signature, and does not broadcast a transaction. It only estimates gas and generates an approval ticket. Any production signing path should be testnet-first, explicit, and protected by human approval.

## Demo Flow

1. Open the BNB contest recording view.
2. Click `Run BNB live brief`.
3. Show live BNB balance, latest block, and wallet readiness score.
4. Show optional indexer panel.
5. Click `Simulate AgentPay`.
6. Show gas limit, gas price, fee, budget, and policy checks.
7. Click `Copy Markdown` to generate the submission pack.

## What Is New / Built For This Submission

- BNB RPC adapter.
- Optional Etherscan V2 indexer adapter.
- AgentPay gas simulation.
- Human approval policy ticket.
- BNB submission pack generator.

## Roadmap

- Add approval and contract-risk detection.
- Add token-level risk scoring from indexer data.
- Add a sponsor-specific stablecoin/payment action.
- Add testnet-only real wallet signing behind explicit human approval.
- Package Mantle and QIE versions with separate integrations and disclosures.
