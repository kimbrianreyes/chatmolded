"use client";

import React, { useState } from "react";
import { Code2, Copy, Check, Terminal, ShieldAlert, Cpu } from "lucide-react";

export default function EmbedCodeShowcase() {
  const [activeTab, setActiveTab] = useState<"html" | "next" | "react" | "astro">("html");
  const [copied, setCopied] = useState(false);

  const snippets = {
    html: `<!-- ChatMolded Floating Chatbot Embed -->
<script 
  src="https://chatmolded.app/widget.js" 
  data-bot-id="cm_your_bot_id" 
  data-theme="indigo"
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
          data-bot-id="cm_your_bot_id"
          data-theme="indigo"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}`,
    react: `// In your App.tsx or index.html
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://chatmolded.app/widget.js";
    script.setAttribute("data-bot-id", "cm_your_bot_id");
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div>Your Portfolio / App</div>;
}`,
    astro: `---
// src/layouts/Layout.astro
---
<!doctype html>
<html lang="en">
  <head>
    <title>My Portfolio</title>
    <!-- ChatMolded Widget -->
    <script 
      src="https://chatmolded.app/widget.js" 
      data-bot-id="cm_your_bot_id" 
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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="embed" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#070a13]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Code2 className="h-3.5 w-3.5" />
            <span>Developer-Friendly Integration</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Embed with 1 Line of Code on Any Stack
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Zero dependency conflicts. The widget runs in an isolated sandbox iframe so it never collides with your CSS or JavaScript libraries.
          </p>
        </div>

        {/* Code Container */}
        <div className="mt-10 mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-[#06080f] shadow-2xl overflow-hidden">
          {/* Tabs header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 py-2.5">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
              {[
                { id: "html", label: "HTML / Vanilla" },
                { id: "next", label: "Next.js" },
                { id: "react", label: "React / Vite" },
                { id: "astro", label: "Astro" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors self-end sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="p-6 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
            <pre>
              <code>{snippets[activeTab]}</code>
            </pre>
          </div>

          {/* Footer Highlights */}
          <div className="border-t border-slate-800 bg-[#0a0e19] px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <Cpu className="h-3.5 w-3.5" /> Async Non-Blocking Loader
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldAlert className="h-3.5 w-3.5" /> Strict Domain Whitelisting Protected
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
