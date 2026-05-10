# 0G Agent Memory Radar Submission Draft

## Project Name

0G Agent Memory Radar

## Live Demo

https://chainagent-radar-dhagyyr24-yiwangyuai-7161s-projects.vercel.app/?contest=zerog

## One-Line Description

AI wallet-risk briefs with persistent 0G Storage memory so agents can verify past reasoning before taking on-chain actions.

## Problem

AI agents can generate wallet actions, payment plans, and risk explanations, but those decisions are often ephemeral. If an agent cannot verify its prior reasoning, it may repeat unsafe actions, ignore stale risk signals, or act without a clear audit trail.

## Solution

0G Agent Memory Radar turns a wallet address into an AI-style risk and action brief, then prepares the brief as a persistent memory record for 0G Storage. The current build includes a real 0G Galileo upload proof, so judges can verify that the memory record exists outside the app UI.

## 0G Integration Plan

- 0G component: 0G Storage.
- Payload: JSON agent memory record generated from wallet analysis.
- Proof status: uploaded on 0G Galileo Testnet.
- Storage root hash: `0x43f7b12fd63fd797c4c051eadc01d9cec7a6335abaf4761b25ed21bc9c6adc75`
- Upload transaction hash: `0x69dd01f67fddf30a979e4e9c15cc0f72697ff1a9efce25a9a32c1fb2c8ccfe4c`
- Signer address: `0xCB8f56a7C5804eF067C1B58710853B5cC37D09e6`
- Payload SHA-256: `7e92142952eff52f814211d2898d281b186203bac86665d4fd228c21f2d1edc7`
- 0G ChainScan link: https://chainscan-galileo.0g.ai/tx/0x69dd01f67fddf30a979e4e9c15cc0f72697ff1a9efce25a9a32c1fb2c8ccfe4c
- 0G StorageScan link: https://storagescan-galileo.0g.ai/submissions
- Optional next step: Agent ID or persistent memory link if available within the build window.

## Demo Flow

1. Open the 0G contest mode: `/?contest=zerog`.
2. Paste or keep a sample wallet address.
3. Click `Generate memory brief`.
4. Show wallet score, risk level, sponsor hooks, and recommended actions.
5. Scroll to the `0G required proof` panel.
6. Show the generated JSON memory payload.
7. Show root hash, tx hash, ChainScan link, and StorageScan lookup for the uploaded 0G memory proof.
8. Explain that the final agent should check persistent memory before taking wallet or payment actions.

## Honest Scope Disclosure

The ChainAgent Radar UI shell is reused from the existing Web3 prize motherbase. The 0G-specific work is the agent memory payload, 0G proof panel, submission packaging, and Galileo testnet 0G Storage upload proof. Production use should add deeper Agent ID integration and richer live wallet indexing.

## Next Build Steps

1. Register/login on HackQuest and join the 0G APAC Hackathon.
2. Create or use a wallet for 0G Galileo or the required 0G network.
3. Get faucet tokens.
4. Deploy the proof-attached build and record a <=3 minute video.
5. Publish the required X post with `#0GHackathon` and `#BuildOn0G`.
6. Submit GitHub, live demo, video, proof links, and team info on HackQuest.
