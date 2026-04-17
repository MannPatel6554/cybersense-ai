import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScanLine, ShieldAlert, ShieldCheck, Activity } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { ThreatAnalyzer } from "@/components/dashboard/threat-analyzer";
import { ThreatFeed } from "@/components/dashboard/threat-feed";
import { AnalysisResultCard } from "@/components/dashboard/analysis-result";
import { useAppState } from "@/hooks/use-app-state";
import type { AnalysisResult } from "@/lib/cybersense";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CyberSense AI" },
      { name: "description", content: "Live cybersecurity awareness dashboard with threat analyzer and activity feed." },
      { property: "og:title", content: "Dashboard — CyberSense AI" },
      { property: "og:description", content: "Live cybersecurity awareness dashboard with threat analyzer and activity feed." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { history, awarenessScore } = useAppState();
  const [latest, setLatest] = useState<AnalysisResult | null>(null);

  const today = history.filter((h) => Date.now() - h.timestamp < 24 * 3600_000);
  const threats = history.filter((h) => h.classification !== "Safe");
  const safe = history.filter((h) => h.classification === "Safe");

  // Mock sparklines
  const spark1 = [3, 5, 4, 6, 8, 7, 9];
  const spark2 = [1, 2, 1, 3, 2, 4, 3];
  const spark3 = [5, 4, 6, 5, 7, 6, 8];
  const spark4 = [30, 35, 33, 38, 40, 41, awarenessScore];

  return (
    <AppShell>
      <div className="mb-6">
        <div className="font-mono text-[11px] tracking-[0.3em] text-cyber-cyan uppercase">
          // overview
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-bold mt-1 text-glow-cyan">
          MISSION CONTROL
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Real-time threat surface across your inbox, browser and messages.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Scans Today"
          value={today.length}
          delta="+12% vs yesterday"
          icon={ScanLine}
          color="cyan"
          series={spark1}
        />
        <StatCard
          label="Threats Detected"
          value={threats.length}
          delta="last 30 days"
          icon={ShieldAlert}
          color="red"
          series={spark2}
        />
        <StatCard
          label="Safe Items"
          value={safe.length}
          delta="verified clean"
          icon={ShieldCheck}
          color="green"
          series={spark3}
        />
        <StatCard
          label="Awareness"
          value={`${awarenessScore}%`}
          delta="growing daily"
          icon={Activity}
          color="amber"
          series={spark4}
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          <ThreatAnalyzer onResult={setLatest} />
          {latest && <AnalysisResultCard result={latest} />}
        </div>
        <ThreatFeed items={history} />
      </div>
    </AppShell>
  );
}
