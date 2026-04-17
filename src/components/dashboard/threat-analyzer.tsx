import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Link2, MessageSquare } from "lucide-react";
import { analyzeInput, type AnalysisResult } from "@/lib/cybersense";
import { useAppState } from "@/hooks/use-app-state";

const TABS = [
  { id: "Email", label: "Email Content", icon: Mail, placeholder: "Paste suspicious email content here..." },
  { id: "URL", label: "URL", icon: Link2, placeholder: "https://example.com/login..." },
  { id: "Message", label: "Message", icon: MessageSquare, placeholder: "Paste the message you want to verify..." },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ThreatAnalyzer({
  onResult,
}: {
  onResult?: (r: AnalysisResult) => void;
}) {
  const [tab, setTab] = useState<TabId>("Email");
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const { addAnalysis } = useAppState();

  const placeholder = TABS.find((t) => t.id === tab)!.placeholder;

  const handleAnalyze = async () => {
    if (!input.trim() || scanning) return;
    setScanning(true);
    try {
      const result = await analyzeInput(input, tab);
      addAnalysis(result);
      onResult?.(result);
      setInput("");
    } catch (e) {
      console.error(e);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] text-cyber-cyan uppercase">
            // analyzer
          </div>
          <h2 className="font-mono text-xl sm:text-2xl font-bold mt-1 text-glow-cyan">
            THREAT ANALYZER
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-cyber-green">
          <span className="h-2 w-2 rounded-full bg-cyber-green animate-pulse" />
          ENGINE ONLINE
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-black/30 border border-(--glass-border) w-fit mb-4">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-3 py-1.5 rounded-md font-mono text-xs flex items-center gap-1.5 transition-colors ${
                active ? "text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="analyzer-tab"
                  className="absolute inset-0 bg-cyber-cyan rounded-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="relative h-3.5 w-3.5" />
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="w-full resize-none rounded-xl bg-black/40 border border-(--glass-border) px-4 py-3 font-mono text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_0_3px_var(--cyber-cyan-soft)] transition"
        />
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
            >
              <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-cyber-cyan/30 to-transparent animate-scan-line" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="font-mono text-[11px] text-muted-foreground">
          {input.length} chars · ready to analyze
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!input.trim() || scanning}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-bold uppercase tracking-wider bg-cyber-cyan text-background hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition glow-cyan"
        >
          <Zap className="h-4 w-4" />
          {scanning ? "SCANNING..." : "ANALYZE THREAT"}
        </button>
      </div>
    </div>
  );
}
