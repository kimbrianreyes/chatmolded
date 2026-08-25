"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChatCircleDots, ShieldCheck, TerminalWindow, Sparkle, List, X, ArrowUpRight } from "@phosphor-icons/react";

export default function Navbar({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#06080d]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-emerald-400 shadow-sm transition-all duration-200 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10">
            <ChatCircleDots weight="bold" className="h-4 w-4 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-white">
              Chat<span className="text-emerald-400">Molded</span>
            </span>
            <span className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              .app
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#workspaces"
            className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
          >
            Capabilities
          </a>
          <a
            href="#pipeline"
            className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
          >
            RAG Pipeline
          </a>
          <a
            href="#byok"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-emerald-400"
          >
            <ShieldCheck weight="bold" className="h-3.5 w-3.5 text-emerald-400" />
            BYOK Architecture
          </a>
          <a
            href="#embed"
            className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
          >
            1-Line Embed
          </a>
          <a
            href="#pricing"
            className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
          >
            Pricing ($0)
          </a>
        </nav>

        {/* Action Controls */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-emerald-500/40 hover:bg-white/[0.06] hover:text-white"
          >
            <TerminalWindow weight="bold" className="h-3.5 w-3.5 text-emerald-400" />
            <span>Launch Live Bubble</span>
          </button>
          <a
            href="#studio"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition-all hover:bg-emerald-400 active:scale-95"
          >
            <Sparkle weight="fill" className="h-3.5 w-3.5" />
            <span>Mold Bot Free</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#090d16] px-4 py-5 md:hidden space-y-3">
          <a
            href="#workspaces"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-slate-300"
          >
            Capabilities (Devs &amp; Small Business)
          </a>
          <a
            href="#pipeline"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-slate-300"
          >
            RAG Ingestion Pipeline
          </a>
          <a
            href="#byok"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-emerald-400"
          >
            BYOK ($0 Cost Model)
          </a>
          <a
            href="#embed"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-slate-300"
          >
            1-Line Embed Code
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-slate-300"
          >
            Pricing
          </a>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenDemo) onOpenDemo();
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-white"
            >
              Test Floating Widget
            </button>
            <a
              href="#studio"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full rounded-lg bg-emerald-500 py-2 text-center text-xs font-bold text-slate-950"
            >
              Mold Bot Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
