"use client";

import React from "react";
import { ShieldCheck, DollarSign, Zap, Lock, Cpu, Check, X } from "lucide-react";

export default function BYOKExplainer() {
  return (
    <section id="byok" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#05070c]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Why BYOK is a Superpower</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Say Goodbye to $50/mo Chatbot Subscriptions
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Most chatbot SaaS companies charge $29 to $99/month just to act as an overpriced middleman. With <strong>ChatMolded BYOK</strong>, you bring your own API key and pay only real provider cost (often $0.00).
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          {/* Traditional SaaS (Left - 5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-rose-500/20 bg-[#120a10]/60 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-rose-300">Traditional Chatbot SaaS</h3>
                  <p className="text-xs text-slate-400">Overpriced markup model</p>
                </div>
                <span className="rounded-md bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300">
                  $39 – $99 / mo
                </span>
              </div>

              <div className="mt-6 space-y-3 text-xs">
                {[
                  "Expensive fixed monthly subscription even with 0 traffic",
                  "Arbitrary message limits (e.g., 500 messages/month cap)",
                  "Branding locked behind expensive $99/mo tier",
                  "Your user chats are stored on proprietary blackbox servers",
                  "Forced to use their outdated or slow model pipelines",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                    <X className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-rose-950/40 p-3 border border-rose-500/20 text-[11px] text-rose-200">
              ⚠️ You end up paying 100x markup on raw LLM token costs.
            </div>
          </div>

          {/* ChatMolded BYOK (Right - 7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#0b1615] to-[#07100e] p-6 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">ChatMolded BYOK Architecture</h3>
                    <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Direct provider connection</p>
                </div>
                <span className="rounded-md bg-emerald-500/20 px-3 py-1 text-sm font-black text-emerald-300 border border-emerald-500/40">
                  $0 Platform Fee
                </span>
              </div>

              <div className="mt-6 space-y-3.5 text-xs">
                {[
                  "100% Free platform hosting — you only pay fractions of a cent directly to LLM providers (e.g. Groq is free, GPT-4o-mini is ~$0.15 / 1M tokens)",
                  "No artificial message throttling or surprise overage fees",
                  "Switch models freely: Groq Llama 3, OpenAI GPT-4o-mini, or Claude 3.5 Haiku",
                  "Direct Edge/Browser inference options for uncompromising privacy",
                  "Full control over custom widget themes, avatar icons, and prompt instructions",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 pt-4 border-t border-emerald-500/20 text-center">
              <div className="rounded-lg bg-emerald-950/30 p-2.5 border border-emerald-500/20">
                <span className="block text-[10px] text-slate-400">Groq Llama 3</span>
                <span className="font-bold text-emerald-400 text-xs">$0 (Free Tier)</span>
              </div>
              <div className="rounded-lg bg-emerald-950/30 p-2.5 border border-emerald-500/20">
                <span className="block text-[10px] text-slate-400">GPT-4o mini</span>
                <span className="font-bold text-emerald-400 text-xs">~$0.0001/chat</span>
              </div>
              <div className="rounded-lg bg-emerald-950/30 p-2.5 border border-emerald-500/20">
                <span className="block text-[10px] text-slate-400">Platform Markup</span>
                <span className="font-bold text-cyan-400 text-xs">0% ($0.00)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
