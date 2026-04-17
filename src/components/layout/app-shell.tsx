import type { ReactNode } from "react";
import { Sidebar, MobileTopBar, MobileTabBar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileTopBar />
      <main className="lg:ml-64 pb-24 lg:pb-8">
        <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-[1500px] mx-auto">
          {children}
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
}
