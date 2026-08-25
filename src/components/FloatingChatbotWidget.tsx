"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatCircleDots, X, PaperPlaneTilt, ArrowsClockwise, ShieldCheck, User, Sparkle, Image as ImageIcon } from "@phosphor-icons/react";

export type BotTheme = "emerald" | "cyan" | "indigo" | "purple";

export interface BotPersona {
  id: string;
  name: string;
  subtitle: string;
  avatarIcon: string;
  avatarImage?: string; // Optional custom uploaded logo/photo URL or base64
  welcomeMsg: string;
  sampleQuestions: string[];
  knowledgeContext: string;
  responses: Record<string, string>;
}

export const PERSONAS: Record<string, BotPersona> = {
  portfolio: {
    id: "portfolio",
    name: "Alex Dev Assistant",
    subtitle: "Molded on Resume & GitHub (PDF/Text)",
    avatarIcon: "👨‍💻",
    welcomeMsg: "Hello! I am Alex's AI portfolio assistant. Ask me about his fullstack engineering background, recent projects, or availability.",
    sampleQuestions: [
      "What is Alex's core tech stack?",
      "Tell me about his recent Next.js projects",
      "Is Alex open for contract or full-time roles?",
    ],
    knowledgeContext: "Alex Rivers | Senior Fullstack Engineer | 5+ yrs exp | Next.js, TypeScript, Python, FastAPI, pgvector, AWS | Built ChatMolded & DevMetrics | Open for Remote roles.",
    responses: {
      "stack": "Alex's core stack is TypeScript, Next.js (App Router), React, Python (FastAPI), PostgreSQL + pgvector, and AWS Lambda.",
      "project": "His primary focus is ChatMolded.app (a sandboxed BYOK chatbot platform) and DevMetrics (an open-source observability tool).",
      "hire": "Yes! Alex is open to Senior Fullstack & AI Engineering roles (Remote) or high-impact contract consulting. Contact: alex@example.com",
      "default": "I was trained directly on Alex's engineering resume and portfolio markdown. Ask about his architecture decisions, stack, or recent builds.",
    },
  },
  business: {
    id: "business",
    name: "NovaCloud Support",
    subtitle: "Molded on Product Guides & Pricing FAQ",
    avatarIcon: "⚡",
    welcomeMsg: "Welcome to NovaCloud! How can I assist you with our plans, security, or deployment guides?",
    sampleQuestions: [
      "What is included in the Free tier?",
      "How does domain whitelisting work?",
      "How do I reach human support?",
    ],
    knowledgeContext: "NovaCloud Docs v2.4 | Free plan: up to 1 bot, BYOK mode | Pro plan: $19/mo | 99.9% uptime SLA | Email: support@novacloud.io",
    responses: {
      "free": "Our Free tier includes 1 active bot, unlimited conversations with BYOK, and text/PDF document ingestion with 0 platform fees.",
      "whitelist": "Domain Whitelisting ensures only requests with your website's Origin or Referer header can invoke your bot, preventing token theft.",
      "support": "You can reach human support directly at support@novacloud.io or trigger a callback in your dashboard.",
      "default": "I have full access to NovaCloud's product manual and pricing documentation to assist your team 24/7.",
    },
  },
};

export const THEME_CONFIGS: Record<
  BotTheme,
  {
    primaryBg: string;
    primaryText: string;
    glow: string;
    border: string;
  }
> = {
  emerald: {
    primaryBg: "bg-emerald-500 hover:bg-emerald-400 text-slate-950",
    primaryText: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.3)",
    border: "border-emerald-500/40",
  },
  cyan: {
    primaryBg: "bg-cyan-500 hover:bg-cyan-400 text-slate-950",
    primaryText: "text-cyan-400",
    glow: "rgba(6, 182, 212, 0.3)",
    border: "border-cyan-500/40",
  },
  indigo: {
    primaryBg: "bg-indigo-500 hover:bg-indigo-400 text-white",
    primaryText: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.3)",
    border: "border-indigo-500/40",
  },
  purple: {
    primaryBg: "bg-purple-500 hover:bg-purple-400 text-white",
    primaryText: "text-purple-400",
    glow: "rgba(168, 85, 247, 0.3)",
    border: "border-purple-500/40",
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
  customAvatarImage?: string | null;
}

export default function FloatingChatbotWidget({
  isOpen,
  setIsOpen,
  activePersonaKey,
  setActivePersonaKey,
  theme,
  setTheme,
  customAvatarImage,
}: FloatingChatbotWidgetProps) {
  const persona = PERSONAS[activePersonaKey] || PERSONAS.portfolio;
  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.emerald;
  const activeAvatar = customAvatarImage || persona.avatarImage;

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

    setTimeout(() => {
      let botResponse = persona.responses.default;
      const lower = query.toLowerCase();

      if (persona.id === "portfolio") {
        if (lower.includes("stack") || lower.includes("skill") || lower.includes("tech")) {
          botResponse = persona.responses.stack;
        } else if (lower.includes("project") || lower.includes("work") || lower.includes("built")) {
          botResponse = persona.responses.project;
        } else if (lower.includes("hire") || lower.includes("role") || lower.includes("contact")) {
          botResponse = persona.responses.hire;
        }
      } else {
        if (lower.includes("free") || lower.includes("cost") || lower.includes("plan")) {
          botResponse = persona.responses.free;
        } else if (lower.includes("whitelist") || lower.includes("domain") || lower.includes("security")) {
          botResponse = persona.responses.whitelist;
        } else if (lower.includes("support") || lower.includes("human") || lower.includes("contact")) {
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
    }, 500);
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
      {/* Expanded Widget Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="mb-3 flex h-[520px] w-[90vw] max-w-[380px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0e17] shadow-2xl backdrop-blur-xl sm:w-[380px]"
            style={{
              boxShadow: `0 24px 48px -12px ${themeConfig.glow}, 0 0 0 1px rgba(255, 255, 255, 0.08)`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#070a12] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 overflow-hidden text-base">
                  {activeAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeAvatar}
                      alt={persona.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{persona.avatarIcon}</span>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-black" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>{persona.name}</span>
                    {activeAvatar && (
                      <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[9px] font-mono text-emerald-400 border border-emerald-500/20">
                        Custom Logo
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {persona.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  className="rounded p-1 text-slate-400 hover:text-white"
                >
                  <ArrowsClockwise weight="bold" className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close widget"
                  className="rounded p-1 text-slate-400 hover:text-white"
                >
                  <X weight="bold" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Persona and Theme Switcher Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#06080d] px-3.5 py-1.5 font-mono text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Preset:</span>
                <button
                  onClick={() => setActivePersonaKey("portfolio")}
                  className={`rounded px-1.5 py-0.5 transition-all ${
                    activePersonaKey === "portfolio"
                      ? "bg-white/10 text-white font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Portfolio
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => setActivePersonaKey("business")}
                  className={`rounded px-1.5 py-0.5 transition-all ${
                    activePersonaKey === "business"
                      ? "bg-white/10 text-white font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Support
                </button>
              </div>

              <div className="flex items-center gap-1">
                {(["emerald", "cyan", "indigo", "purple"] as BotTheme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`h-2.5 w-2.5 rounded-full transition-transform ${
                      t === "emerald"
                        ? "bg-emerald-400"
                        : t === "cyan"
                        ? "bg-cyan-400"
                        : t === "indigo"
                        ? "bg-indigo-400"
                        : "bg-purple-400"
                    } ${theme === t ? "scale-125 ring-1 ring-white" : "opacity-40 hover:opacity-100"}`}
                  />
                ))}
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
              <div className="mx-auto flex w-fit items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-400 border border-emerald-500/20">
                <ShieldCheck weight="bold" className="h-3 w-3" />
                <span>BYOK Isolated Sandbox</span>
              </div>

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 leading-relaxed ${
                      m.role === "user"
                        ? "bg-white/10 text-white border border-white/10"
                        : "bg-[#06080e] text-slate-200 border border-white/[0.06]"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 rounded bg-[#06080e] px-3 py-2 w-fit text-slate-400 border border-white/[0.06]">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]" />
                </div>
              )}

              {/* Sample Question Chips */}
              {messages.length <= 2 && (
                <div className="pt-2 space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Suggested Queries:
                  </p>
                  {persona.sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="block w-full text-left rounded border border-white/[0.06] bg-[#06080e] px-2.5 py-1.5 text-[10px] text-slate-300 hover:border-white/20 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-white/[0.08] bg-[#070a12] p-3">
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
                  className="flex-1 rounded-lg border border-white/10 bg-[#06080e] px-3 py-1.5 font-mono text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${themeConfig.primaryBg} disabled:opacity-40 transition-transform active:scale-95`}
                >
                  <PaperPlaneTilt weight="bold" className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle floating widget"
        className={`relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 shadow-2xl transition-all hover:scale-105 active:scale-95 overflow-hidden ${themeConfig.primaryBg}`}
        style={{
          boxShadow: `0 8px 24px ${themeConfig.glow}`,
        }}
      >
        {isOpen ? (
          <X weight="bold" className="h-5 w-5" />
        ) : activeAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeAvatar}
            alt="Custom bot logo"
            className="h-full w-full object-cover"
          />
        ) : (
          <ChatCircleDots weight="bold" className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
