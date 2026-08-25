"use client";

import React, { useState } from "react";
import { Code2, Building2, Check, ArrowRight, Sparkles, Terminal, FileCode, Users, HelpCircle, ShieldCheck } from "lucide-react";

export default function AudienceSplit() {
  const [activeTab, setActiveTab] = useState<"dev" | "business">("dev");

  return (
    <section id="audience" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#05070c]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Users className="h-3.5 w-3.5" />
            <span>Built For Your Exact Use Case</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Tailored for Developers &amp; Small Businesses
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Whether you&apos;re an engineer showcasing your resume to recruiters or a business automating customer support, ChatMolded gives you full control.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="mt-10 flex justify-center">
          <div className="flex rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("dev")}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === "dev"
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>For Developers &amp; Portfolios</span>
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === "business"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>For Small Businesses &amp; SaaS</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          {/* Left Column: Feature Highlights */}
          <div className="lg:col-span-6 space-y-6">
            {activeTab === "dev" ? (
              <>
                <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>The Ultimate Interactive Developer Portfolio</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
                  Let Recruiters &amp; Clients Chat with Your Experience 24/7
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Instead of hoping recruiters read through a 3-page static PDF resume, embed a smart AI bot right on your personal portfolio. It answers specific questions about your framework experience, recent GitHub repos, and freelance rates instantly.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    "Feed your Resume PDF, GitHub READMEs, and Markdown project notes",
                    "Customized with your personal avatar, brand colors, and greeting",
                    "Zero-cost BYOK hosting using your free Groq or OpenAI API key",
                    "Works seamlessly with Next.js, Astro, React, or static HTML portfolios",
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>24/7 Customer Support Without The $100/mo SaaS Fee</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
                  Instant Customer Support &amp; High-Converting Lead Intake
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Stop losing leads when you&apos;re offline. Train a custom support assistant on your product documentation, pricing tables, refund policies, and onboarding guides in minutes.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    "Upload product guides, DOCX policies, and customer FAQs",
                    "Deflect 70%+ of repetitive support questions automatically",
                    "Sandboxed iframe guarantees it won't clash with your storefront CSS",
                    "Domain whitelisting ensures your chatbot only runs on your approved URL",
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-xs text-slate-300 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Column: Visual Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-800 bg-[#090d17] p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-base">
                    {activeTab === "dev" ? "👨‍💻" : "⚡"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {activeTab === "dev" ? "Portfolio Assistant Preview" : "SaaS Support Bot Preview"}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {activeTab === "dev" ? "Molded on resume.pdf & github.md" : "Molded on pricing_faq.docx & docs.txt"}
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  Ready to Embed
                </span>
              </div>

              {/* Chat Simulation Snippet */}
              <div className="mt-5 space-y-3 font-sans text-xs">
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded bg-slate-800 flex items-center justify-center text-xs shrink-0">
                    {activeTab === "dev" ? "👨‍💻" : "⚡"}
                  </div>
                  <div className="rounded-xl rounded-tl-none bg-slate-800/80 p-3 text-slate-200 border border-slate-700/60 max-w-[85%]">
                    {activeTab === "dev"
                      ? "Hi! I know everything about Alex's engineering background. Ask me about his tech stack or recent fullstack projects!"
                      : "Welcome to Acme Cloud! I can help you with plan comparisons, feature questions, and setup guides."}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <div className="rounded-xl rounded-tr-none bg-indigo-600 p-3 text-white max-w-[85%]">
                    {activeTab === "dev"
                      ? "Has Alex built production applications with Next.js and pgvector?"
                      : "Can we cancel our monthly subscription anytime?"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded bg-slate-800 flex items-center justify-center text-xs shrink-0">
                    {activeTab === "dev" ? "👨‍💻" : "⚡"}
                  </div>
                  <div className="rounded-xl rounded-tl-none bg-slate-800/80 p-3 text-slate-200 border border-slate-700/60 max-w-[85%]">
                    {activeTab === "dev"
                      ? "Yes! Alex built ChatMolded.app using Next.js App Router and PostgreSQL pgvector for vector retrieval, along with FastAPI microservices."
                      : "Absolutely. All subscriptions are month-to-month with no lock-in, and we offer a 14-day zero-questions refund guarantee."}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
                  <FileCode className="h-3.5 w-3.5" /> &lt;script src=&quot;.../widget.js&quot;&gt;
                </span>
                <span className="text-emerald-400 font-semibold">100% BYOK Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
