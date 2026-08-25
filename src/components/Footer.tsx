"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Heart, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#05070c] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#07090e]">
                  <MessageSquare className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Chat<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Molded</span>
                <span className="ml-1 text-xs text-indigo-300 font-mono">.app</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Mold custom AI chatbots for developer portfolios and small business websites. 100% free with Bring Your Own API Key (BYOK) mode.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Zero server-side API key retention &bull; Sandboxed runtime</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Product &amp; Stack
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a href="#audience" className="hover:text-white transition-colors">
                  Portfolio Chatbots
                </a>
              </li>
              <li>
                <a href="#audience" className="hover:text-white transition-colors">
                  SaaS Support Bots
                </a>
              </li>
              <li>
                <a href="#byok" className="hover:text-white transition-colors">
                  BYOK Zero-Cost Model
                </a>
              </li>
              <li>
                <a href="#embed" className="hover:text-white transition-colors">
                  1-Line Embed Script
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Development Roadmap
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Phase 1: Environment &amp; Landing UI (Active)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                <span>Phase 2: Auth &amp; Dashboard Bot Studio</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                <span>Phase 3: Document RAG &amp; Vector Pipeline</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                <span>Phase 4: Widget Script &amp; Edge Delivery</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ChatMolded.app &bull; Built for indie devs &amp; founders.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>for solo builders</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
