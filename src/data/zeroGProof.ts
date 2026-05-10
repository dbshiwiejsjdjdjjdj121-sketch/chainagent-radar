export const zeroGProof = {
  status: "uploaded",
  network: "0G Galileo Testnet",
  signerAddress: "0xCB8f56a7C5804eF067C1B58710853B5cC37D09e6",
  rootHash: "0x43f7b12fd63fd797c4c051eadc01d9cec7a6335abaf4761b25ed21bc9c6adc75",
  txHash: "0x69dd01f67fddf30a979e4e9c15cc0f72697ff1a9efce25a9a32c1fb2c8ccfe4c",
  payloadSha256: "7e92142952eff52f814211d2898d281b186203bac86665d4fd228c21f2d1edc7",
  uploadedAt: "2026-05-10T10:14:25.710Z",
  chainScanUrl:
    "https://chainscan-galileo.0g.ai/tx/0x69dd01f67fddf30a979e4e9c15cc0f72697ff1a9efce25a9a32c1fb2c8ccfe4c",
  storageScanUrl: "https://storagescan-galileo.0g.ai/submissions",
} as const;

export function formatShortHash(value: string) {
  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}
