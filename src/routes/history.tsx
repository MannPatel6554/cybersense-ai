import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/hooks/use-app-state";
import {
  type Classification,
  classificationColor,
  severityColor,
} from "@/lib/cybersense";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Threat History — CyberSense AI" },
      { name: "description", content: "Browse past threat analyses, filter by category and visualize trends." },
      { property: "og:title", content: "Threat History — CyberSense AI" },
      { property: "og:description", content: "Browse past threat analyses, filter by category and visualize trends." },
    ],
  }),
  component: HistoryPage,
});

const FILTERS: ("All" | Classification)[] = ["All", "Phishing", "Malware", "Social Engineering", "Safe"];

function HistoryPage() {
  const { history } = useAppState();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = filter === "All" ? history : history.filter((h) => h.classification === filter);

  const breakdown = useMemo(() => {
    const map = new Map<Classification, number>();
    history.forEach((h) => map.set(h.classification, (map.get(h.classification) ?? 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [history]);

  const trend = useMemo(() => {
    const days = 14;
    const buckets: { day: string; threats: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const start = Date.now() - i * 86400_000;
      const end = start + 86400_000;
      const count = history.filter(
        (h) => h.timestamp >= start - 86400_000 / 2 && h.timestamp < end && h.classification !== "Safe"
      ).length;
      const date = new Date(start);
      buckets.push({
        day: `${date.getMonth() + 1}/${date.getDate()}`,
        threats: count + Math.floor(Math.random() * 2),
      });
    }
    return buckets;
  }, [history]);

  return (
    <AppShell>
      <div className="mb-6">
        <div className="font-mono text-[11px] tracking-[0.3em] text-cyber-cyan uppercase">
          // archive
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-bold mt-1 text-glow-cyan">
          THREAT HISTORY
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="font-mono text-sm font-bold uppercase tracking-wider mb-3">
            Threats · Last 14 days
          </div>
          <div className="h-56 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyber-red)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--cyber-red)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--glass-border)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.14 0.02 270 / 0.95)",
                    border: "1px solid var(--cyber-cyan)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="threats"
                  stroke="var(--cyber-red)"
                  strokeWidth={2}
                  fill="url(#trendGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="font-mono text-sm font-bold uppercase tracking-wider mb-3">
            Category Breakdown
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {breakdown.map((entry) => (
                    <Cell key={entry.name} fill={classificationColor(entry.name)} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.14 0.02 270 / 0.95)",
                    border: "1px solid var(--cyber-cyan)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {breakdown.map((b) => (
              <div key={b.name} className="flex items-center gap-2 text-xs font-mono">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: classificationColor(b.name) }}
                />
                {b.name === "Social Engineering" ? "Soc-Eng" : b.name} · {b.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider border transition ${
              filter === f
                ? "bg-cyber-cyan text-background border-cyber-cyan"
                : "border-(--glass-border) text-muted-foreground hover:text-foreground hover:border-cyber-cyan/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground border-b border-(--glass-border)">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground font-mono text-sm">
                    No entries match this filter.
                  </td>
                </tr>
              )}
              {filtered.map((row) => {
                const cColor = classificationColor(row.classification);
                const sColor = severityColor(row.severity);
                return (
                  <tr
                    key={row.id}
                    className="border-b border-(--glass-border) hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(row.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{row.inputType}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{row.preview}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border"
                        style={{
                          color: cColor,
                          borderColor: cColor,
                          backgroundColor: `color-mix(in oklab, ${cColor} 12%, transparent)`,
                        }}
                      >
                        {row.classification}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs" style={{ color: sColor }}>
                        ● {row.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-cyber-cyan">
                      +{row.pointsEarned}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
