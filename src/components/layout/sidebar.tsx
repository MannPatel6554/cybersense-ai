import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanSearch,
  MailWarning,
  Award,
  History,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAppState } from "@/hooks/use-app-state";

type NavItem = {
  to: "/" | "/analyzer" | "/phishing" | "/score" | "/history" | "/report";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: readonly NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/analyzer", label: "Threat Analyzer", icon: ScanSearch },
  { to: "/phishing", label: "Phishing Simulator", icon: MailWarning },
  { to: "/score", label: "Awareness Score", icon: Award },
  { to: "/history", label: "Threat History", icon: History },
  { to: "/report", label: "Export Report", icon: FileText },
] as const;

export function Sidebar() {
  const { awarenessScore } = useAppState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col glass-strong border-r border-(--glass-border) z-40">
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="relative h-10 w-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-(--cyber-cyan) opacity-40" />
          <div className="absolute inset-0 rounded-full border-t-2 border-(--cyber-cyan) animate-scan-rotate" />
          <ShieldCheck className="relative h-5 w-5 text-cyber-cyan" />
        </div>
        <div>
          <div className="font-mono text-sm font-bold tracking-wider text-glow-cyan">
            CYBERSENSE
          </div>
          <div className="font-mono text-[10px] text-cyber-cyan/70 tracking-[0.3em]">
            AI · v1.0
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.to
            : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="block relative group"
            >
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  active
                    ? "bg-(--cyber-cyan-soft) text-cyber-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-cyber-cyan glow-cyan"
                  />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-mono text-[13px] tracking-wide">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 p-3 rounded-lg glass flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-(--cyber-cyan) to-(--cyber-violet) flex items-center justify-center font-mono font-bold text-background">
          AX
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Agent X</div>
          <div className="text-[11px] text-muted-foreground font-mono">
            SCORE · {awarenessScore}
          </div>
        </div>
        <div
          className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyber-cyan/15 text-cyber-cyan border border-(--cyber-cyan)/30"
          aria-label="awareness score badge"
        >
          {awarenessScore}%
        </div>
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  return (
    <div className="lg:hidden sticky top-0 z-40 glass-strong border-b border-(--glass-border) px-4 py-3 flex items-center gap-3">
      <div className="relative h-8 w-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-t-2 border-(--cyber-cyan) animate-scan-rotate" />
        <ShieldCheck className="relative h-4 w-4 text-cyber-cyan" />
      </div>
      <div className="font-mono text-sm font-bold text-glow-cyan">
        CYBERSENSE AI
      </div>
    </div>
  );
}

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-(--glass-border) px-2 py-2 grid grid-cols-6 gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.to
          : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-0.5 py-1 rounded-md ${
              active ? "text-cyber-cyan" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[9px] font-mono leading-none">
              {item.label.split(" ")[0]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
