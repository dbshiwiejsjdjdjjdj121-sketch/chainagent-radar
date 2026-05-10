# 0G Agent Memory Radar Submission Draft

## Project Name

0G Agent Memory Radar

## Live Demo

Pending deployment for `/?contest=zerog`

## One-Line Description

AI wallet-risk briefs with persistent 0G Storage memory so agents can verify past reasoning before taking on-chain actions.

## Problem

AI agents can generate wallet actions, payment plans, and risk explanations, but those decisions are often ephemeral. If an agent cannot verify its prior reasoning, it may repeat unsafe actions, ignore stale risk signals, or act without a clear audit trail.

## Solution

0G Agent Memory Radar turns a wallet address into an AI-style risk and action brief, then prepares the brief as a persistent memory record for 0G Storage. The final submission should show a real 0G root hash, transaction hash, ChainScan link, and StorageScan link so judges can verify that the memory record exists outside the app UI.

## 0G Integration Plan

- 0G component: 0G Storage.
- Payload: JSON agent memory record generated from wallet analysis.
- Required proof before submission:
  - Storage root hash.
  - Upload transaction hash.
  - 0G ChainScan link.
  - 0G StorageScan link.
- Optional next step: Agent ID or persistent memory link if available within the build window.

## Demo Flow

1. Open the 0G contest mode: `/?contest=zerog`.
2. Paste or keep a sample wallet address.
3. Click `Generate memory brief`.
4. Show wallet score, risk level, sponsor hooks, and recommended actions.
5. Scroll to the `0G required proof` panel.
6. Show the generated JSON memory payload.
7. After real 0G upload, show root hash, tx hash, ChainScan link, and StorageScan link.
8. Explain that the final agent should check persistent memory before taking wallet or payment actions.

## Honest Scope Disclosure

The ChainAgent Radar UI shell is reused from the existing Web3 prize motherbase. The 0G-specific work is the agent memory payload, 0G proof panel, submission packaging, and planned 0G Storage integration. This project must not be submitted until the 0G upload proof is real.

## Next Build Steps

1. Register/login on HackQuest and join the 0G APAC Hackathon.
2. Create or use a wallet for 0G Galileo or the required 0G network.
3. Get faucet tokens.
4. Upload the generated JSON payload with the 0G Storage SDK or starter kit.
5. Replace pending proof fields with real root/tx/explorer links.
6. Deploy and record a <=3 minute video.
7. Publish the required X post with `#0GHackathon` and `#BuildOn0G`.

