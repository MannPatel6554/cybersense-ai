import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Trophy, ShieldCheck, Target, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/hooks/use-app-state";

export const Route = createFileRoute("/score")({
  head: () => ({
    meta: [
      { title: "Awareness Score — CyberSense AI" },
      { name: "description", content: "Track your cybersecurity awareness over time and unlock achievements." },
      { property: "og:title", content: "Awareness Score — CyberSense AI" },
      { property: "og:description", content: "Track your cybersecurity awareness over time and unlock achievements." },
    ],
  }),
  component: ScorePage,
});

function ScorePage() {
  const { awarenessScore, history, phishingSimsCompleted } = useAppState();

  const threatsIdentified = history.filter((h) => h.classification !== "Safe").length;
  const safeVerified = history.filter((h) => h.classification === "Safe").length;

  // Build last 7 day score history (mocked progression to current)
  const series = Array.from({ length: 7 }).map((_, i) => {
    const base = Math.max(10, awarenessScore - (6 - i) * 6 + (i % 2 === 0 ? 2 : -1));
    return {
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      score: Math.min(100, Math.max(0, base)),
    };
  });
  series[series.length - 1].score = awarenessScore;

  const badges = [
    { id: "first", label: "First Scan", earned: history.length > 0, icon: Zap },
    { id: "phish", label: "Phishing Expert", earned: phishingSimsCompleted >= 1, icon: ShieldCheck },
    { id: "zero", label: "Zero Threats Week", earned: threatsIdentified === 0, icon: Target },
    { id: "score50", label: "Awareness 50+", earned: awarenessScore >= 50, icon: Trophy },
    { id: "score80", label: "Awareness 80+", earned: awarenessScore >= 80, icon: Trophy },
  ];

  return (
    <AppShell>
      <div className="mb-6">
        <div className="font-mono text-[11px] tracking-[0.3em] text-cyber-cyan uppercase">
          // performance
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-bold mt-1 text-glow-cyan">
          AWARENESS SCORE
        </h1>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-5">
        <div className="glass-strong rounded-2xl p-6 flex flex-col items-center">
          <div className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
            current rating
          </div>
          <BigGauge value={awarenessScore} />
          <div className="mt-4 text-center">
            <div className="font-mono text-sm text-cyber-cyan">
              {awarenessScore < 30
                ? "ROOKIE"
                : awarenessScore < 60
                  ? "ANALYST"
                  : awarenessScore < 85
                    ? "SPECIALIST"
                    : "SENTINEL"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Keep analyzing threats to level up.
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="font-mono text-sm font-bold uppercase tracking-wider mb-3">
            Score · Last 7 days
          </div>
          <div className="h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <defs>
                  <linearGradient id="scoreLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--cyber-cyan)" />
                    <stop offset="100%" stopColor="var(--cyber-violet)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--glass-border)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.14 0.02 270 / 0.95)",
                    border: "1px solid var(--cyber-cyan)",
                    borderRadius: 8,
                    fontFamily: "Space Mono, monospace",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#scoreLine)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--cyber-cyan)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-5">
        <Stat label="Threats Identified" value={threatsIdentified} color="var(--cyber-red)" />
        <Stat label="Phishing Sims Done" value={phishingSimsCompleted} color="var(--cyber-amber)" />
        <Stat label="Safe Items Verified" value={safeVerified} color="var(--cyber-green)" />
      </div>

      <div className="glass rounded-2xl p-5 mt-5">
        <div className="font-mono text-sm font-bold uppercase tracking-wider mb-4">
          Achievements
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`rounded-xl p-4 border text-center transition ${
                  b.earned
                    ? "border-cyber-cyan/50 bg-cyber-cyan/10 glow-cyan"
                    : "border-(--glass-border) bg-black/20 opacity-60"
                }`}
              >
                <Icon
                  className={`h-6 w-6 mx-auto ${
                    b.earned ? "text-cyber-cyan" : "text-muted-foreground"
                  }`}
                />
                <div className="mt-2 font-mono text-xs">{b.label}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {b.earned ? "UNLOCKED" : "LOCKED"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-mono text-3xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function BigGauge({ value }: { value: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v));
  const [text, setText] = useState(0);

  useEffect(() => {
    const c = animate(mv, value, { duration: 1.2, ease: "easeOut" });
    const u = display.on("change", (v) => setText(v));
    return () => {
      c.stop();
      u();
    };
  }, [value, mv, display]);

  return (
    <div className="relative h-[220px] w-[220px] mt-4">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--glass-border)" strokeWidth="14" />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#bigGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 10px var(--cyber-cyan))" }}
        />
        <defs>
          <linearGradient id="bigGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--cyber-cyan)" />
            <stop offset="100%" stopColor="var(--cyber-violet)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-6xl font-bold text-glow-cyan">{text}</div>
        <div className="font-mono text-xs text-muted-foreground tracking-[0.3em]">/ 100</div>
      </div>
    </div>
  );
}
