import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-7xl font-bold text-cyber-cyan text-glow-cyan">404</h1>
        <h2 className="mt-4 font-mono text-xl font-semibold">SIGNAL_LOST</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist on this network.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-cyber-cyan px-4 py-2 text-sm font-mono font-bold uppercase tracking-wider text-background hover:brightness-110 transition glow-cyan"
        >
          Return to base
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CyberSense AI — Cybersecurity Awareness Dashboard" },
      {
        name: "description",
        content:
          "AI-powered cybersecurity awareness dashboard. Analyze threats, simulate phishing, and grow your security IQ.",
      },
      { name: "author", content: "CyberSense AI" },
      { property: "og:title", content: "CyberSense AI — Cybersecurity Awareness Dashboard" },
      {
        property: "og:description",
        content: "Real-time threat analysis, phishing simulator, and awareness scoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
