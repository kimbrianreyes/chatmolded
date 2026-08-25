"use client";

import React, { useState } from "react";
import { Sparkle, Sliders, Check, Play, FileText, Cpu, Lock, ArrowRight, Database } from "@phosphor-icons/react";
import { BotTheme } from "./FloatingChatbotWidget";

interface DemoBotBuilderProps {
  onTestInWidget: (customBot: { name: string; welcome: string; knowledge: string; theme: BotTheme }) => void;
}

const PRESET_TEMPLATES = [
  {
    id: "dev-resume",
    label: "Developer Portfolio",
    name: "Alex Dev Bot",
    welcome: "Hi! Ask me anything about my software engineering experience, tech stack, or projects!",
    knowledge: `Name: Alex Chen
Role: Full-Stack & AI Engineer
Skills: TypeScript, Next.js, Node.js, Python, PostgreSQL, LangChain, TailwindCSS
Experience: 4 years building web apps, RAG pipelines, and microservices
Recent Projects:
1. ChatMolded - BYOK chatbot widget platform
2. CodeStream - Real-time developer collaboration tool
Availability: Open for Senior Developer roles (Remote)`,
  },
  {
    id: "saas-support",
    label: "SaaS Customer FAQ",
    name: "NovaCloud Support",
    welcome: "Hello! How can I help you with our pricing plans, uptime, or feature docs?",
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
  const [selectedProvider, setSelectedProvider] = useState("groq");
  const [isSimulatingIndex, setIsSimulatingIndex] = useState(false);

  const handleSelectTemplate = (tpl: typeof PRESET_TEMPLATES[0]) => {
    setSelectedTemplateId(tpl.id);
    setBotName(tpl.name);
    setBotWelcome(tpl.welcome);
    setBotKnowledge(tpl.knowledge);
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
      });
    }, 500);
  };

  return (
    <section id="studio" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#07090e] border-t border-white/[0.07]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Live Bot Mold Studio
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
              Input your custom text or select a preset, configure your model engine, and launch immediately into the floating bubble.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedTemplateId === tpl.id
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Builder Container */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Input Form (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Accent Theme
                </label>
                <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/10 bg-[#090d16] p-1.5">
                  {(["emerald", "cyan", "indigo", "purple"] as BotTheme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setBotTheme(t)}
                      className={`flex-1 rounded py-1 text-[11px] font-semibold capitalize transition-all ${
                        botTheme === t
                          ? "bg-white/10 text-white font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Welcome Greeting
              </label>
              <input
                type="text"
                value={botWelcome}
                onChange={(e) => setBotWelcome(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#090d16] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Custom Knowledge (Resume, FAQ, or Docs)
                </label>
                <span className="font-mono text-[10px] text-slate-400">
                  {botKnowledge.length} characters
                </span>
              </div>
              <textarea
                rows={6}
                value={botKnowledge}
                onChange={(e) => setBotKnowledge(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#090d16] p-3.5 font-mono text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Engine Model & Launch (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-white/10 bg-[#0c101a] p-5">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="font-mono text-xs text-white font-semibold">
                  BYOK INFERENCE ENGINE
                </span>
                <span className="font-mono text-[10px] text-emerald-400">
                  $0 Server Cost
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  { id: "groq", name: "Groq LLaMA 3.3 70B", desc: "Ultra-fast streaming &bull; Free tier ($0)", badge: "Free" },
                  { id: "openai", name: "OpenAI GPT-4o mini", desc: "$0.15 per 1M tokens", badge: "Pennies" },
                  { id: "claude", name: "Claude 3.5 Haiku", desc: "High reasoning precision", badge: "Direct" },
                ].map((prov) => (
                  <button
                    key={prov.id}
                    onClick={() => setSelectedProvider(prov.id)}
                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
                      selectedProvider === prov.id
                        ? "border-emerald-500 bg-emerald-500/10 text-white"
                        : "border-white/10 bg-[#090d16] text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{prov.name}</div>
                      <div className="text-[10px] text-slate-400">{prov.desc}</div>
                    </div>
                    {selectedProvider === prov.id && (
                      <Check weight="bold" className="h-4 w-4 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <button
                onClick={handleIndexAndTest}
                disabled={isSimulatingIndex}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-md transition-all hover:bg-emerald-400 active:scale-98 disabled:opacity-50"
              >
                {isSimulatingIndex ? (
                  <span>Molding into Vectors...</span>
                ) : (
                  <>
                    <Play weight="fill" className="h-3.5 w-3.5" />
                    <span>Mold Bot &amp; Test in Live Bubble</span>
                    <ArrowRight weight="bold" className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
