import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import {
  type AnalysisResult,
  classificationColor,
  severityColor,
} from "@/lib/cybersense";
import { SeverityGauge } from "./severity-gauge";

export function AnalysisResultCard({ result }: { result: AnalysisResult }) {
  const isSafe = result.classification === "Safe";
  const cColor = classificationColor(result.classification);
  const sColor = severityColor(result.severity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`glass-strong rounded-2xl p-5 sm:p-6 relative overflow-hidden ${
        !isSafe ? "animate-pulse-glow" : ""
      }`}
      style={{
        borderColor: cColor,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `color-mix(in oklab, ${cColor} 20%, transparent)` }}
          >
            {isSafe ? (
              <CheckCircle2 className="h-5 w-5" style={{ color: cColor }} />
            ) : (
              <ShieldAlert className="h-5 w-5" style={{ color: cColor }} />
            )}
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              classification
            </div>
            <div
              className="font-mono text-xl font-bold uppercase"
              style={{ color: cColor }}
            >
              {result.classification}
            </div>
          </div>
        </div>

        <div
          className="px-3 py-1 rounded-full font-mono text-[11px] font-bold uppercase tracking-widest border"
          style={{
            color: sColor,
            borderColor: sColor,
            backgroundColor: `color-mix(in oklab, ${sColor} 15%, transparent)`,
          }}
        >
          {result.severity} severity
        </div>
      </div>

      <div className="grid md:grid-cols-[160px_1fr] gap-5 items-start">
        <SeverityGauge severity={result.severity} />

        <div className="space-y-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyber-cyan mb-2">
              // why is this dangerous?
            </div>
            <div className="terminal-box px-4 py-3 text-sm leading-relaxed">
              <span className="text-cyber-cyan">$</span>{" "}
              <span className="text-foreground/90">{result.reason}</span>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyber-cyan mb-2">
              // recommended actions
            </div>
            <ul className="space-y-2">
              {result.recommendations.map((r, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <CheckCircle2
                    className="h-4 w-4 mt-0.5 shrink-0"
                    style={{ color: "var(--cyber-green)" }}
                  />
                  <span>{r}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-(--glass-border) flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {isSafe ? (
            <>
              <span className="text-2xl">🎉</span>
              <span className="font-mono">Verified safe — great catch!</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-cyber-amber" />
              <span className="font-mono">Threat neutralized · awareness increased</span>
            </>
          )}
        </div>
        <div
          className="font-mono text-sm font-bold px-3 py-1 rounded-md"
          style={{
            color: "var(--cyber-cyan)",
            backgroundColor: "var(--cyber-cyan-soft)",
          }}
        >
          +{result.pointsEarned} pts
        </div>
      </div>
    </motion.div>
  );
}
