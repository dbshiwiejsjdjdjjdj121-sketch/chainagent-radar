# QIE Growth Copilot Build Plan

Updated: 2026-05-22, Asia/Shanghai

## Goal

Submit a dedicated QIE Hackathon project instead of recycling the 0G build. The project should show real QIE testnet usage, a clear AI + Web3 story, and an honest proof trail that judges can verify.

## Project Positioning

QIE Growth Copilot is an AI wallet intelligence and growth-readiness dashboard for QIE builders. It reads a QIE testnet wallet, explains activity and risk in plain English, recommends ecosystem-native next actions, and anchors a generated growth brief hash in a QIE testnet proof contract.

## Why This Fits QIE

- AI + Web3: AI turns wallet activity into a readable operating brief.
- Infrastructure & Tools: builders get a dashboard for onboarding and user-growth decisions.
- QIE-native proof: the demo uses QIE testnet RPC and a QIEGrowthProof contract.
- Adoption story: the output is framed around helping QIE projects reach their first active users.

## Current Status

- QIE testnet RPC target is wired in the app.
- QIE contest mode now has dedicated copy, readiness checks, and submission pack text.
- `contracts/QIEGrowthProof.sol` matches the Remix-deployed proof contract.
- `QIEGrowthProof` is deployed on QIE Testnet.
- A sample growth brief hash has been recorded on-chain.

## QIE Network Inputs

- Network name: QIE Testnet
- Chain ID: 1983
- RPC URL: `https://rpc1testnet.qie.digital/`
- Explorer: `https://testnet.qie.digital`
- Faucet: `https://www.qie.digital/faucet`

## Deployed Proof

- Contract: `0xB46D14828d4f20cEFD7fbE69b081b1ffAa94D68F`
- Deployer: `0xb97ca921e25113c44C98D5C367Df6957D3707E8D`
- Deployment transaction: `0xa451f4ababc6fa9ea92bcd6a3ca7483f1ef9bce3fd22e1ee2ba0d225c7cf58d2`
- Sample proof transaction: `0xb2cbf45455a9cac4a9843ff6d96ce562204c76a3d622bea64ffdd7261a65bb1d`
- Report hash: `0x0e8ae57119b5b6da9a5b0be4f7ef99cee18ee71ee819c6b5f181861a76340423`

## Next Actions

1. Run local checks and build.
2. Deploy a fresh Vercel preview with `?contest=qie`.
3. Prepare the QIE demo script, README, X post, and HackQuest/QIE submission answers.

## Anti-Abuse Rule

This must not be a simple 0G clone. We can reuse the app shell and submission workflow, but the final QIE version needs QIE testnet RPC, a QIE proof contract, QIE-specific README, QIE-specific demo video, and a clear disclosure of reused components.
