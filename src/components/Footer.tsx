"use client";

import React from "react";
import Link from "next/link";
import { ChatCircleDots, ShieldCheck, Heart } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05070c] py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-emerald-400">
              <ChatCircleDots weight="bold" className="h-4 w-4" />
            </div>
            <span className="font-sans font-bold text-white tracking-tight">
              Chat<span className="text-emerald-400">Molded</span>.app
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-slate-400">
            <a href="#workspaces" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#pipeline" className="hover:text-white transition-colors">
              RAG Pipeline
            </a>
            <a href="#byok" className="hover:text-white transition-colors">
              BYOK Model
            </a>
            <a href="#embed" className="hover:text-white transition-colors">
              1-Line Embed
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="text-slate-500 text-[11px]">
            &copy; {new Date().getFullYear()} ChatMolded. Built for developers and solo founders.
          </div>
        </div>
      </div>
    </footer>
  );
}
