# ChainAgent Radar

AI wallet intelligence for online Web3 hackathons.

ChainAgent Radar turns a Web3 wallet address into a live operating brief: native balance, transaction activity, latest block verification, risk signals, sponsor-specific next actions, and a safe action-approval simulation.

## Live Preview

Current Vercel preview: https://chainagent-radar-p9wdvpb0m-yiwangyuai-7161s-projects.vercel.app

QIE Growth Copilot view: https://chainagent-radar-p9wdvpb0m-yiwangyuai-7161s-projects.vercel.app/?contest=qie

BNB contest recording view: https://chainagent-radar-p9wdvpb0m-yiwangyuai-7161s-projects.vercel.app/?contest=bnb

0G contest proof view: https://chainagent-radar-p9wdvpb0m-yiwangyuai-7161s-projects.vercel.app/?contest=zerog

Public GitHub repository: https://github.com/dbshiwiejsjdjdjjdj121-sketch/chainagent-radar

## Hackathon Focus

Current primary target: **QIE Blockchain Hackathon 2026**.

The project is designed as a reusable Web3 prize motherbase. BNB and 0G are previous/live examples; QIE is now the next dedicated contest version with QIE testnet RPC and a proof-contract workflow.

Submitted target: **0G APAC Hackathon** via `/?contest=zerog`.

## Motherbase Rule

This repository has two roles:

- Motherbase mode: internal operating console for tracking BNB, Mantle, QIE, and Sharp/HackIndia adapters.
- Contest mode: single-event public demo version for one hackathon at a time.

Do not record or submit the motherbase view as-is. Each final contest submission should hide unrelated ecosystems, use contest-specific copy, include only relevant integrations, and receive its own demo script and disclosure.

## What Works Now

- Live BNB Smart Chain public RPC sync for a pasted EVM address.
- Native BNB balance, transaction count, latest block, chain ID, and RPC latency.
- Optional Etherscan API V2 indexer enrichment for BNB ERC-20 transfers and normal transactions.
- QIE Testnet public RPC sync for a pasted EVM address.
- QIEGrowthProof Solidity contract deployed on QIE Testnet.
- Action guardrail simulation using `eth_gasPrice` and `eth_estimateGas`.
- Human-approval policy ticket before any future transaction path.
- Copy-ready BNB submission pack generated from the current wallet, risk, indexer, and AgentPay state.
- Sponsor-specific action cards for QIE, BNB, Mantle, 0G, and Sharp/HackIndia adaptations.
- Isolated per-contest state so BNB live RPC data and AgentPay simulations do not leak into QIE, Mantle, or Sharp/HackIndia blueprint views.
- `?contest=bnb` recording mode that hides unrelated contests and presents the project as a dedicated BNB Hack submission.
- `?contest=zerog` preparation mode for 0G Agent Memory Radar, including an agent memory payload and required 0G proof checklist.
- `?contest=qie` build mode with QIE testnet RPC, QIE-specific copy, and proof-contract readiness checks.

## QIE Demo Flow

1. Open the QIE contest build view: `/?contest=qie`.
2. Paste a QIE testnet wallet address or keep the sample address.
3. Click `Run QIE Brief`.
4. Review QIE native balance, transaction count, latest block, readiness score, risk level, and recommended growth actions.
5. After faucet funding, deploy `QIEGrowthProof` and record the proof transaction.
6. Click `Copy submission` in the QIE submission pack.

## BNB Demo Flow

1. Open the BNB contest recording view: `/?contest=bnb`.
2. Paste a full EVM address or keep the sample wallet.
3. Click `Run BNB live brief`.
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

## QIE Integration

- Public RPC: `https://rpc1testnet.qie.digital/`
- Chain ID: `1983`
- Explorer: `https://testnet.qie.digital`
- Faucet: `https://www.qie.digital/faucet`
- Contract source: `contracts/QIEGrowthProof.sol`
- Deployed contract: `0xB46D14828d4f20cEFD7fbE69b081b1ffAa94D68F`
- Deployment tx: `0xa451f4ababc6fa9ea92bcd6a3ca7483f1ef9bce3fd22e1ee2ba0d225c7cf58d2`
- Sample proof tx: `0xb2cbf45455a9cac4a9843ff6d96ce562204c76a3d622bea64ffdd7261a65bb1d`
- Report hash: `0x0e8ae57119b5b6da9a5b0be4f7ef99cee18ee71ee819c6b5f181861a76340423`
- Deploy dry run: `npm run qie:dry-run`
- Deploy after faucet funding: `npm run qie:deploy`

## Environment

Copy `.env.example` to `.env.local` if you want optional token/indexer enrichment:

```bash
VITE_ETHERSCAN_API_KEY=your_key_here
```

Vite client env variables are visible in the browser bundle. This is acceptable for a hackathon demo with a low-risk key. Production should proxy indexer calls through a backend.

For QIE deployment, add only a dedicated test-wallet key to `.env.local`:

```bash
QIE_PRIVATE_KEY=your_dedicated_test_wallet_private_key
QIE_SUBJECT_ADDRESS=0xYourQieTestWallet
```

Do not use a main wallet private key.

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
- [QIE_BUILD_PLAN.md](./QIE_BUILD_PLAN.md)
- [QIE_SUBMISSION_DRAFT.md](./QIE_SUBMISSION_DRAFT.md)
- [QIE_DEMO_SCRIPT.md](./QIE_DEMO_SCRIPT.md)
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
- [SUBMISSION_ANSWERS.md](./SUBMISSION_ANSWERS.md)
- [DISCLOSURE.md](./DISCLOSURE.md)
- [ZERO_G_SUBMISSION_DRAFT.md](./ZERO_G_SUBMISSION_DRAFT.md)
- [ZERO_G_FINAL_SUBMISSION.md](./ZERO_G_FINAL_SUBMISSION.md)
- [ZERO_G_DEMO_SCRIPT.md](./ZERO_G_DEMO_SCRIPT.md)
- [ZERO_G_UPLOAD.md](./ZERO_G_UPLOAD.md)

## Adaptation Rule

Do not submit this generic motherbase unchanged to multiple contests. Each contest should receive a new repo branch or folder with event-specific integrations, README, demo script, and disclosure file.
