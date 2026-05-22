import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { ContractFactory, JsonRpcProvider, Wallet, id, isAddress } from "ethers";
import solc from "solc";

dotenv.config({ path: ".env.local" });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const contractPath = path.join(rootDir, "contracts", "QIEGrowthProof.sol");
const outputPath = path.join(rootDir, "tmp", "qie-growth-proof.json");
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

const qieRpcUrl = process.env.QIE_RPC_URL || "https://rpc1testnet.qie.digital/";
const qieExplorerUrl = process.env.QIE_EXPLORER_URL || "https://testnet.qie.digital";
const projectName = process.env.QIE_PROJECT_NAME || "QIE Growth Copilot";
const ecosystemAction =
  process.env.QIE_ECOSYSTEM_ACTION || "AI wallet growth brief anchored for QIE Hackathon 2026";
const readinessScore = Number.parseInt(process.env.QIE_READINESS_SCORE || "88", 10);

function compileContract() {
  const source = fs.readFileSync(contractPath, "utf8");
  const input = {
    language: "Solidity",
    sources: {
      "QIEGrowthProof.sol": {
        content: source,
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"],
        },
      },
    },
  };
  const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = compiled.errors ?? [];
  const fatalErrors = errors.filter((error) => error.severity === "error");

  for (const error of errors) {
    console.error(error.formattedMessage.trim());
  }

  if (fatalErrors.length > 0) {
    throw new Error("QIEGrowthProof compilation failed.");
  }

  const artifact = compiled.contracts["QIEGrowthProof.sol"].QIEGrowthProof;

  return {
    abi: artifact.abi,
    bytecode: `0x${artifact.evm.bytecode.object}`,
    sourceSha256: crypto.createHash("sha256").update(source).digest("hex"),
  };
}

function createReportHash(subjectAddress) {
  const payload = {
    projectName,
    contest: "QIE Blockchain Hackathon 2026",
    network: "QIE Testnet",
    chainId: 1983,
    subjectAddress,
    readinessScore,
    ecosystemAction,
    generatedAt: new Date().toISOString(),
  };

  return {
    payload,
    reportHash: id(JSON.stringify(payload)),
  };
}

async function main() {
  const artifact = compileContract();

  console.log(`Compiled QIEGrowthProof (${artifact.bytecode.length / 2 - 1} bytes).`);
  console.log(`Source SHA-256: ${artifact.sourceSha256}`);
  console.log(`RPC: ${qieRpcUrl}`);

  if (dryRun) {
    console.log("Dry run complete. Add QIE_PRIVATE_KEY to .env.local after faucet funding, then run npm run qie:deploy.");
    return;
  }

  const privateKey = process.env.QIE_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("Missing QIE_PRIVATE_KEY in .env.local. Use a dedicated test wallet, not your main wallet.");
  }

  const provider = new JsonRpcProvider(qieRpcUrl, 1983);
  const wallet = new Wallet(privateKey, provider);
  const subjectAddress = process.env.QIE_SUBJECT_ADDRESS || wallet.address;

  if (!isAddress(subjectAddress)) {
    throw new Error("QIE_SUBJECT_ADDRESS must be an EVM address.");
  }

  const balance = await provider.getBalance(wallet.address);

  if (balance === 0n) {
    throw new Error(`QIE deployer ${wallet.address} has no QIE testnet gas. Use the faucet first.`);
  }

  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log(`Deploying ${projectName} proof contract from ${wallet.address}...`);

  const contract = await factory.deploy(projectName);
  await contract.waitForDeployment();
  const deploymentTx = contract.deploymentTransaction();
  const contractAddress = await contract.getAddress();
  const deploymentReceipt = deploymentTx ? await deploymentTx.wait() : null;
  const { payload, reportHash } = createReportHash(subjectAddress);

  console.log(`Contract deployed: ${contractAddress}`);
  console.log(`Recording sample growth brief for ${subjectAddress}...`);

  const recordTx = await contract.recordBrief(subjectAddress, readinessScore, reportHash, ecosystemAction);
  const recordReceipt = await recordTx.wait();
  const result = {
    projectName,
    network: "QIE Testnet",
    chainId: 1983,
    rpcUrl: qieRpcUrl,
    explorerUrl: qieExplorerUrl,
    deployerAddress: wallet.address,
    contractAddress,
    deploymentTxHash: deploymentReceipt?.hash ?? deploymentTx?.hash ?? "",
    sampleBriefTxHash: recordReceipt?.hash ?? recordTx.hash,
    reportHash,
    reportPayload: payload,
    sourceSha256: artifact.sourceSha256,
    generatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);

  console.log(`Sample proof tx: ${result.sampleBriefTxHash}`);
  console.log(`Saved deployment proof to ${outputPath}`);
  console.log("After deploy, copy the contract address and tx hash into src/data/qieProof.ts and QIE_SUBMISSION_DRAFT.md.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

