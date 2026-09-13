"use client";

import React, { useState, useRef } from "react";
import {
  Sparkle,
  Sliders,
  Check,
  Play,
  FileText,
  Cpu,
  Lock,
  ArrowRight,
  Database,
  UploadSimple,
  Image as ImageIcon,
  Trash,
  Lightning,
  ShieldCheck
} from "@phosphor-icons/react";
import { BotTheme } from "./FloatingChatbotWidget";

interface DemoBotBuilderProps {
  onTestInWidget: (customBot: {
    name: string;
    welcome: string;
    knowledge: string;
    theme: BotTheme;
    avatarImage?: string | null;
  }) => void;
}

const PRESET_TEMPLATES = [
  {
    id: "dev-resume",
    label: "Developer Portfolio",
    name: "Alex Dev Bot",
    welcome: "Hi! Ask me anything about my software engineering background, tech stack, or recent projects!",
    avatarPreset: "👨‍💻",
    knowledge: `Name: Alex Chen
Role: Full-Stack & AI Engineer
Skills: TypeScript, Next.js, Node.js, Python, PostgreSQL, OpenRouter, Supabase, Tailwind CSS
Experience: 4 years building responsive web apps, RAG vector pipelines, and microservices
Recent Projects:
1. ChatMolded - BYOK chatbot widget platform
2. CodeStream - Real-time developer collaboration tool
Availability: Open for Senior Developer roles (Remote / Full-time)`,
  },
  {
    id: "saas-support",
    label: "SaaS Customer Support",
    name: "NovaCloud Assistant",
    welcome: "Hello! How can I help you with our cloud storage plans, uptime SLA, or feature docs?",
    avatarPreset: "⚡",
    knowledge: `Product: NovaCloud Storage
Pricing: Free Tier ($0/mo for 5GB), Pro Tier ($15/mo for 1TB)
Features: End-to-end encryption, automated backups, 99.9% uptime SLA
Support: support@novacloud.io, live chat 24/7
Refund Policy: 14-day money-back guarantee with zero questions asked`,
  },
];

export default function DemoBotBuilder({ onTestInWidget }: DemoBotBuilderProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState("dev-resume");
  const [botName, setBotName] = useState(PRESET_TEMPLATES[0].name);
  const [botWelcome, setBotWelcome] = useState(PRESET_TEMPLATES[0].welcome);
  const [botKnowledge, setBotKnowledge] = useState(PRESET_TEMPLATES[0].knowledge);
  const [botTheme, setBotTheme] = useState<BotTheme>("emerald");
  const [customAvatarImage, setCustomAvatarImage] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState("openrouter");
  const [isSimulatingIndex, setIsSimulatingIndex] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectTemplate = (tpl: typeof PRESET_TEMPLATES[0]) => {
    setSelectedTemplateId(tpl.id);
    setBotName(tpl.name);
    setBotWelcome(tpl.welcome);
    setBotKnowledge(tpl.knowledge);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomAvatarImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIndexAndTest = () => {
    setIsSimulatingIndex(true);
    setTimeout(() => {
      setIsSimulatingIndex(false);
      onTestInWidget({
        name: botName,
        welcome: botWelcome,
        knowledge: botKnowledge,
        theme: botTheme,
        avatarImage: customAvatarImage,
      });
    }, 400);
  };

  return (
    <section id="studio" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#07090e] border-t border-white/[0.07]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-[10px] font-mono font-semibold text-emerald-400 mb-2">
              <Sparkle weight="fill" className="h-3 w-3" />
              <span>THE STUDIO WORKFLOW</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Live Bot Mold &amp; Brand Studio
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
              Ingest your resume or support context, select <strong className="text-emerald-400">OpenRouter</strong> as your zero-setup engine, customize styling, and test live in the floating bubble.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedTemplateId === tpl.id
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-sm"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Builder Container (Double-Bezel Architecture) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left: Input Form (7 cols) */}
          <div className="lg:col-span-7 p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-2xl">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6 space-y-5">
              
              {/* Logo Upload + Name Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 items-center">
                {/* Custom Logo Upload Slot (5 cols) */}
                <div className="sm:col-span-5">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Bot Logo / Headshot
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    className="hidden"
                  />

                  {customAvatarImage ? (
                    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2">
                      <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/20 bg-black/40 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={customAvatarImage}
                          alt="Custom Bot Logo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-mono text-emerald-300 block truncate font-semibold">
                          Custom Logo
                        </span>
                        <button
                          onClick={() => setCustomAvatarImage(null)}
                          className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <Trash className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-[#05070d] p-2.5 text-xs text-slate-300 hover:border-emerald-500/50 hover:bg-white/[0.04] transition-all"
                    >
                      <UploadSimple weight="bold" className="h-4 w-4 text-emerald-400" />
                      <span>Upload Avatar</span>
                    </button>
                  )}
                </div>

                {/* Bot Name (7 cols) */}
                <div className="sm:col-span-7">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Chatbot Display Name
                  </label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Accent Theme Picker */}
              <div className="border-t border-white/[0.06] pt-4">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Floating Bubble Theme Accent
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["emerald", "cyan", "indigo", "purple"] as BotTheme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setBotTheme(t)}
                      className={`rounded-xl border py-2 text-xs font-semibold capitalize transition-all ${
                        botTheme === t
                          ? "border-white/30 bg-white/[0.08] text-white font-bold ring-1 ring-white/20 shadow-md"
                          : "border-white/10 bg-[#05070d] text-slate-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Welcome Greeting Message
                </label>
                <input
                  type="text"
                  value={botWelcome}
                  onChange={(e) => setBotWelcome(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Ingested Custom Knowledge Context
                  </label>
                  <span className="font-mono text-[10px] text-emerald-400">
                    {botKnowledge.length} chars indexed
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={botKnowledge}
                  onChange={(e) => setBotKnowledge(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#05070d] p-3 font-mono text-xs text-slate-200 focus:border-white/30 focus:outline-none leading-relaxed transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right: OpenRouter Priority Engine & Launch (5 cols) */}
          <div className="lg:col-span-5 p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-2xl flex flex-col justify-between">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6 flex flex-col justify-between h-full space-y-5">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="font-mono text-xs text-white font-bold flex items-center gap-1.5">
                    <Lightning weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
                    BYOK AI ENGINE
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                    100% Free
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {[
                    {
                      id: "openrouter",
                      name: "OpenRouter",
                      desc: "1 key for 100+ AI models &bull; Free tiers (Laguna, Llama 3.3)",
                      isFree: true,
                      badge: "100% Free Tier",
                    },
                    {
                      id: "gemini",
                      name: "Google Gemini",
                      desc: "Gemini 1.5 Flash &bull; Free 15 req/min tier",
                      isFree: true,
                      badge: "100% Free Tier",
                    },
                    {
                      id: "groq",
                      name: "Groq LLaMA 3.1",
                      desc: "Ultra-fast ~700 tokens/sec &bull; Free tier",
                      isFree: true,
                      badge: "Free Tier",
                    },
                    {
                      id: "openai",
                      name: "OpenAI GPT-4o-mini",
                      desc: "Direct OpenAI API &bull; ~$0.0001 per response",
                      isFree: false,
                      badge: "Pay-As-You-Go",
                    },
                    {
                      id: "xai",
                      name: "xAI Grok (console.x.ai)",
                      desc: "Direct access to grok-beta &bull; Elon Musk's xAI",
                      isFree: false,
                      badge: "Prepaid Credits",
                    },
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      onClick={() => setSelectedProvider(prov.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition-all ${
                        selectedProvider === prov.id
                          ? "border-emerald-500/50 bg-emerald-500/10 text-white shadow-md ring-1 ring-emerald-500/30"
                          : "border-white/10 bg-[#05070d] text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{prov.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[8.5px] font-mono font-bold tracking-wider ${
                              prov.isFree
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                            }`}
                          >
                            {prov.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">{prov.desc}</div>
                      </div>
                      {selectedProvider === prov.id && (
                        <Check weight="bold" className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Status indicator */}
                <div className="mt-4 rounded-xl bg-[#05070d] p-3 border border-white/[0.06] font-mono text-[10px] space-y-1.5 text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Avatar Status:</span>
                    <span className={customAvatarImage ? "text-emerald-400 font-bold" : "text-slate-500"}>
                      {customAvatarImage ? "Custom Upload Active" : "Default Monogram"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Theme:</span>
                    <span className="capitalize text-white font-bold">{botTheme}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08]">
                <button
                  onClick={handleIndexAndTest}
                  disabled={isSimulatingIndex}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
                >
                  {isSimulatingIndex ? (
                    <span>Molding Vector Knowledge...</span>
                  ) : (
                    <>
                      <Play weight="fill" className="h-3.5 w-3.5" />
                      <span>Mold Bot &amp; Test Live in Bubble</span>
                      <ArrowRight weight="bold" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
