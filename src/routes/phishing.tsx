import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, MailWarning, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/hooks/use-app-state";

export const Route = createFileRoute("/phishing")({
  head: () => ({
    meta: [
      { title: "Phishing Simulator — CyberSense AI" },
      { name: "description", content: "Train your eye against real-world phishing emails. Spot the red flags." },
      { property: "og:title", content: "Phishing Simulator — CyberSense AI" },
      { property: "og:description", content: "Train your eye against real-world phishing emails. Spot the red flags." },
    ],
  }),
  component: PhishingPage,
});

interface RedFlag {
  id: string;
  label: string;
  explanation: string;
}

const FLAGS: RedFlag[] = [
  {
    id: "sender",
    label: "Sender address",
    explanation:
      "The domain is 'paypa1-security.com' — note the digit '1' instead of an 'l'. Classic look-alike domain spoofing.",
  },
  {
    id: "urgency",
    label: "Urgent subject line",
    explanation:
      "Urgency phrases like 'within 24 hours' pressure you to act before thinking. A legitimate provider will not threaten account closure this way.",
  },
  {
    id: "greeting",
    label: "Generic greeting",
    explanation:
      "'Dear Customer' instead of your real name suggests a mass-mailed phishing campaign, not a personalized message.",
  },
  {
    id: "link",
    label: "Suspicious link",
    explanation:
      "The visible text says paypal.com but the actual URL points to 'secure-paypa1.net/login'. Always hover before clicking.",
  },
  {
    id: "attachment",
    label: "Unexpected attachment",
    explanation:
      "Invoices and receipts as .zip or .html attachments are a common malware delivery vector.",
  },
];

function PhishingPage() {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [activeTip, setActiveTip] = useState<RedFlag | null>(null);
  const [completed, setCompleted] = useState(false);
  const { completePhishingSim } = useAppState();

  const click = (flag: RedFlag) => {
    setFound((prev) => new Set(prev).add(flag.id));
    setActiveTip(flag);
  };

  const reset = () => {
    setFound(new Set());
    setActiveTip(null);
    setCompleted(false);
  };

  const finish = () => {
    if (completed) return;
    setCompleted(true);
    completePhishingSim(20);
  };

  const isFound = (id: string) => found.has(id);

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] text-cyber-cyan uppercase">
            // simulation
          </div>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold mt-1 text-glow-cyan">
            PHISHING SIMULATOR
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Click on every suspicious element you can find in this email.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm">
            RED FLAGS FOUND:{" "}
            <span className="text-cyber-cyan font-bold">{found.size}</span>
            <span className="text-muted-foreground">/{FLAGS.length}</span>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-(--glass-border) text-xs font-mono hover:border-cyber-cyan/50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        {/* Email mockup */}
        <div className="rounded-2xl overflow-hidden border border-(--glass-border) bg-[oklch(0.98_0.005_240)] text-[oklch(0.2_0.02_260)]">
          <div className="bg-[oklch(0.95_0.005_240)] px-4 py-2 flex items-center gap-2 text-xs border-b border-black/5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="ml-3 font-medium">Inbox · PayPa1 Security</div>
          </div>

          <div className="px-6 py-5">
            <button
              onClick={() => click(FLAGS[1])}
              className={`text-left text-xl font-semibold hover:bg-yellow-100 rounded px-1 -mx-1 transition ${
                isFound("urgency") ? "bg-rose-100 ring-1 ring-rose-400" : ""
              }`}
            >
              ⚠️ Action required: Account will be suspended within 24 hours
            </button>

            <div className="mt-3 text-sm text-gray-600 flex flex-wrap items-center gap-2">
              From:{" "}
              <button
                onClick={() => click(FLAGS[0])}
                className={`font-mono text-xs px-1.5 py-0.5 rounded hover:bg-yellow-100 transition ${
                  isFound("sender") ? "bg-rose-100 ring-1 ring-rose-400" : ""
                }`}
              >
                security@paypa1-security.com
              </button>
              <span>· To: you@example.com</span>
            </div>

            <div className="mt-6 space-y-3 text-sm leading-relaxed">
              <button
                onClick={() => click(FLAGS[2])}
                className={`block text-left font-semibold hover:bg-yellow-100 rounded px-1 -mx-1 transition ${
                  isFound("greeting") ? "bg-rose-100 ring-1 ring-rose-400" : ""
                }`}
              >
                Dear Customer,
              </button>
              <p>
                We detected unusual activity on your account. To prevent permanent
                closure, please verify your billing details immediately by clicking
                the secure link below.
              </p>
              <p>
                <button
                  onClick={() => click(FLAGS[3])}
                  className={`underline text-blue-600 hover:bg-yellow-100 rounded px-1 transition ${
                    isFound("link") ? "bg-rose-100 ring-1 ring-rose-400" : ""
                  }`}
                >
                  https://paypal.com/verify-account
                </button>
              </p>
              <p>Failure to confirm will result in permanent suspension.</p>
              <p className="pt-2 text-gray-500">
                Attached:{" "}
                <button
                  onClick={() => click(FLAGS[4])}
                  className={`font-mono text-xs underline hover:bg-yellow-100 rounded px-1 transition ${
                    isFound("attachment") ? "bg-rose-100 ring-1 ring-rose-400" : ""
                  }`}
                >
                  invoice_3892.zip
                </button>
              </p>
              <p className="pt-4 text-gray-500">— PayPa1 Security Team</p>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <MailWarning className="h-4 w-4 text-cyber-amber" />
              <div className="font-mono text-sm font-bold uppercase tracking-wider">
                Findings
              </div>
            </div>
            <ul className="space-y-2">
              {FLAGS.map((f) => (
                <li
                  key={f.id}
                  className={`flex items-center gap-2 text-sm font-mono ${
                    isFound(f.id) ? "text-cyber-green" : "text-muted-foreground"
                  }`}
                >
                  {isFound(f.id) ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="h-4 w-4 rounded border border-current opacity-60" />
                  )}
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          <AnimatePresence mode="wait">
            {activeTip && (
              <motion.div
                key={activeTip.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass-strong rounded-2xl p-4 border-cyber-cyan/40"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-cyber-amber" />
                  <div className="font-mono text-xs uppercase tracking-wider text-cyber-amber">
                    Why this is suspicious
                  </div>
                </div>
                <div className="font-bold text-sm mb-1">{activeTip.label}</div>
                <p className="text-sm text-muted-foreground">{activeTip.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={finish}
            disabled={found.size < FLAGS.length || completed}
            className="w-full px-4 py-2.5 rounded-lg bg-cyber-cyan text-background font-mono font-bold uppercase tracking-wider text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition glow-cyan"
          >
            {completed
              ? "✓ Completed (+20 pts)"
              : found.size < FLAGS.length
                ? `Find all flags (${found.size}/${FLAGS.length})`
                : "Complete simulation"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
