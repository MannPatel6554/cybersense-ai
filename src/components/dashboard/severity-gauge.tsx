import { motion } from "framer-motion";
import { type Severity, severityColor } from "@/lib/cybersense";

const SEVERITY_VALUE: Record<Severity, number> = {
  Low: 0.25,
  Medium: 0.6,
  High: 0.95,
};

export function SeverityGauge({ severity }: { severity: Severity }) {
  const value = SEVERITY_VALUE[severity];
  const color = severityColor(severity);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value);

  return (
    <div className="relative h-[150px] w-[150px] mx-auto">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--glass-border)"
          strokeWidth="10"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          risk
        </div>
        <div
          className="font-mono text-2xl font-bold"
          style={{ color }}
        >
          {Math.round(value * 100)}%
        </div>
        <div
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color }}
        >
          {severity}
        </div>
      </div>
    </div>
  );
}
