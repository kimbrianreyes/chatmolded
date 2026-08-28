"use client";

import React from "react";
import { Sparkle, ArrowRight, ShieldCheck, TerminalWindow, CheckCircle, Cpu, Lightning, Play } from "@phosphor-icons/react";
import { BotTheme } from "./FloatingChatbotWidget";

interface HeroProps {
  onOpenWidget: () => void;
  selectedTheme: BotTheme;
  setSelectedTheme: (theme: BotTheme) => void;
}

export default function Hero({ onOpenWidget, selectedTheme, setSelectedTheme }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-grid-pattern">
      {/* Architectural ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="h-[320px] w-[540px] rounded-full bg-emerald-500/[0.08] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Value Proposition & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-mono font-semibold text-emerald-400 shadow-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>POWERED BY OPENROUTER &bull; 100+ FREE &amp; PRO MODELS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[54px] leading-[1.06]">
              Mold Custom AI Chatbots. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Embed Anywhere with 1 Line.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-[54ch]">
              Feed your PDF, DOCX, and text docs. Connect <strong className="text-white font-semibold">OpenRouter</strong> for instant access to 100+ AI models (or Groq, xAI &amp; OpenAI), and embed a lightweight floating bubble with zero markup.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <a
                href="#studio"
                className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-xs font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-98"
              >
                <Sparkle weight="fill" className="h-4 w-4" />
                <span>Mold Your First Bot Free</span>
                <ArrowRight weight="bold" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>

              <button
                onClick={onOpenWidget}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-xs font-bold text-slate-200 transition-all hover:border-emerald-500/40 hover:bg-white/[0.08] hover:text-white"
              >
                <TerminalWindow weight="bold" className="h-4 w-4 text-emerald-400" />
                <span>Test Live Bubble</span>
              </button>
            </div>

            {/* Micro Feature Proof */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
                OpenRouter 1-Click Setup
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
                100% Free BYOK Hosting
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
                Zero CSS-Bleed Iframe
              </span>
            </div>
          </div>

          {/* Right Column: Tactile Double-Bezel Code & Architecture Showcase (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-1.5 rounded-[2rem] bg-white/[0.03] ring-1 ring-white/15 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-5 space-y-4 border border-white/[0.06]">
                {/* Header Strip */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 ml-2 font-medium">
                      chatmolded-runtime // embed.js
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
                        } ${selectedTheme === t ? "ring-2 ring-white scale-110" : "opacity-40 hover:opacity-100"}`}
                        title={`Select ${t} theme`}
                      />
                    ))}
                  </div>
                </div>

                {/* 1-Line Embed Code Snippet */}
                <div className="rounded-2xl bg-[#05070d] p-4 border border-white/[0.08] font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto shadow-inner">
                  <p className="text-slate-500">// Embed on your portfolio, Webflow, or SaaS</p>
                  <p>
                    <span className="text-emerald-400">&lt;script</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-cyan-300">src</span>=
                    <span className="text-amber-200">&quot;https://chatmolded.app/widget.js&quot;</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-cyan-300">data-bot-id</span>=
                    <span className="text-amber-200">&quot;cm_alex_portfolio&quot;</span>
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

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 shadow-sm">
                    <span className="block text-[9px] text-slate-400 uppercase">Provider</span>
                    <span className="text-xs font-bold text-emerald-400">OpenRouter</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 shadow-sm">
                    <span className="block text-[9px] text-slate-400 uppercase">Runtime</span>
                    <span className="text-xs font-bold text-white">&lt; 3 KB Script</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 shadow-sm">
                    <span className="block text-[9px] text-slate-400 uppercase">Cost</span>
                    <span className="text-xs font-bold text-cyan-400">$0 Free BYOK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
