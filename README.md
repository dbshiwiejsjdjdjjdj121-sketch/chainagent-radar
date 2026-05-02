# ChainAgent Radar

AI wallet intelligence for online Web3 hackathons.

ChainAgent Radar turns a BNB Chain wallet address into a live operating brief: native balance, transaction activity, latest block verification, risk signals, sponsor-specific next actions, and a safe AgentPay approval simulation.

## Live Preview

Current Vercel preview: https://chainagent-radar-5q5euc7w4-yiwangyuai-7161s-projects.vercel.app

Public GitHub repository: https://github.com/dbshiwiejsjdjdjjdj121-sketch/chainagent-radar

## Hackathon Focus

Current primary target: **BNB Hack: Online Edition**.

The project is designed as a reusable Web3 prize motherbase. BNB is the first live version; Mantle, QIE, and Sharp/HackIndia can receive separate contest-specific versions with new integrations and disclosures.

## What Works Now

- Live BNB Smart Chain public RPC sync for a pasted EVM address.
- Native BNB balance, transaction count, latest block, chain ID, and RPC latency.
- Optional Etherscan API V2 indexer enrichment for BNB ERC-20 transfers and normal transactions.
- AgentPay guardrail simulation using `eth_gasPrice` and `eth_estimateGas`.
- Human-approval policy ticket before any future transaction path.
- Copy-ready BNB submission pack generated from the current wallet, risk, indexer, and AgentPay state.
- Sponsor-specific action cards for BNB, Mantle, QIE, and Sharp/HackIndia adaptations.

## Demo Flow

1. Open the BNB tab.
2. Paste a full EVM address or keep the sample wallet.
3. Click `Run AI brief`.
4. Review live BNB balance, latest block, readiness score, risk level, and sponsor actions.
5. Click `Simulate AgentPay`.
6. Review gas limit, gas price, estimated fee, session budget, and policy checks.
7. Click `Copy Markdown` in the BNB submission pack.

## BNB Integration

Baseline RPC does not require an API key.

- Public RPC: `https://bsc-dataseed1.bnbchain.org/`
- RPC methods: `eth_getBalance`, `eth_getTransactionCount`, `eth_blockNumber`, `eth_chainId`, `eth_gasPrice`, `eth_estimateGas`
- Optional indexer: Etherscan API V2 with `chainid=56`
- Optional indexer actions: `tokentx`, `txlist`

## Environment

Copy `.env.example` to `.env.local` if you want optional token/indexer enrichment:

```bash
VITE_ETHERSCAN_API_KEY=your_key_here
```

Vite client env variables are visible in the browser bundle. This is acceptable for a hackathon demo with a low-risk key. Production should proxy indexer calls through a backend.

## Safety Scope

The AgentPay demo does not send transactions and does not ask for a signature. It estimates a bounded `0.01 BNB` self-transfer, calculates gas fee, checks the action against a `0.05 BNB` session budget, and produces a human-approval ticket.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md).

## Submission Materials

- [BNB_SUBMISSION_DRAFT.md](./BNB_SUBMISSION_DRAFT.md)
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
- [SUBMISSION_ANSWERS.md](./SUBMISSION_ANSWERS.md)
- [DISCLOSURE.md](./DISCLOSURE.md)

## Adaptation Rule

Do not submit this generic motherbase unchanged to multiple contests. Each contest should receive a new repo branch or folder with event-specific integrations, README, demo script, and disclosure file.
