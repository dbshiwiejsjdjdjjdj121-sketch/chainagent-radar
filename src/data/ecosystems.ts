import type { Ecosystem, WalletSnapshot } from "../types";

const bnbMainnet = {
  id: "bnb-mainnet" as const,
  name: "BNB Smart Chain Mainnet",
  chainId: 56,
  nativeSymbol: "BNB",
  rpcUrl: "https://bsc-dataseed1.bnbchain.org/",
  explorerUrl: "https://bscscan.com",
};

export const ecosystems: Ecosystem[] = [
  {
    id: "mantle",
    name: "Mantle",
    contest: "Turing Test Hackathon 2026",
    deadline: "Jun 15, 2026",
    track: "AI Alpha & Data / Agentic Wallets",
    prizeShape: "$100K Phase 2 pool",
    chainLabel: "Mantle Network",
    primaryColor: "#27594D",
    accentColor: "#E75D3C",
    adapterStatus: "mocked",
    sponsorHooks: ["AI alpha dashboard", "RWA yield risk", "agentic wallet action", "Nansen-style narrative"],
    demoActions: [
      {
        type: "report",
        label: "Generate alpha brief",
        detail: "Summarize wallet behavior, yield exposure, and action confidence for judges.",
      },
      {
        type: "payment",
        label: "Simulate agent budget",
        detail: "Create a bounded session budget for the agent before it suggests transactions.",
      },
    ],
  },
  {
    id: "qie",
    name: "QIE",
    contest: "QIE Blockchain Hackathon 2026",
    deadline: "Jun 19, 2026",
    track: "AI + Web3 / Infrastructure",
    prizeShape: "USDT + QIE token pool",
    chainLabel: "QIE Blockchain",
    primaryColor: "#A3226F",
    accentColor: "#27A56B",
    adapterStatus: "needs-sdk",
    sponsorHooks: ["QIE Wallet", "QIE Pass", "QIE Stable", "QIE Dex", "100-user milestone"],
    demoActions: [
      {
        type: "swap",
        label: "Guide QIE Dex action",
        detail: "Explain a simple swap/payment path and link it to ecosystem onboarding.",
      },
      {
        type: "credential",
        label: "Prepare QIE Pass proof",
        detail: "Turn address activity into a builder-friendly proof or growth badge.",
      },
    ],
  },
  {
    id: "bnb",
    name: "BNB",
    contest: "BNB Hack: Online Edition",
    deadline: "Rolling through Dec 31, 2026",
    track: "AI / DeSoc / DePIN / DeSci",
    prizeShape: "$700K rolling pool",
    chainLabel: "BNB Chain / opBNB",
    primaryColor: "#705A1A",
    accentColor: "#009C7A",
    adapterStatus: "ready",
    rpcTarget: bnbMainnet,
    sponsorHooks: ["Live BNB RPC", "BNB Chain wallet", "stablecoin payment", "AI agent", "bi-weekly qualified projects"],
    demoActions: [
      {
        type: "payment",
        label: "Agent pay-per-action",
        detail: "Let an AI agent create a small session budget and settle after completed actions.",
      },
      {
        type: "report",
        label: "Rolling submission pack",
        detail: "Produce a concise update package for a bi-weekly BNB Hack submission.",
      },
    ],
  },
  {
    id: "zerog",
    name: "0G",
    contest: "0G APAC Hackathon 2026",
    deadline: "May 16, 2026 23:59 UTC+8",
    track: "Agentic Infrastructure / Agentic Economy",
    prizeShape: "$150K USDT + 0G credits",
    chainLabel: "0G Galileo / 0G Storage",
    primaryColor: "#202B6F",
    accentColor: "#23D7A8",
    adapterStatus: "needs-sdk",
    sponsorHooks: ["0G Storage", "Agent memory", "0G Chain proof", "AI x Web3", "public X post"],
    demoActions: [
      {
        type: "report",
        label: "Generate agent memory",
        detail: "Create a JSON risk and action brief that can be stored as persistent 0G agent memory.",
      },
      {
        type: "credential",
        label: "Attach 0G proof",
        detail: "Add root hash, transaction hash, ChainScan link, and StorageScan link before final submission.",
      },
    ],
  },
  {
    id: "hackindia",
    name: "Sharp",
    contest: "HackIndia Web3 Hackathon 2026",
    deadline: "Jun 15, 2026",
    track: "Token ecosystem / On-chain identity",
    prizeShape: "Sharp Token awards",
    chainLabel: "Polygon + Sharp Token",
    primaryColor: "#4D6140",
    accentColor: "#E0623F",
    adapterStatus: "needs-sdk",
    sponsorHooks: ["Sharp Token earn", "Sharp Token spend", "Sharp Token buy", "on-chain credentials"],
    demoActions: [
      {
        type: "credential",
        label: "Issue skill proof",
        detail: "Create a verifiable skill credential from completed builder actions.",
      },
      {
        type: "payment",
        label: "Token utility sample",
        detail: "Show earn/spend/buy primitives with generated integration docs.",
      },
    ],
  },
];

export const sampleSnapshot: WalletSnapshot = {
  address: "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3",
  txCount: 38,
  activeDays: 14,
  stableVolume: 2840,
  dexTouches: 7,
  credentialSignals: 3,
  riskFlags: ["New wallet with clustered activity", "High dependency on one DEX route"],
  strengths: ["Consistent stablecoin usage", "Repeated ecosystem interactions", "Low failed transaction rate"],
  source: "demo",
  sourceLabel: "Curated demo snapshot",
};
