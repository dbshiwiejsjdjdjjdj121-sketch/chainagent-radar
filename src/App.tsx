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

type ViewMode = "motherbase" | "contest";

const readiness = [
  { label: "Public repo", done: true },
  { label: "BNB RPC/API", done: true },
  { label: "Demo video", done: false },
  { label: "Disclosure", done: true },
  { label: "README", done: true },
];

const contestProfiles: Record<
  EcosystemId,
  {
    brand: string;
    sidebarLabel: string;
    sidebarNote: string;
    overline: string;
    headline: string;
    heroCopy: string;
    ribbonCopy: string;
    panelLabel: string;
    panelTitle: string;
    primaryActionLabel: string;
    recordingNote: string;
    pitch: string;
  }
> = {
  mantle: {
    brand: "Mantle ChainAgent",
    sidebarLabel: "Mantle blueprint",
    sidebarNote: "Contest-specific shell only. Build Mantle-native data/actions before any final video.",
    overline: "Mantle recording draft",
    headline: "Agentic wallet intelligence for Mantle builders.",
    heroCopy:
      "A focused Mantle version should turn wallet and yield activity into an AI alpha brief with explicit action budgets.",
    ribbonCopy: "This mode hides other contests, but Mantle still needs live adapter work before submission.",
    panelLabel: "Mantle contest draft",
    panelTitle: "AI alpha brief blueprint",
    primaryActionLabel: "Refresh Mantle blueprint",
    recordingNote: "Blueprint only: do not record as a final Mantle submission until a native Mantle integration is added.",
    pitch:
      "ChainAgent Radar for Mantle explains wallet behavior, yield exposure, and agent action confidence in one sponsor-specific operating brief.",
  },
  qie: {
    brand: "QIE ChainAgent",
    sidebarLabel: "QIE blueprint",
    sidebarNote: "Contest-specific shell only. Add QIE-native SDK/API proof before recording.",
    overline: "QIE recording draft",
    headline: "QIE wallet actions, translated into an AI operating brief.",
    heroCopy:
      "A focused QIE version should guide wallet, pass, stable, and DEX actions without leaking BNB demo data into the submission.",
    ribbonCopy: "This mode is ready for copy/story review, but the QIE adapter still needs real ecosystem calls.",
    panelLabel: "QIE contest draft",
    panelTitle: "QIE wallet action blueprint",
    primaryActionLabel: "Refresh QIE blueprint",
    recordingNote: "Blueprint only: use this for planning, not final submission, until QIE-native integration is live.",
    pitch:
      "ChainAgent Radar for QIE packages wallet readiness, QIE ecosystem actions, and disclosure into a judge-friendly submission brief.",
  },
  bnb: {
    brand: "BNB ChainAgent",
    sidebarLabel: "BNB recording build",
    sidebarNote: "Contest-ready view. Other ecosystems are hidden so the demo reads as a dedicated BNB Hack project.",
    overline: "BNB Hack: Online Edition",
    headline: "BNB wallet intelligence with an approval-safe AI agent.",
    heroCopy:
      "A single-purpose BNB demo with live BSC RPC, optional indexer enrichment, and a dry-run AgentPay ticket that never asks for a signature.",
    ribbonCopy: "This is the version to record first: BNB-only copy, BNB-only proof, and a BNB submission pack.",
    panelLabel: "BNB live demo",
    panelTitle: "Live wallet brief + safety gate",
    primaryActionLabel: "Run BNB live brief",
    recordingNote:
      "Recording-safe: run the live brief, simulate AgentPay, then copy the BNB submission pack. No unrelated contests appear in this mode.",
    pitch:
      "BNB ChainAgent Radar turns a BNB wallet into a live readiness score, risk explanation, and human-approved agent action plan.",
  },
  hackindia: {
    brand: "Sharp ChainAgent",
    sidebarLabel: "Sharp blueprint",
    sidebarNote: "Contest-specific shell only. Confirm eligibility and token utility requirements before recording.",
    overline: "HackIndia Web3 draft",
    headline: "Sharp Token utility, explained as wallet intelligence.",
    heroCopy:
      "A focused Sharp version should show earn, spend, buy, and credential flows with clear token-utility disclosure.",
    ribbonCopy: "This mode frames the Sharp story, but it is still a blueprint until the required SDK/token actions are live.",
    panelLabel: "Sharp contest draft",
    panelTitle: "Token utility blueprint",
    primaryActionLabel: "Refresh Sharp blueprint",
    recordingNote: "Blueprint only: do not record as final until Sharp-specific integration and eligibility are confirmed.",
    pitch:
      "ChainAgent Radar for Sharp converts token utility and credential actions into a simple AI operating brief for Web3 judges.",
  },
};

function readContestParam(): EcosystemId | null {
  if (typeof window === "undefined") return null;

  const value = new URLSearchParams(window.location.search).get("contest");
  return ecosystems.some((item) => item.id === value) ? (value as EcosystemId) : null;
}

function createInitialEcosystemId(): EcosystemId {
  return readContestParam() ?? "bnb";
}

function createInitialViewMode(): ViewMode {
  return readContestParam() ? "contest" : "motherbase";
}

function syncViewUrl(viewMode: ViewMode, targetId: EcosystemId) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  if (viewMode === "contest") {
    url.searchParams.set("contest", targetId);
  } else {
    url.searchParams.delete("contest");
  }
  window.history.replaceState(null, "", url);
}

function createContestSnapshot(sourceLabel: string): WalletSnapshot {
  return {
    ...sampleSnapshot,
    source: "demo",
    sourceLabel,
  };
}

function createInitialSnapshots(): Record<EcosystemId, WalletSnapshot> {
  return {
    mantle: createContestSnapshot("Mantle contest demo snapshot"),
    qie: createContestSnapshot("QIE contest demo snapshot"),
    bnb: createContestSnapshot("BNB demo snapshot"),
    hackindia: createContestSnapshot("Sharp contest demo snapshot"),
  };
}

function createInitialAddresses(): Record<EcosystemId, string> {
  return {
    mantle: sampleSnapshot.address,
    qie: sampleSnapshot.address,
    bnb: sampleSnapshot.address,
    hackindia: sampleSnapshot.address,
  };
}

function createInitialStatusMessages(): Record<EcosystemId, string> {
  return {
    mantle: "Mantle blueprint loaded. Live adapter work stays isolated until the contest version is built.",
    qie: "QIE blueprint loaded. No BNB live data is reused in this contest view.",
    bnb: "Demo snapshot loaded. Run the BNB brief to sync live public RPC data.",
    hackindia: "Sharp blueprint loaded. Eligibility and SDK work stay isolated from other contests.",
  };
}

function createInitialSimulations(): Record<EcosystemId, AgentPaymentSimulation | null> {
  return {
    mantle: null,
    qie: null,
    bnb: null,
    hackindia: null,
  };
}

function App() {
  const [ecosystemId, setEcosystemId] = useState<EcosystemId>(createInitialEcosystemId);
  const [viewMode, setViewMode] = useState<ViewMode>(createInitialViewMode);
  const [addressesByEcosystem, setAddressesByEcosystem] = useState<Record<EcosystemId, string>>(createInitialAddresses);
  const [snapshotsByEcosystem, setSnapshotsByEcosystem] = useState<Record<EcosystemId, WalletSnapshot>>(createInitialSnapshots);
  const [statusByEcosystem, setStatusByEcosystem] = useState<Record<EcosystemId, string>>(createInitialStatusMessages);
  const [simulationsByEcosystem, setSimulationsByEcosystem] =
    useState<Record<EcosystemId, AgentPaymentSimulation | null>>(createInitialSimulations);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const ecosystem = ecosystems.find((item) => item.id === ecosystemId) ?? ecosystems[0];
  const contestProfile = contestProfiles[ecosystem.id];
  const isContestMode = viewMode === "contest";
  const isRecordingReady = isContestMode && ecosystem.adapterStatus === "ready";
  const address = addressesByEcosystem[ecosystemId];
  const snapshot = snapshotsByEcosystem[ecosystemId];
  const statusMessage = statusByEcosystem[ecosystemId];
  const simulation = simulationsByEcosystem[ecosystemId];
  const deferredAddress = useDeferredValue(address);
  const isLiveRpc = Boolean(ecosystem.rpcTarget && snapshot.source === "live-rpc");
  const hasLiveAgentPay = Boolean(ecosystem.rpcTarget);
  const analysis = useMemo(() => createAnalysis(ecosystem, snapshot), [ecosystem, snapshot]);
  const submissionMarkdown = useMemo(
    () => createSubmissionMarkdown({ ecosystem, snapshot, analysis, simulation }),
    [analysis, ecosystem, simulation, snapshot],
  );

  function changeViewMode(nextMode: ViewMode) {
    setViewMode(nextMode);
    syncViewUrl(nextMode, ecosystemId);
  }

  function selectEcosystem(nextId: EcosystemId) {
    setEcosystemId(nextId);
    if (viewMode === "contest") {
      syncViewUrl("contest", nextId);
    }
  }

  function updateAddress(targetId: EcosystemId, nextAddress: string) {
    setAddressesByEcosystem((current) => ({ ...current, [targetId]: nextAddress }));
  }

  function updateSnapshot(targetId: EcosystemId, nextSnapshot: WalletSnapshot | ((current: WalletSnapshot) => WalletSnapshot)) {
    setSnapshotsByEcosystem((current) => ({
      ...current,
      [targetId]: typeof nextSnapshot === "function" ? nextSnapshot(current[targetId]) : nextSnapshot,
    }));
  }

  function updateStatus(targetId: EcosystemId, nextStatus: string) {
    setStatusByEcosystem((current) => ({ ...current, [targetId]: nextStatus }));
  }

  function updateSimulation(targetId: EcosystemId, nextSimulation: AgentPaymentSimulation | null) {
    setSimulationsByEcosystem((current) => ({ ...current, [targetId]: nextSimulation }));
  }

  async function connectWallet() {
    const activeId = ecosystemId;

    if (!window.ethereum) {
      startTransition(() => {
        updateAddress(activeId, sampleSnapshot.address);
        updateSnapshot(activeId, (current) => ({ ...current, address: sampleSnapshot.address }));
      });
      updateStatus(activeId, "MetaMask was not detected, so the public sample wallet stayed loaded.");
      return;
    }

    try {
      const accounts = await window.ethereum.request<string[]>({ method: "eth_requestAccounts" });
      const connected = accounts[0] ?? sampleSnapshot.address;
      startTransition(() => {
        updateAddress(activeId, connected);
        updateSnapshot(activeId, (current) => ({ ...current, address: connected }));
      });
      updateStatus(activeId, "Wallet address connected. Run this contest brief when the selected adapter is ready.");
    } catch (error) {
      updateStatus(activeId, error instanceof Error ? error.message : "Wallet connection was cancelled.");
    }
  }

  async function runAnalysis() {
    const activeId = ecosystemId;
    const activeEcosystem = ecosystem;
    const activeAddress = deferredAddress || addressesByEcosystem[activeId] || sampleSnapshot.address;

    setIsAnalyzing(true);
    updateStatus(
      activeId,
      activeEcosystem.rpcTarget
        ? `Syncing ${activeEcosystem.rpcTarget.name} public RPC data...`
        : `Refreshing ${activeEcosystem.name} contest blueprint...`,
    );

    try {
      if (activeEcosystem.rpcTarget) {
        const liveSnapshot = await fetchBnbWalletSnapshot(activeAddress, activeEcosystem.rpcTarget);
        updateAddress(activeId, liveSnapshot.address);
        updateSnapshot(activeId, liveSnapshot);
        updateStatus(
          activeId,
          `Live RPC synced in ${liveSnapshot.rpcLatencyMs}ms at block ${liveSnapshot.blockNumber?.toLocaleString()}. ${liveSnapshot.indexerMessage ?? ""}`,
        );
        return;
      }

      await new Promise<void>((resolve) => window.setTimeout(resolve, 520));
      startTransition(() => {
        updateSnapshot(activeId, (current) => ({
          ...current,
          address: activeAddress,
          source: "demo",
          txCount: current.txCount + 3,
          activeDays: current.activeDays + 1,
          stableVolume: current.stableVolume + 420,
        }));
      });
      updateStatus(activeId, `${activeEcosystem.name} blueprint refreshed. Live SDK work is still gated until this contest adapter is confirmed.`);
    } catch (error) {
      updateStatus(activeId, error instanceof Error ? error.message : "Analysis failed. Try again or switch to demo mode.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function runPaymentSimulation() {
    const activeId = ecosystemId;
    const activeEcosystem = ecosystem;
    const activeSnapshot = snapshotsByEcosystem[activeId];
    const activeAddress = deferredAddress || addressesByEcosystem[activeId] || activeSnapshot.address;

    if (!activeEcosystem.rpcTarget) {
      updateSimulation(activeId, null);
      updateStatus(activeId, `${activeEcosystem.name} does not have a live RPC payment simulator yet.`);
      return;
    }

    setIsSimulating(true);

    try {
      const simulated = await simulateBnbAgentPayment(activeAddress, activeEcosystem.rpcTarget);
      updateSimulation(activeId, simulated);
    } catch (error) {
      updateSimulation(activeId, {
        status: "blocked",
        from: activeAddress,
        to: activeAddress,
        amountNative: "0.01",
        nativeSymbol: activeEcosystem.rpcTarget.nativeSymbol,
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
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(submissionMarkdown);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = submissionMarkdown;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (!copied) {
          throw new Error("Clipboard fallback failed.");
        }
      }
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = submissionMarkdown;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (!copied) {
          throw new Error("Clipboard fallback failed.");
        }

        setCopyState("copied");
        window.setTimeout(() => setCopyState("idle"), 1800);
      } catch {
        setCopyState("failed");
        window.setTimeout(() => setCopyState("idle"), 2200);
      }
    }
  }

  const completed = readiness.filter((item) => item.done).length;

  return (
    <main
      className={isContestMode ? "app-shell contest-shell" : "app-shell"}
      style={{ "--eco": ecosystem.primaryColor, "--eco-accent": ecosystem.accentColor } as CSSProperties}
    >
      <aside className="sidebar" aria-label="Project navigation">
        <div className="brand-mark">
          <Radar size={26} />
          <div>
            <strong>{isContestMode ? contestProfile.brand : "ChainAgent"}</strong>
            <span>{isContestMode ? contestProfile.sidebarLabel : "Prize Ops Console"}</span>
          </div>
        </div>

        <nav className="nav-list">
          <a className="active" href="#radar">
            <Activity size={18} /> {isContestMode ? "Live Brief" : "Radar"}
          </a>
          <a href="#actions">
            <Sparkles size={18} /> {isContestMode ? "Proof" : "Actions"}
          </a>
          <a href="#submission">
            <ClipboardCheck size={18} /> Submission
          </a>
        </nav>

        <div className="sidebar-note">
          <span>{isContestMode ? "Recording mode" : "Current batch"}</span>
          <strong>{isContestMode ? ecosystem.contest : "Mantle to QIE to BNB"}</strong>
          <p>{isContestMode ? contestProfile.sidebarNote : "One motherbase, separate contest-specific integrations and disclosures."}</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="section-label">{isContestMode ? contestProfile.overline : "Online Web3 prize machine"}</p>
            <h1>{isContestMode ? contestProfile.headline : "AI wallet intelligence, rebuilt per sponsor."}</h1>
            <p className="hero-copy">
              {isContestMode
                ? contestProfile.heroCopy
                : "The motherbase is for internal prize operations. Each final hackathon submission gets a focused contest view, unique copy, and honest disclosure."}
            </p>
            {isContestMode ? (
              <div className="hero-proof-strip" aria-label="Contest proof points">
                <span>{ecosystem.chainLabel}</span>
                <span>{ecosystem.prizeShape}</span>
                <span>{ecosystem.adapterStatus === "ready" ? "Live adapter" : "Adapter blueprint"}</span>
              </div>
            ) : null}
          </div>
          <div className="topbar-actions">
            <div className="mode-toggle" aria-label="View mode">
              <button className={!isContestMode ? "active" : ""} type="button" onClick={() => changeViewMode("motherbase")}>
                Motherbase
              </button>
              <button className={isContestMode ? "active" : ""} type="button" onClick={() => changeViewMode("contest")}>
                Contest demo
              </button>
            </div>
            <button className="icon-button" type="button" onClick={runAnalysis} aria-label="Refresh analysis">
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {isContestMode ? (
          <section className="contest-ribbon" aria-label={`${ecosystem.name} contest mode`}>
            <div>
              <span>Contest demo mode</span>
              <strong>{ecosystem.contest}</strong>
              <p>{contestProfile.ribbonCopy}</p>
            </div>
            <div className="contest-ribbon-meta">
              <span>{ecosystem.deadline}</span>
              <span>{ecosystem.track}</span>
              <span>{ecosystem.adapterStatus}</span>
            </div>
          </section>
        ) : (
          <section className="ecosystem-tabs" aria-label="Ecosystem selector">
            {ecosystems.map((item) => (
              <button
                key={item.id}
                className={item.id === ecosystem.id ? "selected" : ""}
                type="button"
                onClick={() => selectEcosystem(item.id)}
              >
                <span>{item.name}</span>
                <small>{item.deadline}</small>
              </button>
            ))}
          </section>
        )}

        {isContestMode ? (
          <section className={isRecordingReady ? "recording-banner ready" : "recording-banner warning"}>
            <div>
              <strong>{isRecordingReady ? "Recording-safe contest view" : "Blueprint only, not final yet"}</strong>
              <p>{contestProfile.recordingNote}</p>
            </div>
            <span>{isRecordingReady ? "Demo-ready" : "Needs live adapter"}</span>
          </section>
        ) : null}

        <section className="grid-primary" id="radar">
          <article className="panel analysis-panel">
            <div className="panel-heading">
              <div>
                <p className="section-label">{isContestMode ? contestProfile.panelLabel : ecosystem.contest}</p>
                <h2>{isContestMode ? contestProfile.panelTitle : ecosystem.track}</h2>
              </div>
              <span className="status-chip">{ecosystem.adapterStatus}</span>
            </div>

            <div className="wallet-row">
              <label htmlFor="wallet-address">Wallet or address</label>
              <div className="input-row">
                <input
                  id="wallet-address"
                  value={address}
                  onChange={(event) => updateAddress(ecosystemId, event.target.value)}
                  placeholder="0x..."
                />
                <button type="button" onClick={connectWallet}>
                  <Wallet size={17} /> Connect
                </button>
              </div>
              <div className={isLiveRpc ? "source-banner live" : "source-banner"}>
                <strong>{isLiveRpc ? "Live RPC" : ecosystem.rpcTarget ? "Demo mode" : "Adapter blueprint"}</strong>
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
                <h3>
                  {isContestMode
                    ? `${shortenAddress(snapshot.address)} powers the ${ecosystem.name} judge demo`
                    : `${shortenAddress(snapshot.address)} is demo-ready for ${ecosystem.name}`}
                </h3>
                <p>{analysis.summary}</p>
                <button className="primary-action" type="button" onClick={runAnalysis} disabled={isAnalyzing}>
                  {isAnalyzing ? <RefreshCw size={17} /> : <Sparkles size={17} />}
                  {isAnalyzing ? "Analyzing" : isContestMode ? contestProfile.primaryActionLabel : ecosystem.rpcTarget ? "Run AI brief" : "Refresh blueprint"}
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
              <strong>{isLiveRpc && snapshot.nativeBalance ? `${snapshot.nativeBalance} ${snapshot.nativeSymbol}` : "Demo estimate"}</strong>
            </div>
            <div className="metric-row">
              <Activity size={20} />
              <span>Latest block</span>
              <strong>{isLiveRpc ? snapshot.blockNumber?.toLocaleString() ?? "Not synced" : "Not synced"}</strong>
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

        {ecosystem.rpcTarget ? (
        <section className="panel indexer-panel" aria-label={`${ecosystem.name} indexer intelligence`}>
          <div className="panel-heading">
            <div>
              <p className="section-label">{ecosystem.name} indexer intelligence</p>
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
        ) : (
          <section className="panel indexer-panel" aria-label={`${ecosystem.name} adapter blueprint`}>
            <div className="panel-heading">
              <div>
                <p className="section-label">{ecosystem.name} adapter blueprint</p>
                <h2>Contest-specific integration plan</h2>
              </div>
              <span className="indexer-status partial">{ecosystem.adapterStatus}</span>
            </div>

            <div className="blueprint-grid">
              <div>
                <p>
                  This motherbase view keeps {ecosystem.name} separated from BNB live RPC data. The final contest version should
                  add ecosystem-native SDK/API calls before recording or submission.
                </p>
                <div className="indexer-stats">
                  <span>
                    <Layers3 size={16} />
                    {ecosystem.chainLabel}
                  </span>
                  <span>
                    <CircleDollarSign size={16} />
                    {ecosystem.prizeShape}
                  </span>
                  <span>
                    <ShieldCheck size={16} />
                    No cross-contest live state
                  </span>
                </div>
              </div>

              <div className="hook-list compact">
                {ecosystem.sponsorHooks.map((hook) => (
                  <span key={hook}>{hook}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasLiveAgentPay ? (
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
        ) : (
          <section className="panel agentpay-panel" aria-label={`${ecosystem.name} action blueprint`}>
            <div className="panel-heading">
              <div>
                <p className="section-label">{ecosystem.name} action blueprint</p>
                <h2>Design the contest action before the demo</h2>
              </div>
              <span className="status-chip">{ecosystem.adapterStatus}</span>
            </div>

            <div className="action-blueprint">
              {ecosystem.demoActions.map((action, index) => (
                <div key={action.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{action.label}</h3>
                  <p>{action.detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}

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

        <section className="panel submission-pack-panel" aria-label={`${ecosystem.name} submission pack`}>
          <div className="panel-heading">
            <div>
              <p className="section-label">{ecosystem.name} submission pack</p>
              <h2>Copy-ready markdown for this contest form</h2>
            </div>
            <button className="secondary-action" type="button" onClick={copySubmissionPack}>
              {copyState === "copied" ? <Check size={16} /> : <Copy size={16} />}
              {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy Markdown"}
            </button>
          </div>

          <div className="submission-pack-grid">
            <div className="submission-summary">
              <h3>What to say in 15 seconds</h3>
              <p>{isContestMode ? contestProfile.pitch : `ChainAgent Radar turns ${ecosystem.name} wallet and ecosystem data into a contest-specific AI operating brief, then packages the demo flow, integration notes, and disclosure for submission.`}</p>
            </div>
            <div className="submission-checks">
              <span>Live RPC: {isLiveRpc ? "ready" : ecosystem.rpcTarget ? "run brief" : "not applicable"}</span>
              <span>Indexer: {snapshot.indexerStatus ?? "not configured"}</span>
              <span>Action demo: {hasLiveAgentPay ? simulation?.status ?? "not simulated" : "blueprint"}</span>
              <span>Disclosure: {hasLiveAgentPay ? "dry-run only, no signature" : "adapter not live yet"}</span>
            </div>
          </div>

          <pre className="submission-preview">{submissionMarkdown}</pre>
        </section>
      </section>
    </main>
  );
}

export default App;
