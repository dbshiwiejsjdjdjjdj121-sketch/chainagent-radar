# Demo Script

Target length: 2-3 minutes.

## Opening

Hi, I am showing BNB ChainAgent Radar, an AI wallet intelligence dashboard for BNB Chain.

The problem is that Web3 users can see raw wallet data, but they often cannot quickly decide what is safe, what is actionable, and how an AI agent should operate without overstepping.

## Live Wallet Brief

First, I open the BNB tab and keep the sample wallet address.

I click `Run AI brief`.

The app syncs live BNB Smart Chain public RPC data. It reads the native BNB balance, transaction count, latest block, chain ID, gas data, and produces a wallet readiness score.

If an Etherscan API key is configured, the app can also enrich the wallet with ERC-20 transfers and normal transaction history through Etherscan API V2 with `chainid=56`.

## AgentPay Guardrail

Next, I click `Simulate AgentPay`.

This does not sign or broadcast a transaction. It only estimates a bounded `0.01 BNB` payment action using `eth_gasPrice` and `eth_estimateGas`.

The app creates a human-approval ticket with gas limit, gas price, estimated fee, session budget, and policy checks.

The important safety rule is that the agent cannot move funds automatically. Human approval is required before any real `sendTransaction` call.

## Submission Pack

Finally, I scroll to the BNB submission pack.

The app generates copy-ready Markdown for the hackathon form: project description, integration details, demo flow, policy checks, sponsor fit, and honest scope disclosure.

## Closing

BNB ChainAgent Radar turns live wallet data into a safe AI operating brief. The current demo already uses BNB RPC and gas estimation, and the next milestone is to add richer indexer data, approval risk scoring, and sponsor-specific payment actions.

