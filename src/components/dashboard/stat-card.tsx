import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  color: "cyan" | "red" | "amber" | "green";
  series: number[];
}

const colorMap = {
  cyan: { text: "var(--cyber-cyan)", glow: "shadow-[0_0_24px_-6px_var(--cyber-cyan)]" },
  red: { text: "var(--cyber-red)", glow: "shadow-[0_0_24px_-6px_var(--cyber-red)]" },
  amber: { text: "var(--cyber-amber)", glow: "shadow-[0_0_24px_-6px_var(--cyber-amber)]" },
  green: { text: "var(--cyber-green)", glow: "shadow-[0_0_24px_-6px_var(--cyber-green)]" },
};

export function StatCard({ label, value, delta, icon: Icon, color, series }: StatCardProps) {
  const c = colorMap[color];
  const data = series.map((v, i) => ({ i, v }));
  const id = `grad-${color}-${label.replace(/\s/g, "")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass rounded-xl p-4 relative overflow-hidden hover:border-cyber-cyan/40 transition-colors ${c.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 font-mono text-3xl font-bold" style={{ color: c.text }}>
            {value}
          </div>
          {delta && (
            <div className="mt-1 text-[11px] text-muted-foreground font-mono">{delta}</div>
          )}
        </div>
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in oklab, ${c.text} 18%, transparent)` }}
        >
          <Icon className="h-4 w-4" style={{ color: c.text }} />
        </div>
      </div>

      <div className="h-12 mt-3 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.text} stopOpacity={0.5} />
                <stop offset="100%" stopColor={c.text} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={c.text}
              strokeWidth={1.5}
              fill={`url(#${id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function MiniSpark({ data, color = "var(--cyber-cyan)" }: { data: number[]; color?: string }) {
  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((v, i) => ({ i, v }))}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
