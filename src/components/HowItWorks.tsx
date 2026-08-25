"use client";

import React from "react";
import { UploadCloud, KeyRound, Code2, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Mold Your Knowledge",
      desc: "Upload your resume, documentation, FAQ, or guidelines. Ingest Plain Text, Markdown, PDF, and DOCX. Safe upload rate-limiting keeps your vectors organized.",
      icon: UploadCloud,
      badge: "Text, PDF, DOCX",
      gradient: "from-indigo-500 to-indigo-700",
      accent: "text-indigo-400",
      border: "hover:border-indigo-500/50",
    },
    {
      number: "02",
      title: "Plug Your API Key (BYOK)",
      desc: "Connect your OpenAI, Groq, or Anthropic API key. You pay 0 platform subscription markup and can take advantage of generous free LLM tiers.",
      icon: KeyRound,
      badge: "100% Zero-Cost",
      gradient: "from-cyan-500 to-blue-700",
      accent: "text-cyan-400",
      border: "hover:border-cyan-500/50",
    },
    {
      number: "03",
      title: "Copy 1-Line Embed Code",
      desc: "Paste a lightweight (<5KB) async script onto your portfolio or website. It renders an isolated floating bubble with zero CSS conflicts.",
      icon: Code2,
      badge: "Sandboxed Iframe",
      gradient: "from-emerald-500 to-teal-700",
      accent: "text-emerald-400",
      border: "hover:border-emerald-500/50",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#07090e]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Effortless 3-Step Setup</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            From Raw Documents to Live Chat in 3 Steps
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            No complex vector databases to manage. No painful backend servers. Just upload, configure, and embed.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0b0f1a] p-7 transition-all duration-300 ${step.border} group hover:-translate-y-1 shadow-lg`}
              >
                <div>
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-slate-700 group-hover:text-slate-500 transition-colors">
                      {step.number}
                    </span>
                    <span className="rounded-full border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                      {step.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br p-0.5 shadow-md">
                    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900">
                      <Icon className={`h-6 w-6 ${step.accent}`} />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="mt-5 text-lg font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${step.accent}`} />
                  <span>Ready out-of-the-box</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
