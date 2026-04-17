import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/hooks/use-app-state";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Export Report — CyberSense AI" },
      { name: "description", content: "Generate a shareable PDF summary of your awareness training and threats." },
      { property: "og:title", content: "Export Report — CyberSense AI" },
      { property: "og:description", content: "Generate a shareable PDF summary of your awareness training and threats." },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { awarenessScore, history, phishingSimsCompleted } = useAppState();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const threats = history.filter((h) => h.classification !== "Safe");
  const topThreats = threats.slice(0, 3);

  const dateRange = (() => {
    if (history.length === 0) return "—";
    const oldest = Math.min(...history.map((h) => h.timestamp));
    const newest = Math.max(...history.map((h) => h.timestamp));
    const fmt = (t: number) =>
      new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    return `${fmt(oldest)} → ${fmt(newest)}`;
  })();

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    }, 1600);
  };

  return (
    <AppShell>
      <div className="mb-6">
        <div className="font-mono text-[11px] tracking-[0.3em] text-cyber-cyan uppercase">
          // export
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-bold mt-1 text-glow-cyan">
          EXPORT REPORT
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Generate a shareable PDF summary of your awareness training.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* PDF preview */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-(--glass-border) bg-[oklch(0.98_0.005_240)] text-[oklch(0.18_0.02_260)] overflow-hidden shadow-[0_30px_80px_-30px_var(--cyber-cyan)]"
        >
          <div className="px-8 py-6 border-b-2 border-[oklch(0.82_0.18_220)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[oklch(0.14_0.02_270)] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-[oklch(0.82_0.18_220)]" />
              </div>
              <div>
                <div className="font-mono font-bold tracking-wider text-sm">
                  CYBERSENSE AI
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
                  Awareness Report
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                Generated
              </div>
              <div className="font-mono text-xs">
                {new Date().toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                Recipient
              </div>
              <div className="text-lg font-semibold">Agent X · you@example.com</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg p-3 bg-[oklch(0.95_0.005_240)]">
                <div className="font-mono text-[10px] uppercase text-gray-500">Score</div>
                <div className="text-2xl font-bold text-[oklch(0.5_0.18_220)]">
                  {awarenessScore}%
                </div>
              </div>
              <div className="rounded-lg p-3 bg-[oklch(0.95_0.005_240)]">
                <div className="font-mono text-[10px] uppercase text-gray-500">Threats Found</div>
                <div className="text-2xl font-bold text-[oklch(0.5_0.24_18)]">{threats.length}</div>
              </div>
              <div className="rounded-lg p-3 bg-[oklch(0.95_0.005_240)]">
                <div className="font-mono text-[10px] uppercase text-gray-500">Sims Done</div>
                <div className="text-2xl font-bold text-[oklch(0.5_0.16_75)]">
                  {phishingSimsCompleted}
                </div>
              </div>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                Date range
              </div>
              <div className="text-sm font-mono">{dateRange}</div>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                Top threats detected
              </div>
              {topThreats.length === 0 && (
                <div className="text-sm text-gray-500">No threats detected — clean record.</div>
              )}
              <ul className="space-y-2">
                {topThreats.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between text-sm border-b border-gray-200 py-2"
                  >
                    <span className="truncate mr-3">{t.preview}</span>
                    <span className="font-mono text-xs text-[oklch(0.5_0.24_18)] font-bold">
                      {t.classification.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[10px] text-gray-400 font-mono pt-4 border-t border-gray-200">
              Generated by CyberSense AI · cybersense.ai · confidential
            </div>
          </div>
        </motion.div>

        <div className="glass-strong rounded-2xl p-5 sticky top-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-cyber-cyan" />
            <div className="font-mono text-sm font-bold uppercase tracking-wider">
              Report Options
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <Row label="Format" value="PDF · A4" />
            <Row label="Pages" value="1 page" />
            <Row label="Charts" value="Included" />
            <Row label="Date range" value="All time" />
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyber-cyan text-background font-mono font-bold uppercase tracking-wider text-sm hover:brightness-110 disabled:opacity-60 transition glow-cyan"
          >
            {downloading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                Generating...
              </>
            ) : downloaded ? (
              <>✓ Downloaded</>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download PDF Report
              </>
            )}
          </button>

          <p className="mt-3 text-[11px] text-muted-foreground font-mono">
            * Demo · PDF generation simulated for hackathon prototype.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-(--glass-border) pb-2">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}
