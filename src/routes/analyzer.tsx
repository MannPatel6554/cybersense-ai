import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ThreatAnalyzer } from "@/components/dashboard/threat-analyzer";
import { AnalysisResultCard } from "@/components/dashboard/analysis-result";
import { ThreatFeed } from "@/components/dashboard/threat-feed";
import { useAppState } from "@/hooks/use-app-state";
import type { AnalysisResult } from "@/lib/cybersense";

export const Route = createFileRoute("/analyzer")({
  head: () => ({
    meta: [
      { title: "Threat Analyzer — CyberSense AI" },
      { name: "description", content: "Analyze emails, URLs and messages for phishing, malware and social engineering." },
      { property: "og:title", content: "Threat Analyzer — CyberSense AI" },
      { property: "og:description", content: "Analyze emails, URLs and messages for phishing, malware and social engineering." },
    ],
  }),
  component: AnalyzerPage,
});

function AnalyzerPage() {
  const { history } = useAppState();
  const [latest, setLatest] = useState<AnalysisResult | null>(null);

  return (
    <AppShell>
      <div className="mb-6">
        <div className="font-mono text-[11px] tracking-[0.3em] text-cyber-cyan uppercase">
          // analyzer
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-bold mt-1 text-glow-cyan">
          THREAT ANALYZER
        </h1>
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
