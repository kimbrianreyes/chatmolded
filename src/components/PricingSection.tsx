"use client";

import React from "react";
import { CheckCircle, Sparkle, ArrowRight } from "@phosphor-icons/react";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#05070c] border-t border-white/[0.07]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Transparent $0 BYOK Pricing
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
              No credit card required. Mold your bot on your documents and embed on your site at $0 platform fee.
            </p>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold">
            Phase 1 Live &bull; Free Forever
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 max-w-4xl">
          {/* BYOK Tier */}
          <div className="rounded-xl border border-emerald-500/40 bg-[#0a1215] p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">BYOK Free Tier</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    For developers, portfolios &amp; indie founders
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white font-mono">$0</span>
                  <span className="text-xs text-slate-400 font-mono"> / forever</span>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs text-slate-200">
                {[
                  "1 Active Custom Chatbot",
                  "Bring Your Own Key (Groq, OpenAI, Anthropic)",
                  "Unlimited User Conversations (No message caps)",
                  "PDF, DOCX & Plain Text Document Ingestion",
                  "Upload Rate Limiting Security",
                  "Customizable Floating Bubble & Themes",
                  "Sandboxed Iframe with Domain Whitelisting",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <CheckCircle weight="fill" className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-white/[0.08]">
              <a
                href="#studio"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400"
              >
                <span>Mold Your First Bot Free</span>
                <ArrowRight weight="bold" className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Pro Tier (Coming in Phase 2) */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c101a] p-7 flex flex-col justify-between opacity-75 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-300">Managed Pro</h3>
                    <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                      Phase 2
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    For growing businesses needing hosted model pools
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-300 font-mono">$19</span>
                  <span className="text-xs text-slate-400 font-mono"> / mo</span>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs text-slate-400">
                {[
                  "Unlimited Custom Chatbots",
                  "Platform-Managed LLM Pool (No API keys needed)",
                  "Automatic Website URL Crawling & Syncing",
                  "Analytics & Lead Capture Inbox",
                  "Remove Powered-By Badge",
                  "Team Member Access",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <CheckCircle weight="fill" className="h-4 w-4 shrink-0 text-slate-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-white/[0.06]">
              <button
                disabled
                className="w-full rounded-lg border border-white/10 bg-white/[0.02] py-3 text-xs font-semibold text-slate-500 cursor-not-allowed font-mono"
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
