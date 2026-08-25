"use client";

import React from "react";
import { Sparkles, ArrowRight, Terminal } from "lucide-react";

export default function CTASection({ onOpenWidget }: { onOpenWidget: () => void }) {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#05070c]">
      <div className="mx-auto max-w-5xl rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-[#0e162c] to-[#070b16] p-8 sm:p-14 text-center shadow-2xl relative">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ready to Mold Your Bot?</span>
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl text-white">
            Give Your Website a Voice in Under 2 Minutes.
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Join developers and founders embedding smart, BYOK-powered chatbots on their portfolios and storefronts with zero subscription lock-in.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#demo-builder"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>Build Your Free Bot</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              onClick={onOpenWidget}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-xs font-bold text-slate-200 hover:border-cyan-500 hover:text-white transition-all"
            >
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>Test Widget Simulator</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
