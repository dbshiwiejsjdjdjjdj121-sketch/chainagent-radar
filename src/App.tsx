import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Copy,
  Database,
  ExternalLink,
  FileText,
  Gauge,
  KeyRound,
  Layers3,
  Link,
  Radar,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { startTransition, useDeferredValue, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ecosystems, sampleSnapshot } from "./data/ecosystems";
import { fetchBnbWalletSnapshot, simulateBnbAgentPayment } from "./services/bnbRpc";
import type { AgentPaymentSimulation, EcosystemId, WalletSnapshot } from "./types";
import { createAnalysis, shortenAddress } from "./utils/analysis";
import { createSubmissionMarkdown } from "./utils/submissionPack";

const readiness = [
  { label: "Public repo", done: false },
  { label: "BNB RPC/API", done: true },
  { label: "Demo video", done: false },
  { label: "Disclosure", done: true },
  { label: "README", done: true },
];

function App() {
  const [ecosystemId, setEcosystemId] = useState<EcosystemId>("bnb");
  const [address, setAddress] = useState(sampleSnapshot.address);
  const [snapshot, setSnapshot] = useState<WalletSnapshot>(sampleSnapshot);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<AgentPaymentSimulation | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [statusMessage, setStatusMessage] = useState("Demo snapshot loaded. Select BNB and run the brief to sync live public RPC data.");
  const deferredAddress = useDeferredValue(address);

  const ecosystem = ecosystems.find((item) => item.id === ecosystemId) ?? ecosystems[0];
  const analysis = useMemo(() => createAnalysis(ecosystem, snapshot), [ecosystem, snapshot]);
  const submissionMarkdown = useMemo(
    () => createSubmissionMarkdown({ ecosystem, snapshot, analysis, simulation }),
    [analysis, ecosystem, simulation, snapshot],
  );

  async function connectWallet() {
    if (!window.ethereum) {
      startTransition(() => {
        setAddress(sampleSnapshot.address);
        setSnapshot(sampleSnapshot);
      });
      setStatusMessage("MetaMask was not detected, so the public sample wallet stayed loaded.");
      return;
    }

    try {
      const accounts = await window.ethereum.request<string[]>({ method: "eth_requestAccounts" });
      const connected = accounts[0] ?? sampleSnapshot.address;
      startTransition(() => {
        setAddress(connected);
        setSnapshot({ ...sampleSnapshot, address: connected });
      });
      setStatusMessage("Wallet address connected. Run the AI brief to fetch live RPC data when the BNB tab is selected.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Wallet connection was cancelled.");
    }
  }

  async function runAnalysis() {
    setIsAnalyzing(true);
    setStatusMessage(ecosystem.rpcTarget ? `Syncing ${ecosystem.rpcTarget.name} public RPC data...` : `Refreshing ${ecosystem.name} demo analysis...`);

    try {
      if (ecosystem.rpcTarget) {
        const liveSnapshot = await fetchBnbWalletSnapshot(deferredAddress || sampleSnapshot.address, ecosystem.rpcTarget);
        setAddress(liveSnapshot.address);
        setSnapshot(liveSnapshot);
        setStatusMessage(
          `Live RPC synced in ${liveSnapshot.rpcLatencyMs}ms at block ${liveSnapshot.blockNumber?.toLocaleString()}. ${liveSnapshot.indexerMessage ?? ""}`,
        );
        return;
      }

      await new Promise<void>((resolve) => window.setTimeout(resolve, 520));
      startTransition(() => {
        setSnapshot((current) => ({
          ...current,
          address: deferredAddress || sampleSnapshot.address,
          txCount: current.txCount + 3,
          activeDays: current.activeDays + 1,
          stableVolume: current.stableVolume + 420,
        }));
      });
      setStatusMessage(`${ecosystem.name} demo analysis refreshed. Live SDK work is still gated until this contest adapter is confirmed.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Analysis failed. Try again or switch to demo mode.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function runPaymentSimulation() {
    if (!ecosystem.rpcTarget) {
      setSimulation(null);
      setStatusMessage(`${ecosystem.name} does not have a live RPC payment simulator yet.`);
      return;
    }

    setIsSimulating(true);

    try {
      const simulated = await simulateBnbAgentPayment(deferredAddress || snapshot.address, ecosystem.rpcTarget);
      setSimulation(simulated);
    } catch (error) {
      setSimulation({
        status: "blocked",
        from: deferredAddress || snapshot.address,
        to: deferredAddress || snapshot.address,
        amountNative: "0.01",
        nativeSymbol: ecosystem.rpcTarget.nativeSymbol,
        gasLimit: 0,
        gasPriceGwei: "0",
        estimatedFeeNative: "0",
        sessionBudgetNative: "0.05",
        approvalRequired: true,
        policyChecks: [
          {
            label: error instanceof Error ? error.message : "Simulation failed before gas estimation.",
            passed: false,
          },
          {
            label: "No transaction was signed or broadcast.",
            passed: true,
          },
        ],
        message: "AgentPay simulation could not produce an approval ticket.",
        simulatedAt: new Date().toISOString(),
      });
    } finally {
      setIsSimulating(false);
    }
  }

  async function copySubmissionPack() {
    try {
      await navigator.clipboard.writeText(submissionMarkdown);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  const completed = readiness.filter((item) => item.done).length;

  return (
    <main className="app-shell" style={{ "--eco": ecosystem.primaryColor, "--eco-accent": ecosystem.accentColor } as CSSProperties}>
      <aside className="sidebar" aria-label="Project navigation">
        <div className="brand-mark">
          <Radar size={26} />
          <div>
            <strong>ChainAgent</strong>
            <span>Prize Ops Console</span>
          </div>
        </div>

        <nav className="nav-list">
          <a className="active" href="#radar">
            <Activity size={18} /> Radar
          </a>
          <a href="#actions">
            <Sparkles size={18} /> Actions
          </a>
          <a href="#submission">
            <ClipboardCheck size={18} /> Submission
          </a>
        </nav>

        <div className="sidebar-note">
          <span>Current batch</span>
          <strong>Mantle to QIE to BNB</strong>
          <p>One motherbase, separate contest-specific integrations and disclosures.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="section-label">Online Web3 prize machine</p>
            <h1>AI wallet intelligence, rebuilt per sponsor.</h1>
          </div>
          <button className="icon-button" type="button" onClick={runAnalysis} aria-label="Refresh analysis">
            <RefreshCw size={18} />
          </button>
        </header>

        <section className="ecosystem-tabs" aria-label="Ecosystem selector">
          {ecosystems.map((item) => (
            <button
              key={item.id}
              className={item.id === ecosystem.id ? "selected" : ""}
              type="button"
              onClick={() => setEcosystemId(item.id)}
            >
              <span>{item.name}</span>
              <small>{item.deadline}</small>
            </button>
          ))}
        </section>

        <section className="grid-primary" id="radar">
          <article className="panel analysis-panel">
            <div className="panel-heading">
              <div>
                <p className="section-label">{ecosystem.contest}</p>
                <h2>{ecosystem.track}</h2>
              </div>
              <span className="status-chip">{ecosystem.adapterStatus}</span>
            </div>

            <div className="wallet-row">
              <label htmlFor="wallet-address">Wallet or address</label>
              <div className="input-row">
                <input
                  id="wallet-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="0x..."
                />
                <button type="button" onClick={connectWallet}>
                  <Wallet size={17} /> Connect
                </button>
              </div>
              <div className={snapshot.source === "live-rpc" ? "source-banner live" : "source-banner"}>
                <strong>{snapshot.source === "live-rpc" ? "Live RPC" : "Demo mode"}</strong>
                <span>{statusMessage}</span>
              </div>
            </div>

            <div className="score-layout">
              <div
                className="score-ring"
                aria-label={`Readiness score ${analysis.score}`}
                style={{ "--score": `${analysis.score}%` } as CSSProperties}
              >
                <span>{analysis.score}</span>
                <small>readiness</small>
              </div>
              <div>
                <h3>{shortenAddress(snapshot.address)} is demo-ready for {ecosystem.name}</h3>
                <p>{analysis.summary}</p>
                <button className="primary-action" type="button" onClick={runAnalysis} disabled={isAnalyzing}>
                  {isAnalyzing ? <RefreshCw size={17} /> : <Sparkles size={17} />}
                  {isAnalyzing ? "Analyzing" : "Run AI brief"}
                </button>
              </div>
            </div>
          </article>

          <article className="panel compact-panel">
            <div className="metric-row">
              <Gauge size={20} />
              <span>Risk level</span>
              <strong>{analysis.riskLevel}</strong>
            </div>
            <div className="metric-row">
              <Wallet size={20} />
              <span>Native balance</span>
              <strong>{snapshot.nativeBalance ? `${snapshot.nativeBalance} ${snapshot.nativeSymbol}` : "Demo estimate"}</strong>
            </div>
            <div className="metric-row">
              <Activity size={20} />
              <span>Latest block</span>
              <strong>{snapshot.blockNumber?.toLocaleString() ?? "Not synced"}</strong>
            </div>
            <div className="metric-row">
              <CircleDollarSign size={20} />
              <span>Prize shape</span>
              <strong>{ecosystem.prizeShape}</strong>
            </div>
            <div className="metric-row">
              <Layers3 size={20} />
              <span>Chain target</span>
              <strong>{ecosystem.chainLabel}</strong>
            </div>
          </article>
        </section>

        <section className="panel indexer-panel" aria-label="BNB indexer intelligence">
          <div className="panel-heading">
            <div>
              <p className="section-label">BNB indexer intelligence</p>
              <h2>Token transfers and contract behavior</h2>
            </div>
            <span className={`indexer-status ${snapshot.indexerStatus ?? "not-configured"}`}>
              {snapshot.indexerStatus ?? "not-configured"}
            </span>
          </div>

          <div className="indexer-grid">
            <div className="indexer-copy">
              <p>
                {snapshot.indexerMessage ??
                  "Run the BNB brief to enrich the live RPC snapshot with Etherscan V2 token transfers and normal transactions."}
              </p>
              <div className="indexer-stats">
                <span>
                  <Database size={16} />
                  {snapshot.tokenTransferCount ?? 0} ERC-20 transfers
                </span>
                <span>
                  <Activity size={16} />
                  {snapshot.contractInteractionCount ?? 0} contract methods
                </span>
                <span>
                  <CircleDollarSign size={16} />
                  ${Math.round(snapshot.stableVolume).toLocaleString()} stable volume
                </span>
              </div>
            </div>

            <div className="token-strip" aria-label="Top token symbols">
              {(snapshot.topTokenSymbols?.length ? snapshot.topTokenSymbols : ["RPC-only", "Add API key"]).map((symbol) => (
                <span key={symbol}>{symbol}</span>
              ))}
            </div>

            <div className="transfer-list">
              {(snapshot.recentTokenTransfers?.length ? snapshot.recentTokenTransfers.slice(0, 3) : []).map((transfer) => (
                <div className="transfer-item" key={`${transfer.hash}-${transfer.contractAddress}-${transfer.value}`}>
                  <span className={transfer.direction}>{transfer.direction}</span>
                  <strong>
                    {transfer.value} {transfer.tokenSymbol}
                  </strong>
                  <small>{shortenAddress(transfer.counterparty)}</small>
                </div>
              ))}

              {!snapshot.recentTokenTransfers?.length ? (
                <div className="indexer-empty">
                  <KeyRound size={18} />
                  <span>Add `VITE_ETHERSCAN_API_KEY` in `.env.local` to show recent token transfers.</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="panel agentpay-panel" aria-label="AgentPay guardrail simulation">
          <div className="panel-heading">
            <div>
              <p className="section-label">AgentPay guardrail simulation</p>
              <h2>Estimate first, require human approval</h2>
            </div>
            <button className="secondary-action" type="button" onClick={runPaymentSimulation} disabled={isSimulating}>
              {isSimulating ? <RefreshCw size={16} /> : <ShieldCheck size={16} />}
              {isSimulating ? "Simulating" : "Simulate AgentPay"}
            </button>
          </div>

          <div className="agentpay-grid">
            <div className="approval-ticket">
              <span className={simulation?.status === "simulated" ? "ticket-status pass" : "ticket-status"}>
                {simulation?.status ?? "ready"}
              </span>
              <h3>0.01 BNB self-transfer dry run</h3>
              <p>
                The agent estimates a bounded payment action against BNB RPC, then creates an approval ticket. It never requests a
                signature or broadcasts a transaction.
              </p>
              {simulation ? <p className="ticket-message">{simulation.message}</p> : null}
            </div>

            <div className="simulation-metrics">
              <div>
                <span>Gas limit</span>
                <strong>{simulation?.gasLimit.toLocaleString() ?? "Not simulated"}</strong>
              </div>
              <div>
                <span>Gas price</span>
                <strong>{simulation ? `${simulation.gasPriceGwei} gwei` : "Not simulated"}</strong>
              </div>
              <div>
                <span>Estimated fee</span>
                <strong>{simulation ? `${simulation.estimatedFeeNative} ${simulation.nativeSymbol}` : "Not simulated"}</strong>
              </div>
              <div>
                <span>Session budget</span>
                <strong>{simulation ? `${simulation.sessionBudgetNative} ${simulation.nativeSymbol}` : "0.05 BNB"}</strong>
              </div>
            </div>

            <div className="policy-list">
              {(simulation?.policyChecks ?? [
                { label: "Run simulation to generate policy checks", passed: false },
                { label: "Human approval remains mandatory", passed: true },
              ]).map((check) => (
                <div className={check.passed ? "passed" : ""} key={check.label}>
                  {check.passed ? <BadgeCheck size={17} /> : <ShieldAlert size={17} />}
                  <span>{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid-secondary" id="actions">
          <article className="panel">
            <div className="panel-heading">
              <h2>Sponsor hooks</h2>
              <Link size={18} />
            </div>
            <div className="hook-list">
              {ecosystem.sponsorHooks.map((hook) => (
                <span key={hook}>{hook}</span>
              ))}
            </div>
            <ul className="signal-list">
              {analysis.signals.map((signal) => (
                <li key={signal}>
                  <BadgeCheck size={17} />
                  {signal}
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <h2>Recommended actions</h2>
              <ArrowRight size={18} />
            </div>
            <div className="action-stack">
              {analysis.nextActions.map((action, index) => (
                <div className="action-item" key={action}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{action}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel narrative-panel">
            <div className="panel-heading">
              <h2>Judge narrative</h2>
              <FileText size={18} />
            </div>
            <p>{analysis.judgeNarrative}</p>
            <a className="text-link" href="#submission">
              Prepare submission pack <ExternalLink size={15} />
            </a>
          </article>
        </section>

        <section className="submission-band" id="submission">
          <div>
            <p className="section-label">Submission readiness</p>
            <h2>{completed}/5 assets ready for the first batch.</h2>
            <p>Each contest version gets a unique README, demo script, sponsor integration notes, and disclosure file.</p>
          </div>
          <div className="readiness-list">
            {readiness.map((item) => (
              <div className={item.done ? "done" : ""} key={item.label}>
                {item.done ? <BadgeCheck size={18} /> : <ShieldAlert size={18} />}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel submission-pack-panel" aria-label="BNB submission pack">
          <div className="panel-heading">
            <div>
              <p className="section-label">BNB submission pack</p>
              <h2>Copy-ready markdown for the hackathon form</h2>
            </div>
            <button className="secondary-action" type="button" onClick={copySubmissionPack}>
              {copyState === "copied" ? <Check size={16} /> : <Copy size={16} />}
              {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy Markdown"}
            </button>
          </div>

          <div className="submission-pack-grid">
            <div className="submission-summary">
              <h3>What to say in 15 seconds</h3>
              <p>
                ChainAgent Radar turns live BNB wallet data into an AI operating brief, then simulates a safe AgentPay action with
                gas estimation and human approval before any transaction can happen.
              </p>
            </div>
            <div className="submission-checks">
              <span>Live RPC: {snapshot.source === "live-rpc" ? "ready" : "run brief"}</span>
              <span>Indexer: {snapshot.indexerStatus ?? "not configured"}</span>
              <span>AgentPay: {simulation?.status ?? "not simulated"}</span>
              <span>Disclosure: dry-run only, no signature</span>
            </div>
          </div>

          <pre className="submission-preview">{submissionMarkdown}</pre>
        </section>
      </section>
    </main>
  );
}

export default App;
