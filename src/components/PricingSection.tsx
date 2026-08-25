"use client";

import React from "react";
import { Check, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#05070c]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            <Zap className="h-3.5 w-3.5" />
            <span>Honest &amp; Transparent Plans</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Start 100% Free with Your Own API Key
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            No credit card required. Mold your bot, feed your documents, and embed on your site at $0 platform cost.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl mx-auto items-stretch">
          {/* Free BYOK Tier */}
          <div className="rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-b from-[#0e1424] to-[#090d18] p-8 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-8 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-3.5 py-1 text-[11px] font-bold text-white shadow-md">
              CURRENT PHASE &bull; 100% FREE
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">BYOK Free Tier</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Perfect for developers, portfolios &amp; indie founders
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400"> / forever</span>
                </div>
              </div>

              <div className="mt-6 space-y-3.5 text-xs text-slate-200">
                {[
                  "1 Active Custom Chatbot",
                  "Bring Your Own API Key (OpenAI, Groq, Anthropic)",
                  "Unlimited User Interactions (No monthly chat caps)",
                  "Text, Markdown, PDF & DOCX document ingestion",
                  "Safe Upload Rate-Limiting Protection",
                  "Customizable Floating Bubble Widget (Colors, Avatar, Greeting)",
                  "Sandboxed Iframe with Domain Whitelisting",
                  "Standard Community Support",
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <a
                href="#demo-builder"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.01]"
              >
                <span>Mold Your First Bot Free</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Pro / Managed Tier (Coming Soon) */}
          <div className="rounded-2xl border border-slate-800 bg-[#090d16]/70 p-8 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-300">Managed Pro</h3>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                      Phase 2
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    For growing businesses needing hosted model pools
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-300">$19</span>
                  <span className="text-xs text-slate-400"> / mo</span>
                </div>
              </div>

              <div className="mt-6 space-y-3.5 text-xs text-slate-400">
                {[
                  "Unlimited Custom Chatbots",
                  "Platform Managed LLM Pool (No API keys needed)",
                  "Automatic Website URL Scraping & Syncing",
                  "Advanced Chat Analytics & Lead Capture CRM",
                  "Remove Powered by ChatMolded Badge",
                  "Multi-member Team Collaboration",
                  "Priority Document Processing & Vector Scaling",
                  "Dedicated Support & Custom Domain Integrations",
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <button
                disabled
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs font-semibold text-slate-500 cursor-not-allowed text-center"
              >
                Available in Phase 2
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
