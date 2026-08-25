"use client";

import React from "react";
import { CurrencyDollar, ShieldCheck, CheckCircle, XCircle } from "@phosphor-icons/react";

export default function BYOKExplainer() {
  return (
    <section id="byok" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#05070c] border-t border-white/[0.07]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Why BYOK Eliminates the $50/mo SaaS Tax
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
              Traditional chatbot SaaS tools charge expensive subscriptions to proxy simple LLM calls. With ChatMolded BYOK, you pay 0% platform markup.
            </p>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold">
            100% Free Core Platform
          </span>
        </div>

        {/* Comparison Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          {/* Competitor Model (Left - 5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-white/[0.08] bg-[#0c101a] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-300">Traditional Chatbot SaaS</h3>
                  <p className="text-[11px] text-slate-400">Monthly subscription markup</p>
                </div>
                <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                  $39 – $99 / mo
                </span>
              </div>

              <div className="mt-5 space-y-3 text-xs">
                {[
                  "Fixed monthly cost even with zero website visits",
                  "Arbitrary 500-message limits with steep overage penalty",
                  "Custom branding locked behind expensive tiers",
                  "Closed proprietary blackbox infrastructure",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-400">
                    <XCircle weight="fill" className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-rose-500/5 p-3 border border-rose-500/20 text-[11px] text-rose-300">
              ⚠️ You pay 100x markup on raw LLM inference.
            </div>
          </div>

          {/* ChatMolded BYOK (Right - 7 cols) */}
          <div className="lg:col-span-7 rounded-xl border border-emerald-500/40 bg-[#0a1215] p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">ChatMolded BYOK Architecture</h3>
                  <p className="text-[11px] text-slate-400">Direct provider connection</p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/30">
                  $0 Platform Fee
                </span>
              </div>

              <div className="mt-5 space-y-3 text-xs">
                {[
                  "100% Free platform hosting with zero markup",
                  "Use Groq for completely free inference (or OpenAI at ~$0.0001 per message)",
                  "No monthly message caps or artificial throttling",
                  "Domain whitelisting and sandboxed iframe isolation built-in",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-200">
                    <CheckCircle weight="fill" className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2.5 pt-4 border-t border-white/[0.08] text-center font-mono text-xs">
              <div className="rounded bg-black/40 p-2 border border-white/[0.06]">
                <span className="block text-[10px] text-slate-400">Groq LLaMA 3</span>
                <span className="font-bold text-emerald-400">$0.00</span>
              </div>
              <div className="rounded bg-black/40 p-2 border border-white/[0.06]">
                <span className="block text-[10px] text-slate-400">GPT-4o mini</span>
                <span className="font-bold text-emerald-400">~$0.0001/chat</span>
              </div>
              <div className="rounded bg-black/40 p-2 border border-white/[0.06]">
                <span className="block text-[10px] text-slate-400">ChatMolded</span>
                <span className="font-bold text-cyan-400">Free Forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
