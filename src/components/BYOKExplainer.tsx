"use client";

import React from "react";
import { CurrencyDollar, ShieldCheck, CheckCircle, XCircle, Lightning, Sparkle } from "@phosphor-icons/react";

export default function BYOKExplainer() {
  return (
    <section id="byok" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#05070c] border-t border-white/[0.07]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-[10px] font-mono font-semibold text-emerald-400 mb-2">
              <Lightning weight="fill" className="h-3 w-3" />
              <span>ZERO MARKUP &bull; OPENROUTER FIRST</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Why OpenRouter + BYOK Eliminates the $50/mo SaaS Tax
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
              Traditional chatbot builders charge $39–$99/month just to proxy simple queries. With OpenRouter BYOK, one free key connects your bot to 100+ models with 0% platform markup.
            </p>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            $0 Platform Hosting
          </span>
        </div>

        {/* Comparison Grid (Double-Bezel Architecture) */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          {/* Competitor Model (Left - 5 cols) */}
          <div className="lg:col-span-5 p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-xl">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-300">Traditional Chatbot SaaS</h3>
                    <p className="text-[11px] text-slate-400">Monthly subscription markup</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                    $39 – $99 / mo
                  </span>
                </div>

                <div className="mt-5 space-y-3.5 text-xs">
                  {[
                    "Fixed monthly billing even with zero visitor questions",
                    "Strict 500-message limits with steep overage penalties",
                    "Locked into 1 single proprietary closed-source model",
                    "Custom branding & logo removal locked behind enterprise tier",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-400">
                      <XCircle weight="fill" className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-rose-500/5 p-3.5 border border-rose-500/20 text-xs text-rose-300">
                ⚠️ You pay 100x markup on raw LLM inference.
              </div>
            </div>
          </div>

          {/* ChatMolded BYOK with OpenRouter (Right - 7 cols) */}
          <div className="lg:col-span-7 p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-emerald-500/30 shadow-2xl">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>ChatMolded + OpenRouter BYOK</span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-mono text-emerald-300 border border-emerald-500/30 font-semibold">
                        Easiest Setup
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Direct provider connection &bull; Zero middleman fees</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                    100% Free Core
                  </span>
                </div>

                <div className="mt-5 space-y-3.5 text-xs">
                  {[
                    "1 single OpenRouter key unlocks 100+ free & commercial models (Laguna, Llama 3.3, Mistral, DeepSeek)",
                    "Free models available ($0.00 cost per chat with zero credit card required)",
                    "Also supports Groq, xAI Grok, DeepSeek, Gemini, and OpenAI out of the box",
                    "Custom branding, logo upload, and domain whitelisting included for everyone",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-200">
                      <CheckCircle weight="fill" className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/[0.08] text-center font-mono text-xs">
                <div className="rounded-xl bg-[#05070d] p-3 border border-white/[0.06] shadow-sm">
                  <span className="block text-[9px] text-slate-400 uppercase">OpenRouter Free</span>
                  <span className="font-bold text-emerald-400 text-sm">$0.00</span>
                </div>
                <div className="rounded-xl bg-[#05070d] p-3 border border-white/[0.06] shadow-sm">
                  <span className="block text-[9px] text-slate-400 uppercase">Groq Instant</span>
                  <span className="font-bold text-emerald-400 text-sm">$0.00</span>
                </div>
                <div className="rounded-xl bg-[#05070d] p-3 border border-white/[0.06] shadow-sm">
                  <span className="block text-[9px] text-slate-400 uppercase">Platform Fee</span>
                  <span className="font-bold text-cyan-400 text-sm">Free Forever</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
