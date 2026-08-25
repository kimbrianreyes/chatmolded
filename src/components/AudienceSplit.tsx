"use client";

import React, { useState } from "react";
import { Code, Buildings, CheckCircle, ArrowRight, TerminalWindow, IdentificationCard, ShieldCheck } from "@phosphor-icons/react";

export default function AudienceSplit() {
  const [activeTab, setActiveTab] = useState<"dev" | "business">("dev");

  return (
    <section id="workspaces" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#06080d]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Targeted for Developer Portfolios &amp; Small Business
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
              Eliminate friction for recruiters inspecting your portfolio, or automate customer FAQs without hiring full-time support staff.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1 text-xs">
            <button
              onClick={() => setActiveTab("dev")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold transition-all ${
                activeTab === "dev"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code weight="bold" className="h-4 w-4" />
              <span>Developer Portfolios</span>
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold transition-all ${
                activeTab === "business"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Buildings weight="bold" className="h-4 w-4" />
              <span>Small Business &amp; SaaS</span>
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          {/* Left Column: Specific Features */}
          <div className="lg:col-span-6 space-y-5">
            {activeTab === "dev" ? (
              <>
                <h3 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
                  Let Recruiters Query Your Stack &amp; Repos 24/7
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Static PDF resumes get scanned in 6 seconds. Embed an interactive AI assistant trained on your GitHub READMEs, case studies, and engineering background.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    "Answers precise questions regarding framework depth, architecture, and tradeoffs",
                    "Embeds in Next.js, Astro, React, or standard HTML portfolio with 1 line",
                    "Runs 100% free with your personal Groq or OpenAI API key",
                    "Customized to match your portfolio typography and color palette",
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle weight="fill" className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span className="text-xs text-slate-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
                  Automate Customer Inquiries &amp; Lead Intake
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Don&apos;t lose potential customers because you&apos;re sleeping or coding. Ingest your pricing tables, refund policies, and user manuals in seconds.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    "Deflects 70%+ of repetitive support questions on pricing and setup",
                    "Domain Whitelisting ensures the bot cannot be hijacked on third-party sites",
                    "Zero monthly platform markup; you only pay raw provider token costs",
                    "Sandboxed iframe architecture guarantees 0% CSS collision with your storefront",
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle weight="fill" className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span className="text-xs text-slate-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Column: Tactical Snapshot */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-white/[0.08] bg-[#0c101a] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
                <span className="font-mono text-emerald-400 font-semibold">
                  {activeTab === "dev" ? "// portfolio_context.json" : "// business_faq.json"}
                </span>
                <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  BYOK Active
                </span>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="rounded-lg bg-[#06080e] p-3.5 border border-white/[0.04] text-slate-300 leading-relaxed">
                  {activeTab === "dev" ? (
                    <>
                      <p className="text-slate-500">// Sample Query &amp; Retrieved Response:</p>
                      <p className="text-emerald-300 mt-1">&gt; User: What did Alex build with Next.js?</p>
                      <p className="text-slate-300 mt-1">
                        &gt; Bot: Alex built ChatMolded.app (a BYOK chatbot platform with pgvector RAG) and DevMetrics.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-500">// Sample Query &amp; Retrieved Response:</p>
                      <p className="text-emerald-300 mt-1">&gt; User: Can I cancel my plan anytime?</p>
                      <p className="text-slate-300 mt-1">
                        &gt; Bot: Yes! All plans are month-to-month with a 14-day zero-questions refund guarantee.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
