# Deployment Guide

## Current Preview

- Live demo: https://chainagent-radar-5q5euc7w4-yiwangyuai-7161s-projects.vercel.app
- Vercel inspect: https://vercel.com/yiwangyuai-7161s-projects/chainagent-radar/GD2dXhhgvmVzfVAG753DHwRH2MxW
- Status: ready
- Deployed: 2026-05-02

## Vercel

This project is a Vite React app and is ready for Vercel deployment.

```bash
npm install
npm run build
vercel
```

For production:

```bash
vercel --prod
```

## Environment Variables

Baseline BNB RPC functionality does not require an API key.

Optional BNB token/indexer enrichment needs:

```bash
VITE_ETHERSCAN_API_KEY=your_key_here
```

In Vercel, add this in:

Project Settings -> Environment Variables -> `VITE_ETHERSCAN_API_KEY`

Important: Vite client-side env vars are visible in the browser bundle. For a hackathon demo this is acceptable if you use a low-risk key. For production, proxy Etherscan calls through a backend.

## Smoke Test

After deployment:

1. Open the public Vercel URL.
2. Keep the BNB tab selected.
3. Click `Run AI brief`.
4. Confirm `Live RPC` appears with a latest block and BNB balance.
5. Click `Simulate AgentPay`.
6. Confirm gas limit, gas price, estimated fee, session budget, and policy checks appear.
7. Click `Copy Markdown` and verify the generated submission pack copies.
