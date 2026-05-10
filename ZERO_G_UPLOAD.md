# 0G Upload Proof Runbook

Use this only on your own machine. Do not paste private keys into chat, README, GitHub, screenshots, or the browser.

## What This Does

The script generates a JSON agent-memory payload, calculates its 0G Storage Merkle root locally, and can upload it to 0G Storage when a funded 0G Galileo wallet is available.

Generated local files are ignored by Git:

- `tmp/zerog/agent-memory-payload.json`
- `tmp/zerog/upload-proof.json`

## Dry Run

```bash
npm run zerog:dry-run
```

Expected result:

- Creates the memory payload.
- Prints `localRootHash`.
- Does not upload.
- Does not require a private key.

## Real Upload

1. Copy `.env.example` to `.env.local`.
2. Fill:

```bash
ZERO_G_PRIVATE_KEY=your_testnet_private_key
ZERO_G_WALLET_ADDRESS=your_public_wallet_address
ZERO_G_RPC_URL=https://evmrpc-testnet.0g.ai
ZERO_G_INDEXER_RPC=https://indexer-storage-testnet-turbo.0g.ai
ZERO_G_CHAIN_SCAN_BASE=https://chainscan-galileo.0g.ai
ZERO_G_STORAGE_SCAN_BASE=https://storagescan-galileo.0g.ai
```

3. Fund the wallet from the 0G faucet.
4. Run:

```bash
npm run zerog:upload
```

5. Copy the resulting `rootHash`, `txHash`, and explorer links into `ZERO_G_SUBMISSION_DRAFT.md` and the app before recording.

## Latest Proof

- Status: uploaded.
- Network: 0G Galileo Testnet.
- Signer: `0xCB8f56a7C5804eF067C1B58710853B5cC37D09e6`
- Root hash: `0x43f7b12fd63fd797c4c051eadc01d9cec7a6335abaf4761b25ed21bc9c6adc75`
- Transaction hash: `0x69dd01f67fddf30a979e4e9c15cc0f72697ff1a9efce25a9a32c1fb2c8ccfe4c`
- ChainScan: https://chainscan-galileo.0g.ai/tx/0x69dd01f67fddf30a979e4e9c15cc0f72697ff1a9efce25a9a32c1fb2c8ccfe4c
- StorageScan: https://storagescan-galileo.0g.ai/submissions

## Safety Notes

- Use a fresh testnet wallet only.
- Never use an exchange wallet private key.
- Never commit `.env.local`.
- If upload fails with 0 balance, request faucet tokens first.
- If the hackathon form requires mainnet proof instead of Galileo testnet, ask in the 0G/HackQuest community before submitting.
- `npm audit` currently reports high-severity Axios issues through `@0gfoundation/0g-storage-ts-sdk -> open-jsonrpc-provider -> axios`, with no fix available from npm audit. Keep this SDK in local scripts only; do not import it into the browser app.
