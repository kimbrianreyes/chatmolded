"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw, FileText, CheckCircle2, Shield } from "lucide-react";

export type BotTheme = "indigo" | "cyan" | "emerald" | "purple";

export interface BotPersona {
  id: string;
  name: string;
  subtitle: string;
  avatarIcon: string;
  welcomeMsg: string;
  sampleQuestions: string[];
  knowledgeContext: string;
  responses: Record<string, string>;
}

export const PERSONAS: Record<string, BotPersona> = {
  portfolio: {
    id: "portfolio",
    name: "Alex Dev (Portfolio Bot)",
    subtitle: "Trained on Alex's Resume & GitHub (PDF/Text)",
    avatarIcon: "👨‍💻",
    welcomeMsg: "Hey there! 👋 I'm Alex's AI portfolio assistant. Ask me anything about his tech stack, past projects, or hiring availability!",
    sampleQuestions: [
      "What is Alex's core tech stack?",
      "Tell me about his recent SaaS project",
      "Is Alex open for full-time or contract work?",
    ],
    knowledgeContext: "Alex Rivers | Senior Fullstack Engineer | 5+ yrs exp | Next.js, TypeScript, Python, FastAPI, pgvector, AWS | Built ChatMolded & DevMetrics | Open for Remote roles.",
    responses: {
      "stack": "Alex specializes in **TypeScript, Next.js (App Router), React, Python (FastAPI), PostgreSQL + pgvector**, and cloud deployments on Vercel & AWS.",
      "project": "His latest project is **ChatMolded.app**, a lightweight BYOK platform letting creators feed documents into sandboxed AI widgets. He also built DevMetrics, an open-source analytics tool.",
      "hire": "Yes! Alex is currently open to **Senior Fullstack & AI Engineering roles (Remote)** or high-impact contract consulting. You can email him at `alex@example.com` or book an intro call!",
      "default": "I was molded using Alex's resume and portfolio documents. He has 5+ years of experience building modern web apps, scalable AI pipelines, and responsive interfaces with Next.js and Python.",
    },
  },
  business: {
    id: "business",
    name: "NovaCloud Support",
    subtitle: "Trained on FAQ, Pricing Docs & Guides",
    avatarIcon: "⚡",
    welcomeMsg: "Welcome to NovaCloud! 🚀 How can I help you today? Ask about pricing, features, or SLA guarantees.",
    sampleQuestions: [
      "What is included in the Free tier?",
      "Do you support custom domain whitelisting?",
      "How do I contact human support?",
    ],
    knowledgeContext: "NovaCloud Docs v2.4 | Free plan: up to 1 bot, BYOK mode | Pro plan: $19/mo with managed models | 99.9% uptime SLA | Email: support@novacloud.io",
    responses: {
      "free": "Our Free tier includes **1 active chatbot, unlimited conversations with BYOK**, text & PDF document parsing, and standard community support!",
      "whitelist": "Yes! You can configure exact domain whitelisting in your dashboard settings (e.g. `yourdomain.com`) to prevent unauthorized embed usage on other sites.",
      "support": "You can reach our human support team directly via email at `support@novacloud.io` or initiate a live callback in the Pro dashboard.",
      "default": "NovaCloud is an automated infrastructure platform. I have access to our entire product documentation and pricing guidelines to assist your team 24/7.",
    },
  },
};

export const THEME_CONFIGS: Record<
  BotTheme,
  {
    primary: string;
    bgGlow: string;
    bubbleBg: string;
    badgeBg: string;
    userMsgBg: string;
    border: string;
  }
> = {
  indigo: {
    primary: "from-indigo-500 to-violet-600",
    bgGlow: "rgba(99, 102, 241, 0.35)",
    bubbleBg: "bg-indigo-600 hover:bg-indigo-500",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    userMsgBg: "bg-indigo-600 text-white",
    border: "border-indigo-500/30",
  },
  cyan: {
    primary: "from-cyan-500 to-blue-600",
    bgGlow: "rgba(6, 182, 212, 0.35)",
    bubbleBg: "bg-cyan-600 hover:bg-cyan-500",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    userMsgBg: "bg-cyan-600 text-white",
    border: "border-cyan-500/30",
  },
  emerald: {
    primary: "from-emerald-500 to-teal-600",
    bgGlow: "rgba(16, 185, 129, 0.35)",
    bubbleBg: "bg-emerald-600 hover:bg-emerald-500",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    userMsgBg: "bg-emerald-600 text-white",
    border: "border-emerald-500/30",
  },
  purple: {
    primary: "from-fuchsia-500 to-purple-600",
    bgGlow: "rgba(217, 70, 239, 0.35)",
    bubbleBg: "bg-purple-600 hover:bg-purple-500",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    userMsgBg: "bg-purple-600 text-white",
    border: "border-purple-500/30",
  },
};

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  timestamp: string;
}

interface FloatingChatbotWidgetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activePersonaKey: string;
  setActivePersonaKey: (key: string) => void;
  theme: BotTheme;
  setTheme: (theme: BotTheme) => void;
}

export default function FloatingChatbotWidget({
  isOpen,
  setIsOpen,
  activePersonaKey,
  setActivePersonaKey,
  theme,
  setTheme,
}: FloatingChatbotWidgetProps) {
  const persona = PERSONAS[activePersonaKey] || PERSONAS.portfolio;
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.indigo;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: persona.welcomeMsg,
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reinitialize welcome message on persona change
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${persona.id}-${Date.now()}`,
        role: "bot",
        text: persona.welcomeMsg,
        timestamp: "Just now",
      },
    ]);
  }, [persona]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate RAG vector match and streaming response
    setTimeout(() => {
      let botResponse = persona.responses.default;
      const lower = query.toLowerCase();

      if (persona.id === "portfolio") {
        if (lower.includes("stack") || lower.includes("skill") || lower.includes("tech") || lower.includes("language")) {
          botResponse = persona.responses.stack;
        } else if (lower.includes("project") || lower.includes("work") || lower.includes("built") || lower.includes("chatmolded")) {
          botResponse = persona.responses.project;
        } else if (lower.includes("hire") || lower.includes("available") || lower.includes("contact") || lower.includes("job") || lower.includes("contract")) {
          botResponse = persona.responses.hire;
        }
      } else {
        if (lower.includes("free") || lower.includes("cost") || lower.includes("price") || lower.includes("plan")) {
          botResponse = persona.responses.free;
        } else if (lower.includes("whitelist") || lower.includes("domain") || lower.includes("security") || lower.includes("iframe")) {
          botResponse = persona.responses.whitelist;
        } else if (lower.includes("support") || lower.includes("human") || lower.includes("contact") || lower.includes("help")) {
          botResponse = persona.responses.support;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 650);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${persona.id}-${Date.now()}`,
        role: "bot",
        text: persona.welcomeMsg,
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Chatbot Modal / Popover */}
      {isOpen && (
        <div
          className="mb-3 flex h-[540px] w-[92vw] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-slate-700/70 bg-[#0c111d]/95 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in zoom-in-95 sm:w-[390px]"
          style={{
            boxShadow: `0 20px 45px -10px ${themeConfig.bgGlow}, 0 0 1px 1px rgba(255, 255, 255, 0.1)`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-gradient-to-r from-slate-900/90 to-slate-950/90 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-xl border border-slate-700/60 shadow-inner">
                <span>{persona.avatarIcon}</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0c111d]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white text-sm tracking-tight leading-none">
                    {persona.name}
                  </span>
                </div>
                <span className="mt-1 text-[11px] text-slate-400 truncate max-w-[200px]">
                  {persona.subtitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Persona & Theme Switcher Bar inside Widget */}
          <div className="flex items-center justify-between border-b border-slate-800/50 bg-[#080c15] px-3.5 py-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Persona:</span>
              <button
                onClick={() => setActivePersonaKey("portfolio")}
                className={`rounded px-1.5 py-0.5 font-medium transition-all ${
                  activePersonaKey === "portfolio"
                    ? "bg-slate-800 text-cyan-300 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Portfolio
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setActivePersonaKey("business")}
                className={`rounded px-1.5 py-0.5 font-medium transition-all ${
                  activePersonaKey === "business"
                    ? "bg-slate-800 text-indigo-300 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Business
              </button>
            </div>

            {/* Quick theme dots */}
            <div className="flex items-center gap-1">
              {(["indigo", "cyan", "emerald", "purple"] as BotTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`h-3 w-3 rounded-full transition-transform ${
                    t === "indigo"
                      ? "bg-indigo-500"
                      : t === "cyan"
                      ? "bg-cyan-400"
                      : t === "emerald"
                      ? "bg-emerald-400"
                      : "bg-fuchsia-400"
                  } ${theme === t ? "scale-125 ring-2 ring-white" : "opacity-60 hover:opacity-100"}`}
                  title={`Switch to ${t} theme`}
                />
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {/* BYOK Security Badge */}
            <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
              <Shield className="h-3 w-3" />
              <span>BYOK Sandboxed Mode &bull; Zero Server Retain</span>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "bot" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-xs">
                    {persona.avatarIcon}
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? `${themeConfig.userMsgBg} rounded-br-none`
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span className="mt-1 block text-[9px] opacity-60 text-right">
                    {m.timestamp}
                  </span>
                </div>

                {m.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-slate-300 text-xs">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-xs">
                  {persona.avatarIcon}
                </div>
                <div className="flex items-center gap-1 rounded-2xl border border-slate-700/60 bg-slate-800/80 px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            {/* Quick suggested chips */}
            {messages.length <= 2 && (
              <div className="pt-2">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Suggested Questions:
                </p>
                <div className="flex flex-col gap-1.5">
                  {persona.sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-left rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-[11px] text-slate-300 hover:border-slate-500 hover:bg-slate-800 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="border-t border-slate-800/80 bg-[#090d17] p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask ${persona.name}...`}
                className="flex-1 rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r ${themeConfig.primary} text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-transform active:scale-95`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span>Powered by <strong>ChatMolded.app</strong></span>
              <span className="flex items-center gap-1 text-emerald-400/80">
                <CheckCircle2 className="h-2.5 w-2.5" /> BYOK Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Launcher Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open ChatMolded interactive widget"
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${themeConfig.bubbleBg} text-white`}
        style={{
          boxShadow: `0 8px 30px ${themeConfig.bgGlow}`,
        }}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
        ) : (
          <>
            <MessageSquare className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-cyan-500 text-[9px] font-bold text-white items-center justify-center">
                1
              </span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
