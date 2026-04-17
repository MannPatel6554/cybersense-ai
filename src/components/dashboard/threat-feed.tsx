import { motion } from "framer-motion";
import { Mail, Link2, MessageSquare } from "lucide-react";
import {
  type AnalysisResult,
  classificationColor,
} from "@/lib/cybersense";

const ICONS = { Email: Mail, URL: Link2, Message: MessageSquare };

export function ThreatFeed({ items }: { items: AnalysisResult[] }) {
  const recent = items.slice(0, 6);
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] text-cyber-cyan uppercase">
            // live feed
          </div>
          <h3 className="font-mono text-base font-bold mt-1">Recent Activity</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyber-green">
          <span className="h-1.5 w-1.5 rounded-full bg-cyber-green animate-pulse" />
          LIVE
        </div>
      </div>

      <ul className="space-y-2">
        {recent.length === 0 && (
          <li className="text-sm text-muted-foreground font-mono">No activity yet.</li>
        )}
        {recent.map((item, i) => {
          const Icon = ICONS[item.inputType];
          const color = classificationColor(item.classification);
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-black/30 border border-(--glass-border) hover:border-cyber-cyan/30 transition-colors"
            >
              <div
                className="h-8 w-8 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{item.preview}</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {timeAgo(item.timestamp)} · {item.inputType}
                </div>
              </div>
              <div
                className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border"
                style={{
                  color,
                  borderColor: color,
                  backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)`,
                }}
              >
                {item.classification === "Social Engineering" ? "Soc-Eng" : item.classification}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
