#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import dotenv from "dotenv";
import { ethers } from "ethers";
import { Indexer, MemData } from "@0gfoundation/0g-storage-ts-sdk";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const DEFAULT_RPC_URL = "https://evmrpc-testnet.0g.ai";
const DEFAULT_INDEXER_RPC = "https://indexer-storage-testnet-turbo.0g.ai";
const DEFAULT_CHAIN_SCAN_BASE = "https://chainscan-galileo.0g.ai";
const DEFAULT_STORAGE_SCAN_BASE = "https://storagescan-galileo.0g.ai";
const SAMPLE_WALLET = "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run") || !process.env.ZERO_G_PRIVATE_KEY;

function requiredUrl(name, fallback) {
  return (process.env[name] || fallback).replace(/\/$/, "");
}

function createMemoryPayload() {
  const wallet = process.env.ZERO_G_WALLET_ADDRESS || SAMPLE_WALLET;

  return {
    project: "0G Agent Memory Radar",
    contest: "0G APAC Hackathon 2026",
    wallet,
    chainTarget: "0G Galileo / 0G Storage",
    readinessScore: 89,
    riskLevel: "Low",
    summary:
      "The wallet has enough activity to support an agent-risk demo. The agent should persist this reasoning before recommending payment or wallet actions.",
    sponsorHooks: ["0G Storage", "Agent memory", "0G Chain proof", "AI x Web3"],
    recommendedActions: [
      "Generate an agent memory record from wallet-risk analysis.",
      "Upload the memory payload to 0G Storage.",
      "Attach root hash, transaction hash, ChainScan link, and StorageScan reference to the submission.",
      "Require a human approval step before any future wallet action.",
    ],
    disclosure:
      "The UI shell is reused from ChainAgent Radar. The 0G-specific contest work is this memory payload, the 0G proof path, and the 0G submission package.",
    generatedAt: new Date().toISOString(),
  };
}

function normalizeUploadResult(tx) {
  if (!tx) return {};
  if ("rootHash" in tx || "txHash" in tx) {
    return {
      rootHash: tx.rootHash,
      txHash: tx.txHash,
    };
  }

  return {
    rootHash: Array.isArray(tx.rootHashes) ? tx.rootHashes[0] : undefined,
    txHash: Array.isArray(tx.txHashes) ? tx.txHashes[0] : undefined,
    rootHashes: tx.rootHashes,
    txHashes: tx.txHashes,
  };
}

async function main() {
  const rpcUrl = requiredUrl("ZERO_G_RPC_URL", DEFAULT_RPC_URL);
  const indexerRpc = requiredUrl("ZERO_G_INDEXER_RPC", DEFAULT_INDEXER_RPC);
  const chainScanBase = requiredUrl("ZERO_G_CHAIN_SCAN_BASE", DEFAULT_CHAIN_SCAN_BASE);
  const storageScanBase = requiredUrl("ZERO_G_STORAGE_SCAN_BASE", DEFAULT_STORAGE_SCAN_BASE);
  const payload = createMemoryPayload();
  const payloadJson = JSON.stringify(payload, null, 2);
  const data = new TextEncoder().encode(payloadJson);
  const memData = new MemData(data);
  const [tree, treeErr] = await memData.merkleTree();

  if (treeErr !== null) {
    throw new Error(`0G merkle tree error: ${treeErr}`);
  }

  const localRootHash = tree?.rootHash?.()?.toString?.() ?? String(tree?.rootHash?.() ?? "");
  const localSha256 = createHash("sha256").update(payloadJson).digest("hex");
  const outputDir = "tmp/zerog";
  await mkdir(outputDir, { recursive: true });
  await writeFile(`${outputDir}/agent-memory-payload.json`, `${payloadJson}\n`);

  if (dryRun) {
    const dryProof = {
      status: "dry-run",
      reason: process.env.ZERO_G_PRIVATE_KEY ? "--dry-run flag set" : "ZERO_G_PRIVATE_KEY not set",
      localRootHash,
      localSha256,
      payloadPath: `${outputDir}/agent-memory-payload.json`,
      nextStep: "Fund a 0G Galileo wallet, set ZERO_G_PRIVATE_KEY in .env.local, then run npm run zerog:upload.",
    };
    await writeFile(`${outputDir}/upload-proof.json`, `${JSON.stringify(dryProof, null, 2)}\n`);
    console.log(JSON.stringify(dryProof, null, 2));
    await memData.close?.();
    return;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(process.env.ZERO_G_PRIVATE_KEY, provider);
  const indexer = new Indexer(indexerRpc);
  const balance = await provider.getBalance(signer.address);

  if (balance === 0n) {
    throw new Error(`0G wallet ${signer.address} has 0 balance. Request faucet tokens before upload.`);
  }

  const [tx, uploadErr] = await indexer.upload(memData, rpcUrl, signer);
  await memData.close?.();

  if (uploadErr !== null) {
    throw new Error(`0G upload error: ${uploadErr}`);
  }

  const result = normalizeUploadResult(tx);
  const proof = {
    status: "uploaded",
    network: "0G Galileo Testnet",
    signerAddress: signer.address,
    rpcUrl,
    indexerRpc,
    localRootHash,
    localSha256,
    rootHash: result.rootHash ?? localRootHash,
    txHash: result.txHash,
    rootHashes: result.rootHashes,
    txHashes: result.txHashes,
    chainScanUrl: result.txHash ? `${chainScanBase}/tx/${result.txHash}` : chainScanBase,
    storageScanUrl: storageScanBase,
    payloadPath: `${outputDir}/agent-memory-payload.json`,
    uploadedAt: new Date().toISOString(),
  };

  await writeFile(`${outputDir}/upload-proof.json`, `${JSON.stringify(proof, null, 2)}\n`);
  console.log(JSON.stringify(proof, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
