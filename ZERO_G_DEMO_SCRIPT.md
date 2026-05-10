# 0G Demo Video Script

Target length: under 3 minutes.

Important: the app now has real 0G Galileo proof. In the recording, show the proof panel clearly so the demo is not just a concept video.

## Opening

Hi, this is 0G Agent Memory Radar.

It helps an AI agent remember wallet-risk reasoning before it recommends or prepares on-chain actions.

## Problem

AI agents can read wallet data and suggest actions, but those decisions are often temporary. If the agent cannot verify its past reasoning, it may act without enough context.

For wallet and payment agents, this is risky. We need persistent memory and a clear audit trail.

## Product Demo

I open the 0G contest version of ChainAgent Radar.

The app analyzes a wallet address and creates a readiness score, risk level, sponsor hooks, and recommended actions.

Then it generates an agent memory payload. This JSON record includes the wallet, risk level, action summary, and recommended next steps.

## 0G Integration

The 0G-specific part is persistent agent memory.

The generated memory payload is uploaded to 0G Storage. This build includes the root hash, transaction hash, 0G ChainScan link, and StorageScan lookup.

This lets judges verify that the agent memory record exists outside the app UI.

The proof transaction is:
0x69dd01f67fddf30a979e4e9c15cc0f72697ff1a9efce25a9a32c1fb2c8ccfe4c

## Closing

0G Agent Memory Radar makes AI wallet agents safer by giving them persistent, verifiable memory before they act.

The next step is deeper Agent ID integration and policy checks before any automated wallet or payment flow.
