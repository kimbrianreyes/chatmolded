"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, Terminal, ChevronRight, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar({ onOpenDemo }: { onOpenDemo?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#06080d]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#07090e]">
              <MessageSquare className="h-4 w-4 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-white">
              Chat<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Molded</span>
            </span>
            <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
              .app
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#audience"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Use Cases
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#byok"
            className="flex items-center gap-1 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-300"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            BYOK Mode
          </a>
          <a
            href="#embed"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Embed
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3.5 py-2 text-xs font-medium text-slate-200 transition-all hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white"
          >
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            Test Widget
          </button>
          <a
            href="#demo-builder"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 p-px font-medium text-white shadow-md shadow-indigo-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            <span className="flex items-center gap-1.5 rounded-[7px] bg-[#080b12] px-3.5 py-1.5 text-xs font-semibold text-white transition-all group-hover:bg-opacity-0">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Build Free Bot
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-[#090d16] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a
              href="#audience"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-slate-300"
            >
              Use Cases (Devs & Small Business)
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-slate-300"
            >
              How It Works
            </a>
            <a
              href="#byok"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-cyan-400"
            >
              BYOK ($0 Cost Explained)
            </a>
            <a
              href="#embed"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-slate-300"
            >
              1-Line Embed
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-slate-300"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-slate-300"
            >
              FAQ
            </a>
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenDemo) onOpenDemo();
                }}
                className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-center text-xs font-semibold text-white"
              >
                Test Floating Bubble
              </button>
              <a
                href="#demo-builder"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-center text-xs font-semibold text-white"
              >
                Build Your Bot Free
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
