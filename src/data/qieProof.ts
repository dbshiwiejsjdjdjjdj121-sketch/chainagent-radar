export const qieProof = {
  status: "deployed" as "planned" | "deployed",
  projectName: "QIE Growth Copilot",
  contractName: "QIEGrowthProof",
  network: "QIE Testnet",
  chainId: 1983,
  nativeSymbol: "QIE",
  rpcUrl: "https://rpc1testnet.qie.digital/",
  explorerUrl: "https://testnet.qie.digital",
  faucetUrl: "https://www.qie.digital/faucet",
  deployment: {
    contractAddress: "0xB46D14828d4f20cEFD7fbE69b081b1ffAa94D68F",
    deployerAddress: "0xb97ca921e25113c44C98D5C367Df6957D3707E8D",
    deploymentTxHash: "0xa451f4ababc6fa9ea92bcd6a3ca7483f1ef9bce3fd22e1ee2ba0d225c7cf58d2",
    sampleBriefTxHash: "0xb2cbf45455a9cac4a9843ff6d96ce562204c76a3d622bea64ffdd7261a65bb1d",
    reportHash: "0x0e8ae57119b5b6da9a5b0be4f7ef99cee18ee71ee819c6b5f181861a76340423",
  },
} as const;
