"use client";

import React, { useState } from "react";
import { Sparkles, FileText, Cpu, Check, Play, Sliders, Lock, ArrowRight, ShieldCheck, Database } from "lucide-react";
import { BotTheme } from "./FloatingChatbotWidget";

interface DemoBotBuilderProps {
  onTestInWidget: (customBot: { name: string; welcome: string; knowledge: string; theme: BotTheme }) => void;
}

const PRESET_TEMPLATES = [
  {
    id: "dev-resume",
    label: "Developer Portfolio Resume",
    icon: "📄",
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
    label: "SaaS Product & Support FAQ",
    icon: "🏢",
    name: "NovaCloud Support Bot",
    welcome: "Hello! I am your 24/7 assistant. How can I help you with our plans and features?",
    knowledge: `Product: NovaCloud Storage
Pricing: Free Tier ($0/mo for 5GB), Pro Tier ($15/mo for 1TB)
Features: End-to-end encryption, automated backups, 99.9% uptime SLA
Support: support@novacloud.io, live chat 24/7
Refund Policy: 14-day money-back guarantee with zero questions asked`,
  },
  {
    id: "freelance-agency",
    label: "Freelancer / Agency Intake",
    icon: "💼",
    name: "DesignCraft Bot",
    welcome: "Welcome! Interested in working together? Let's discuss your timeline, budget, or design needs.",
    knowledge: `Agency: DesignCraft Studio
Services: UI/UX Design, Web Development (Next.js/React), Brand Identity
Starting Rates: Projects start from $1,500
Turnaround Time: 2-4 weeks per project
Booking: Free 30-min strategy call at cal.com/designcraft`,
  },
];

export default function DemoBotBuilder({ onTestInWidget }: DemoBotBuilderProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState("dev-resume");
  const [botName, setBotName] = useState(PRESET_TEMPLATES[0].name);
  const [botWelcome, setBotWelcome] = useState(PRESET_TEMPLATES[0].welcome);
  const [botKnowledge, setBotKnowledge] = useState(PRESET_TEMPLATES[0].knowledge);
  const [botTheme, setBotTheme] = useState<BotTheme>("indigo");
  const [selectedProvider, setSelectedProvider] = useState("groq");
  const [isSimulatingIndex, setIsSimulatingIndex] = useState(false);
  const [indexedChunksCount, setIndexedChunksCount] = useState<number | null>(null);

  const handleSelectTemplate = (tpl: typeof PRESET_TEMPLATES[0]) => {
    setSelectedTemplateId(tpl.id);
    setBotName(tpl.name);
    setBotWelcome(tpl.welcome);
    setBotKnowledge(tpl.knowledge);
    setIndexedChunksCount(null);
  };

  const handleIndexAndTest = () => {
    setIsSimulatingIndex(true);
    setTimeout(() => {
      setIsSimulatingIndex(false);
      const lines = botKnowledge.split("\n").filter((l) => l.trim().length > 0);
      setIndexedChunksCount(Math.max(3, Math.ceil(lines.length / 2)));

      onTestInWidget({
        name: botName,
        welcome: botWelcome,
        knowledge: botKnowledge,
        theme: botTheme,
      });
    }, 600);
  };

  return (
    <section id="demo-builder" className="relative py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-800/80 bg-[#080c16]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            <Sliders className="h-3.5 w-3.5" />
            <span>Interactive Bot Studio Sandbox</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Mold & Test Your Bot in Real-Time
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Try feeding knowledge, picking your theme, and hitting <strong>&ldquo;Test in Floating Widget&rdquo;</strong> to test the live chat bubble immediately.
          </p>
        </div>

        {/* Builder Workspace Card */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-[#0b0f1a] shadow-2xl p-4 sm:p-8">
          {/* Top Tabs: Preset Knowledge Templates */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Knowledge Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedTemplateId === tpl.id
                      ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-200 shadow-sm"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span>{tpl.icon}</span>
                  <span>{tpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Builder Form Grid */}
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Col: Bot Personality & Knowledge Ingestion (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Bot Name & Welcome Greeting */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Bot Display Name
                  </label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Floating Bubble Theme
                  </label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 p-1.5">
                    {(["indigo", "cyan", "emerald", "purple"] as BotTheme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setBotTheme(t)}
                        className={`flex-1 rounded-lg py-1 text-[11px] font-semibold capitalize transition-all ${
                          botTheme === t
                            ? "bg-slate-800 text-white shadow-sm ring-1 ring-white/20"
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
                  Welcome Greeting Message
                </label>
                <input
                  type="text"
                  value={botWelcome}
                  onChange={(e) => setBotWelcome(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Ingest Knowledge Text */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                    <FileText className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Molded Knowledge (Text, PDF Content, Resume)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {botKnowledge.length} chars &bull; Rate-Limited Safe Ingestion
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={botKnowledge}
                  onChange={(e) => setBotKnowledge(e.target.value)}
                  placeholder="Paste your resume, portfolio overview, FAQ, or documentation here..."
                  className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-900/90 p-3.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Right Col: BYOK Model Engine & Ingest Action (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-800 bg-[#070a12] p-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      BYOK Engine Provider
                    </h4>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                    $0 Server Cost
                  </span>
                </div>

                {/* Provider Selector */}
                <div className="mt-4 space-y-2">
                  <label
                    onClick={() => setSelectedProvider("groq")}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                      selectedProvider === "groq"
                        ? "border-cyan-500/60 bg-cyan-500/10 text-white"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-[11px] font-bold text-orange-400">
                        ⚡
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Groq Llama 3.3 (Recommended)</div>
                        <div className="text-[10px] text-slate-400">Ultra-fast inference &bull; Generous free tier</div>
                      </div>
                    </div>
                    {selectedProvider === "groq" && <Check className="h-4 w-4 text-cyan-400" />}
                  </label>

                  <label
                    onClick={() => setSelectedProvider("openai")}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                      selectedProvider === "openai"
                        ? "border-indigo-500/60 bg-indigo-500/10 text-white"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-[11px] font-bold text-emerald-400">
                        🤖
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">OpenAI GPT-4o-mini</div>
                        <div className="text-[10px] text-slate-400">Fraction of a cent per 1,000 chats</div>
                      </div>
                    </div>
                    {selectedProvider === "openai" && <Check className="h-4 w-4 text-indigo-400" />}
                  </label>

                  <label
                    onClick={() => setSelectedProvider("claude")}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                      selectedProvider === "claude"
                        ? "border-purple-500/60 bg-purple-500/10 text-white"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-[11px] font-bold text-purple-400">
                        🔮
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Claude 3.5 Haiku</div>
                        <div className="text-[10px] text-slate-400">Superior reasoning & strict tone control</div>
                      </div>
                    </div>
                    {selectedProvider === "claude" && <Check className="h-4 w-4 text-purple-400" />}
                  </label>
                </div>

                {/* Live Ingestion Stats */}
                <div className="mt-4 rounded-lg bg-slate-900/80 p-3 border border-slate-800/80 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Database className="h-3 w-3 text-cyan-400" /> Vector Chunks:
                    </span>
                    <span className="font-semibold text-white">
                      {indexedChunksCount ? `${indexedChunksCount} indexed` : "Ready to index"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-emerald-400" /> Key Security:
                    </span>
                    <span className="text-emerald-400 font-medium">Direct Browser/Edge Call</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={handleIndexAndTest}
                  disabled={isSimulatingIndex}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-98 disabled:opacity-50"
                >
                  {isSimulatingIndex ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Chunking & Molding Knowledge...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Mold Bot & Test in Floating Widget</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <p className="mt-2 text-center text-[10px] text-slate-500">
                  Loads this knowledge directly into the bottom-right floating bubble!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
