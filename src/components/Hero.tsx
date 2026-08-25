"use client";

import React from "react";
import { Sparkle, ArrowRight, ShieldCheck, TerminalWindow, FileText, CheckCircle, Cpu, Code } from "@phosphor-icons/react";
import { BotTheme } from "./FloatingChatbotWidget";

interface HeroProps {
  onOpenWidget: () => void;
  selectedTheme: BotTheme;
  setSelectedTheme: (theme: BotTheme) => void;
}

export default function Hero({ onOpenWidget, selectedTheme, setSelectedTheme }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 bg-grid-pattern">
      {/* Subtle architectural ambient light */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="h-[300px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left-Right Split Hero for High-Density Engineering Precision */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Value Prop & CTAs (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Eyebrow (Strict 1-per-3-sections rule) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-medium text-emerald-400">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>BYOK ARCHITECTURE &bull; 100% FREE HOSTING</span>
            </div>

            {/* 2. Headline (Max 2 lines desktop) */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[52px] leading-[1.08]">
              Mold Custom AI Chatbots. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Embed Anywhere in 60s.
              </span>
            </h1>

            {/* 3. Subtext (Strictly under 20 words) */}
            <p className="text-base text-slate-300 leading-relaxed max-w-[50ch]">
              Feed your PDF, DOCX, and text docs. Connect your API key for $0 hosting, and embed an isolated floating bubble.
            </p>

            {/* 4. Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <a
                href="#studio"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-98"
              >
                <Sparkle weight="fill" className="h-4 w-4" />
                <span>Mold Your First Bot Free</span>
                <ArrowRight weight="bold" className="h-3.5 w-3.5" />
              </a>

              <button
                onClick={onOpenWidget}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-slate-200 transition-all hover:border-emerald-500/40 hover:bg-white/[0.08] hover:text-white"
              >
                <TerminalWindow weight="bold" className="h-4 w-4 text-emerald-400" />
                <span>Test Live Bubble</span>
              </button>
            </div>

            {/* Micro Trust Strip */}
            <div className="pt-3 border-t border-white/[0.07] flex flex-wrap gap-4 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
                Zero Subscription Markups
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
                Sandboxed Iframe Runtime
              </span>
            </div>
          </div>

          {/* Right Column: Tactile Live Interactive Workbench (6 cols) */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/10 bg-[#0c101a] p-5 shadow-2xl backdrop-blur-xl relative">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 ml-2">
                    chatmolded-runtime // embed.tsx
                  </span>
                </div>

                {/* Theme Selector */}
                <div className="flex items-center gap-1.5">
                  {(["emerald", "cyan", "indigo", "purple"] as BotTheme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTheme(t)}
                      className={`h-3.5 w-3.5 rounded-full transition-all ${
                        t === "emerald"
                          ? "bg-emerald-400"
                          : t === "cyan"
                          ? "bg-cyan-400"
                          : t === "indigo"
                          ? "bg-indigo-400"
                          : "bg-purple-400"
                      } ${selectedTheme === t ? "ring-2 ring-white scale-110" : "opacity-50 hover:opacity-100"}`}
                      title={`Select ${t} theme`}
                    />
                  ))}
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="mt-4 rounded-xl bg-[#06080e] p-4 border border-white/[0.06] font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
                <p className="text-slate-500">// Drop on your portfolio, SaaS, or blog</p>
                <p>
                  <span className="text-emerald-400">&lt;script</span>
                </p>
                <p className="pl-4">
                  <span className="text-cyan-300">src</span>=
                  <span className="text-amber-200">&quot;https://chatmolded.app/widget.js&quot;</span>
                </p>
                <p className="pl-4">
                  <span className="text-cyan-300">data-bot-id</span>=
                  <span className="text-amber-200">&quot;cm_live_alex_portfolio&quot;</span>
                </p>
                <p className="pl-4">
                  <span className="text-cyan-300">data-theme</span>=
                  <span className="text-emerald-300">&quot;{selectedTheme}&quot;</span>
                </p>
                <p className="pl-4">
                  <span className="text-purple-300">defer</span>
                </p>
                <p>
                  <span className="text-emerald-400">&gt;&lt;/script&gt;</span>
                </p>
              </div>

              {/* Metrics bar */}
              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center font-mono">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span className="block text-[10px] text-slate-400">Bundle Size</span>
                  <span className="text-xs font-bold text-white">&lt; 3.8 KB</span>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span className="block text-[10px] text-slate-400">Isolation</span>
                  <span className="text-xs font-bold text-emerald-400">Iframe Sandboxed</span>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <span className="block text-[10px] text-slate-400">API Mode</span>
                  <span className="text-xs font-bold text-cyan-400">BYOK ($0/mo)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
