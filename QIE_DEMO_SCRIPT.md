# QIE Growth Copilot Demo Script

Target length: 60-90 seconds.

Live demo: https://chainagent-radar-p9wdvpb0m-yiwangyuai-7161s-projects.vercel.app/?contest=qie

## Opening

Hi, this is QIE Growth Copilot, an AI wallet intelligence and growth-readiness dashboard built for the QIE Blockchain Hackathon.

The problem is simple: QIE builders can see raw wallet data, but they still need a quick way to understand whether a wallet is active, low-risk, and ready for the next ecosystem action.

## Demo Flow

First, I open the QIE-specific demo. This is not a generic dashboard; it uses QIE Testnet, a QIE-funded wallet, and a deployed QIE proof contract.

I keep the sample QIE wallet and click `Run QIE Brief`. The app reads public QIE RPC data, including QIE balance, transaction count, and latest block.

The AI Growth Brief turns those raw signals into a readiness score, a low-risk status, and three recommended actions for QIE builders.

Next, the proof section shows the deployed `QIEGrowthProof` contract. The generated growth brief hash is anchored on QIE Testnet, so judges can inspect the contract, proof transaction, and report hash directly in the QIE explorer.

The deployed QIE proof contract is `0xB46D14828d4f20cEFD7fbE69b081b1ffAa94D68F`, and the sample proof transaction is `0xb2cbf45455a9cac4a9843ff6d96ce562204c76a3d622bea64ffdd7261a65bb1d`.

## Closing

QIE Growth Copilot helps QIE ecosystem teams move from raw testnet activity to clear AI-guided growth decisions.

The current hackathon build includes a public repo, live demo, QIE Testnet integration, and an explorer-verifiable proof-contract workflow.
