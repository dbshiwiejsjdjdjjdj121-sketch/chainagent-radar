import {
  BadgeCheck,
  Blocks,
  Copy,
  Database,
  ExternalLink,
  Gauge,
  GitBranch,
  Radar,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import type { CSSProperties, FormEvent } from "react";
import { qieProof } from "../data/qieProof";
import type { AnalysisResult, Ecosystem, WalletSnapshot } from "../types";
import { shortenAddress } from "../utils/analysis";

type QieGrowthDashboardProps = {
  ecosystem: Ecosystem;
  address: string;
  snapshot: WalletSnapshot;
  analysis: AnalysisResult;
  statusMessage: string;
  isAnalyzing: boolean;
  copyState: "idle" | "copied" | "failed";
  onAddressChange: (nextAddress: string) => void;
  onRunAnalysis: () => void;
  onCopySubmissionPack: () => void;
};

const proof = qieProof.deployment;
const explorerBase = qieProof.explorerUrl.replace(/\/$/, "");
const qieLinks = {
  contract: `${explorerBase}/address/${proof.contractAddress}`,
  deploymentTx: `${explorerBase}/tx/${proof.deploymentTxHash}`,
  proofTx: `${explorerBase}/tx/${proof.sampleBriefTxHash}`,
};

function shortHash(value: string) {
  if (value.length <= 18) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function formatQieBalance(snapshot: WalletSnapshot) {
  if (!snapshot.nativeBalance) return "Run brief";

  const parsed = Number(snapshot.nativeBalance);
  if (!Number.isFinite(parsed)) return `${snapshot.nativeBalance} ${snapshot.nativeSymbol ?? "QIE"}`;

  return `${parsed.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  })} ${snapshot.nativeSymbol ?? "QIE"}`;
}

export function QieGrowthDashboard({
  ecosystem,
  address,
  snapshot,
  analysis,
  statusMessage,
  isAnalyzing,
  copyState,
  onAddressChange,
  onRunAnalysis,
  onCopySubmissionPack,
}: QieGrowthDashboardProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "QIE Growth Copilot";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const proofReady = qieProof.status === "deployed";
  const readinessScore = proofReady ? Math.max(analysis.score, 88) : analysis.score;
  const riskLevel = readinessScore > 78 ? "Low Risk" : readinessScore > 58 ? "Medium Risk" : "High Risk";
  const blockLabel = snapshot.blockNumber ? `#${snapshot.blockNumber.toLocaleString()}` : "Run brief";
  const txLabel = snapshot.txCount.toLocaleString();
  const copiedLabel = copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy brief";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRunAnalysis();
  }

  const briefSuggestions = [
    "Confirm the wallet has active QIE testnet history before onboarding it into an ecosystem campaign.",
    "Use the readiness score to decide whether the wallet should receive a growth task, product invite, or follow-up review.",
    "Anchor each generated brief with QIEGrowthProof so the growth signal can be checked again later.",
  ];

  return (
    <main className="qie-shell" aria-label="QIE Growth Copilot">
      <nav className="qie-nav" aria-label="QIE project navigation">
        <a className="qie-brand" href="#dashboard" aria-label="QIE Growth Copilot home">
          <Radar size={26} />
          <span>QIE Growth Copilot</span>
        </a>
        <div className="qie-nav-actions">
          <a href={qieLinks.contract} target="_blank" rel="noreferrer">
            Contract <ExternalLink size={14} />
          </a>
          <span>
            <i aria-hidden="true" /> QIE Testnet
          </span>
        </div>
      </nav>

      <section className="qie-hero" id="dashboard">
        <div className="qie-badge-row" aria-label="Project status">
          <span>QIE Proof Deployed</span>
          <span className="accent">AI + Web3</span>
          <span>{ecosystem.chainLabel}</span>
        </div>

        <h1>QIE Growth Copilot</h1>
        <p>
          Analyze QIE testnet wallet activity, generate an AI growth brief, and anchor the result on QIE Testnet.
        </p>

        <form className="qie-command" onSubmit={handleSubmit}>
          <Wallet size={20} />
          <input
            aria-label="QIE wallet address"
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            placeholder="Enter QIE wallet address"
          />
          <button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? <RefreshCw size={18} /> : <Sparkles size={18} />}
            {isAnalyzing ? "Syncing" : "Run QIE Brief"}
          </button>
        </form>

        <div className="qie-contract-line">
          <span>Current Contract:</span>
          <a href={qieLinks.contract} target="_blank" rel="noreferrer" title={proof.contractAddress}>
            {shortHash(proof.contractAddress)}
          </a>
        </div>
      </section>

      <section className="qie-dashboard-grid" aria-label="QIE wallet intelligence">
        <article className="qie-card qie-score-card">
          <span className="qie-card-label">Readiness Score</span>
          <div
            className="qie-score-ring"
            style={{ "--qie-score": `${readinessScore}%` } as CSSProperties}
            aria-label={`Readiness score ${readinessScore} out of 100`}
          >
            <strong>{readinessScore}</strong>
            <small>/ 100</small>
          </div>
          <p>{proofReady ? "Growth proof is active on QIE Testnet" : "Growth proof is not active yet"}</p>
        </article>

        <div className="qie-metric-grid">
          <article className="qie-card qie-metric-card">
            <div>
              <Database size={20} />
              <i aria-hidden="true" />
            </div>
            <span>Balance</span>
            <strong>{formatQieBalance(snapshot)}</strong>
          </article>
          <article className="qie-card qie-metric-card">
            <div>
              <GitBranch size={20} />
              <i aria-hidden="true" />
            </div>
            <span>Transactions</span>
            <strong>{txLabel}</strong>
          </article>
          <article className="qie-card qie-metric-card">
            <div>
              <Blocks size={20} />
              <i aria-hidden="true" />
            </div>
            <span>Latest Block</span>
            <strong>{blockLabel}</strong>
          </article>
          <article className="qie-card qie-metric-card">
            <div>
              <Gauge size={20} />
              <i aria-hidden="true" className="green" />
            </div>
            <span>Risk Level</span>
            <strong>{riskLevel}</strong>
          </article>
        </div>

        <article className="qie-card qie-brief-card">
          <div className="qie-section-heading">
            <Sparkles size={22} />
            <h2>AI Growth Brief</h2>
          </div>
          <div className="qie-brief-grid">
            {briefSuggestions.map((suggestion, index) => (
              <div key={suggestion}>
                <span>Suggestion {String(index + 1).padStart(2, "0")}</span>
                <p>{suggestion}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="qie-card qie-proof-card" aria-label="QIE proof details">
        <div className="qie-proof-header">
          <div className="qie-section-heading">
            <ShieldCheck size={22} />
            <h2>QIE Testnet Proof</h2>
          </div>
          <span>
            <BadgeCheck size={16} /> Verified on QIE Testnet
          </span>
        </div>

        <div className="qie-proof-grid">
          <a href={qieLinks.contract} target="_blank" rel="noreferrer">
            <span>Contract Address</span>
            <strong>{shortHash(proof.contractAddress)}</strong>
          </a>
          <a href={qieLinks.proofTx} target="_blank" rel="noreferrer">
            <span>Proof Transaction</span>
            <strong>{shortHash(proof.sampleBriefTxHash)}</strong>
          </a>
          <div>
            <span>Report Hash</span>
            <strong>{shortHash(proof.reportHash)}</strong>
          </div>
          <a href={qieLinks.deploymentTx} target="_blank" rel="noreferrer">
            <span>Deploy Transaction</span>
            <strong>{shortHash(proof.deploymentTxHash)}</strong>
          </a>
        </div>
      </section>

      <section className="qie-proof-flow" aria-label="QIE product flow">
        <article className="qie-card">
          <span>01</span>
          <h3>Scan QIE wallet</h3>
          <p>{statusMessage}</p>
        </article>
        <article className="qie-card">
          <span>02</span>
          <h3>Generate AI brief</h3>
          <p>{analysis.summary}</p>
        </article>
        <article className="qie-card">
          <span>03</span>
          <h3>Anchor proof</h3>
          <p>
            The brief hash is recorded by <strong>{qieProof.contractName}</strong>, creating a reusable proof trail for
            wallet growth decisions.
          </p>
        </article>
      </section>

      <section className="qie-card qie-action-card" aria-label="QIE builder action plan">
        <div>
          <span className="qie-card-label">Builder Action Plan</span>
          <h2>Turn wallet signals into QIE growth actions</h2>
          <p>
            Keep the wallet analysis, AI brief, and proof hash together so ecosystem teams can review readiness before
            the next onboarding step.
          </p>
        </div>
        <div className="qie-action-list">
          <span>
            <BadgeCheck size={16} /> Wallet activity checked
          </span>
          <span>
            <BadgeCheck size={16} /> Growth brief generated
          </span>
          <span>
            <BadgeCheck size={16} /> Proof hash recorded
          </span>
          <span>
            <BadgeCheck size={16} /> QIE path selected
          </span>
        </div>
        <button type="button" onClick={onCopySubmissionPack}>
          <Copy size={17} />
          {copiedLabel}
        </button>
      </section>

      <footer className="qie-footer">
        <span>
          <i aria-hidden="true" /> Public QIE RPC
        </span>
        <span>
          <i aria-hidden="true" /> Proof contract active
        </span>
        <span>
          <i aria-hidden="true" /> Brief hash recorded
        </span>
        <span>
          <i aria-hidden="true" /> QIE Testnet
        </span>
        <small>© 2026 QIE Growth Copilot.</small>
      </footer>
    </main>
  );
}
