"use client";

import React, { useState } from "react";
import { Code, Copy, Check, TerminalWindow, ShieldCheck } from "@phosphor-icons/react";

export default function EmbedCodeShowcase() {
  const [activeTab, setActiveTab] = useState<"html" | "next" | "react" | "astro">("html");
  const [copied, setCopied] = useState(false);

  const snippets = {
    html: `<!-- ChatMolded Floating Bubble with Custom Logo & Theme -->
<script 
  src="https://chatmolded.app/widget.js" 
  data-bot-id="cm_live_portfolio_bot" 
  data-theme="emerald"
  data-avatar-url="https://yourportfolio.dev/avatar.png"
  data-position="bottom-right"
  defer>
</script>`,
    next: `// src/app/layout.tsx (Next.js App Router)
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://chatmolded.app/widget.js"
          data-bot-id="cm_live_portfolio_bot"
          data-theme="emerald"
          data-avatar-url="https://yourportfolio.dev/avatar.png"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}`,
    react: `// React / Vite Integration
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://chatmolded.app/widget.js";
    s.setAttribute("data-bot-id", "cm_live_portfolio_bot");
    s.setAttribute("data-theme", "emerald");
    s.setAttribute("data-avatar-url", "https://yourportfolio.dev/avatar.png");
    s.defer = true;
    document.body.appendChild(s);
  }, []);

  return <div>My Website</div>;
}`,
    astro: `---
// src/layouts/Layout.astro
---
<!doctype html>
<html lang="en">
  <head>
    <script 
      src="https://chatmolded.app/widget.js" 
      data-bot-id="cm_live_portfolio_bot" 
      data-theme="emerald"
      data-avatar-url="https://yourportfolio.dev/avatar.png"
      defer>
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="embed" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#06080d] border-t border-white/[0.07]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              1-Line Embed with Custom Brand Logo
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
              Pass your custom avatar or company logo URL directly in the script tag, alongside your theme and position preferences.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 font-mono text-xs">
            {[
              { id: "html", label: "HTML" },
              { id: "next", label: "Next.js" },
              { id: "react", label: "React" },
              { id: "astro", label: "Astro" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`rounded-md px-3 py-1.5 transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Terminal Box */}
        <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0c101a] shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#080c14] px-4 py-2.5">
            <span className="font-mono text-xs text-slate-400">
              embed-snippet.{activeTab === "next" ? "tsx" : activeTab === "react" ? "jsx" : activeTab === "astro" ? "astro" : "html"}
            </span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-mono text-slate-200 hover:bg-white/[0.08] transition-colors"
            >
              {copied ? (
                <>
                  <Check weight="bold" className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy weight="bold" className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="p-5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed bg-[#06080e]">
            <pre>
              <code>{snippets[activeTab]}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
