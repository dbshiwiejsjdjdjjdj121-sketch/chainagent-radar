# QIE Growth Copilot Submission Draft

## Project Name

QIE Growth Copilot

## Category

AI + Web3

Backup category: Infrastructure & Tools

## Short Description

QIE Growth Copilot is an AI wallet intelligence dashboard for QIE builders. It reads QIE testnet wallet activity, explains readiness and risks in plain English, recommends ecosystem-native growth actions, and anchors the generated AI brief hash in a QIE testnet proof contract.

## Long Description

QIE has the core pieces for Web3 adoption: a fast EVM-compatible chain, wallet onboarding, explorer visibility, low-cost transactions, and ecosystem applications. The problem is that builders and new users often see raw addresses and transactions without knowing what they mean or what to do next.

QIE Growth Copilot turns QIE wallet activity into a readable AI operating brief. A user can paste a QIE testnet wallet, run a live RPC check, review readiness, risk, native balance, transaction count, latest block, and recommended next actions. For the hackathon proof, the project includes a small `QIEGrowthProof` contract that stores a hash of the generated growth brief on QIE testnet.

The result is a judge-friendly, QIE-native workflow: wallet data in, AI growth brief out, proof hash anchored on QIE testnet, and a clear adoption story for helping QIE teams reach their first active users.

## Problem

Wallet data is public, but it is not immediately useful for growth, onboarding, or safe AI-agent action. Builders need a simple way to understand wallet readiness, explain risk, and connect activity to ecosystem actions.

## Solution

QIE Growth Copilot provides:

- QIE testnet wallet brief from public RPC data.
- AI-readable readiness score and risk explanation.
- Recommended QIE ecosystem growth actions.
- QIE testnet proof contract for anchoring the generated brief hash.
- Copy-ready submission pack and demo flow for transparent review.

## QIE Integration

- Network: QIE Testnet
- Chain ID: 1983
- RPC: `https://rpc1testnet.qie.digital/`
- Explorer: `https://testnet.qie.digital`
- Contract: `0xB46D14828d4f20cEFD7fbE69b081b1ffAa94D68F`
- Deployment transaction: `0xa451f4ababc6fa9ea92bcd6a3ca7483f1ef9bce3fd22e1ee2ba0d225c7cf58d2`
- Sample proof transaction: `0xb2cbf45455a9cac4a9843ff6d96ce562204c76a3d622bea64ffdd7261a65bb1d`
- Report hash: `0x0e8ae57119b5b6da9a5b0be4f7ef99cee18ee71ee819c6b5f181861a76340423`

## Links

- Live demo: https://chainagent-radar-p9wdvpb0m-yiwangyuai-7161s-projects.vercel.app/?contest=qie
- GitHub: https://github.com/dbshiwiejsjdjdjjdj121-sketch/chainagent-radar
- Demo video: pending
- X post: pending

Final copy-paste pack: `QIE_FINAL_SUBMISSION_PACK.md`

## Disclosure

This project reuses the ChainAgent Radar frontend shell and submission workflow, but the QIE hackathon version adds QIE-specific positioning, QIE testnet RPC configuration, a dedicated QIEGrowthProof smart contract, QIE-specific README/script materials, and a separate demo flow. AI assistance was used for coding, copywriting, and planning; the final submission is reviewed and operated by the team.
