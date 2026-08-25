"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Terminal, Layers, FileCode, CheckCircle, Cpu } from "lucide-react";
import { BotTheme } from "./FloatingChatbotWidget";

interface HeroProps {
  onOpenWidget: () => void;
  selectedTheme: BotTheme;
  setSelectedTheme: (theme: BotTheme) => void;
}

export default function Hero({ onOpenWidget, selectedTheme, setSelectedTheme }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background glow meshes */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[450px] w-[600px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-10 right-1/4 h-[350px] w-[400px] rounded-full bg-cyan-500/12 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[350px] rounded-full bg-purple-600/10 blur-[90px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 shadow-sm backdrop-blur-md transition-all hover:border-indigo-500/50">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Phase 1 Live &bull; 100% Free with BYOK Mode</span>
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
              Zero Server Costs
            </span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="mx-auto mt-6 max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Mold Your Own AI Chatbot. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">
              Embed on Any Site in 60 Seconds.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg sm:leading-relaxed">
            Feed your custom knowledge documents (PDF, DOCX, Text, Markdown). Plug in your own API key (OpenAI, Groq, Anthropic) to run completely free. Embed an isolated, customizable floating bubble on your portfolio or website.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <a
              href="#demo-builder"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02] sm:w-auto"
            >
              <Sparkles className="h-4 w-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
              <span>Mold Your Bot for Free</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <button
              onClick={onOpenWidget}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 shadow-sm backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-slate-850 hover:text-white sm:w-auto"
            >
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>Launch Live Floating Widget</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Bring Your Own Key (BYOK)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-cyan-400" />
              <span>Sandboxed Iframe (Zero CSS leaks)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
              <span>Safe Rate-Limited Uploads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-purple-400" />
              <span>No Image Bloat (v1 Clean RAG)</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Code / Visual Showcase */}
        <div className="mt-14 mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-[#0b0f19]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400">
                chatmolded-runtime // embed-script.html
              </span>
            </div>

            {/* Quick theme selector demo */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Widget Accent Theme:</span>
              <div className="flex items-center gap-1.5">
                {(["indigo", "cyan", "emerald", "purple"] as BotTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTheme(t)}
                    className={`h-4 w-4 rounded-full transition-all ${
                      t === "indigo"
                        ? "bg-indigo-500"
                        : t === "cyan"
                        ? "bg-cyan-400"
                        : t === "emerald"
                        ? "bg-emerald-400"
                        : "bg-purple-400"
                    } ${selectedTheme === t ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"}`}
                    title={`Set hero theme to ${t}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Code Snippet */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-[#06080e] p-4 border border-slate-800/80 font-mono text-xs text-slate-300">
              <div className="space-y-2 overflow-x-auto">
                <p className="text-slate-500">// 1. Drop this into your website &lt;head&gt; or &lt;body&gt;</p>
                <p>
                  <span className="text-indigo-400">&lt;script</span>
                </p>
                <p className="pl-4">
                  <span className="text-cyan-400">src</span>=
                  <span className="text-emerald-300">&quot;https://chatmolded.app/widget.js&quot;</span>
                </p>
                <p className="pl-4">
                  <span className="text-cyan-400">data-bot-id</span>=
                  <span className="text-emerald-300">&quot;cm_live_79a24f01&quot;</span>
                </p>
                <p className="pl-4">
                  <span className="text-cyan-400">data-theme</span>=
                  <span className="text-amber-300">&quot;{selectedTheme}&quot;</span>
                </p>
                <p className="pl-4">
                  <span className="text-cyan-400">data-position</span>=
                  <span className="text-emerald-300">&quot;bottom-right&quot;</span>
                </p>
                <p className="pl-4">
                  <span className="text-purple-400">defer</span>
                </p>
                <p>
                  <span className="text-indigo-400">&gt;&lt;/script&gt;</span>
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Cpu className="h-3.5 w-3.5" /> Size: &lt; 4.2 KB (Zero bundle bloat)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Sandboxed Iframe
                </span>
              </div>
            </div>

            {/* Right: Feature Highlights Mini Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all hover:border-indigo-500/40">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                    <FileCode className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Custom Knowledge Feeding</h4>
                    <p className="text-[11px] text-slate-400">PDF, DOCX & plain markdown text ingestion.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all hover:border-cyan-500/40">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Zero-Cost BYOK Security</h4>
                    <p className="text-[11px] text-slate-400">Keys never stored on server; direct API calls.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all hover:border-emerald-500/40">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Floating Bubble Customizer</h4>
                    <p className="text-[11px] text-slate-400">Customize greeting, avatar, and color accents.</p>
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
