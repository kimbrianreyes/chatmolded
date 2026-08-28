"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, BotTheme } from "@/types/database";
import {
  PaperPlaneRight,
  X,
  Sparkle,
  ArrowClockwise,
  User,
  Lightning
} from "@phosphor-icons/react";

interface EmbedChatbotClientProps {
  bot: Bot;
}

export default function EmbedChatbotClient({ bot }: EmbedChatbotClientProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: bot.welcome_message || "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sampleQuestions = Array.isArray(bot.sample_questions)
    ? (bot.sample_questions as string[])
    : [];

  const themeColors: Record<BotTheme, { bg: string; text: string; ring: string; border: string; badge: string }> = {
    emerald: {
      bg: "bg-emerald-500",
      text: "text-emerald-400",
      ring: "ring-emerald-500",
      border: "border-emerald-500/30",
      badge: "bg-emerald-500/10 text-emerald-300",
    },
    cyan: {
      bg: "bg-cyan-500",
      text: "text-cyan-400",
      ring: "ring-cyan-500",
      border: "border-cyan-500/30",
      badge: "bg-cyan-500/10 text-cyan-300",
    },
    indigo: {
      bg: "bg-indigo-500",
      text: "text-indigo-400",
      ring: "ring-indigo-500",
      border: "border-indigo-500/30",
      badge: "bg-indigo-500/10 text-indigo-300",
    },
    purple: {
      bg: "bg-purple-500",
      text: "text-purple-400",
      ring: "ring-purple-500",
      border: "border-purple-500/30",
      badge: "bg-purple-500/10 text-purple-300",
    },
  };

  const currentTheme = themeColors[bot.theme] || themeColors.emerald;

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Tell parent window to close the iframe
  const handleClose = () => {
    if (typeof window !== "undefined" && window.parent) {
      window.parent.postMessage({ type: "chatmolded:close", botId: bot.id }, "*");
    }
  };

  // Reset conversation
  const handleReset = () => {
    setMessages([
      { role: "assistant", content: bot.welcome_message || "Hello! How can I help you today?" },
    ]);
  };

  // Send query and stream AI response
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMessage = text.trim();
    const updatedMsgs = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updatedMsgs);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`/api/bots/${bot.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMsgs.filter((m) => m.content.trim().length > 0),
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Error ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response stream received from AI server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedAnswer = "";

      // Add placeholder for assistant response
      setMessages([...updatedMsgs, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedAnswer += chunk;

        setMessages([
          ...updatedMsgs,
          { role: "assistant", content: accumulatedAnswer },
        ]);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages([
        ...updatedMsgs,
        {
          role: "assistant",
          content: `⚠️ ${err.message || "Failed to generate response. Please try again later."}`,
        },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#070a12] text-slate-100 font-sans select-none antialiased">
      {/* Widget Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#090d18]/95 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 truncate">
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-inner">
              {bot.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bot.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className={`font-mono font-bold ${currentTheme.text} text-sm`}>
                  {bot.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#090d18]" />
          </div>

          <div className="truncate">
            <h1 className="truncate text-xs font-bold text-white tracking-tight">{bot.name}</h1>
            <p className="truncate text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <span>{bot.description || "AI Assistant • Online"}</span>
            </p>
          </div>
        </div>

        {/* Action Controls (Reset & Close) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            title="Reset Chat"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <ArrowClockwise weight="bold" className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleClose}
            title="Close Chat"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <X weight="bold" className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs select-text">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[10px] mt-0.5">
                {bot.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bot.avatar_url} alt="" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <span className={`font-mono font-bold ${currentTheme.text}`}>
                    {bot.name.charAt(0)}
                  </span>
                )}
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? `${currentTheme.bg} font-medium text-slate-950 shadow-md`
                  : "border border-white/[0.08] bg-[#0c101a] text-slate-200 shadow-sm"
              }`}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[10px] text-slate-300 mt-0.5">
                <User weight="bold" className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[10px]">
              <Sparkle weight="fill" className={`h-3 w-3 ${currentTheme.text} animate-spin`} />
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c101a] px-3 py-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Questions */}
      {sampleQuestions.length > 0 && messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-slate-300 hover:border-white/30 hover:bg-white/[0.06] hover:text-white transition-all text-left truncate max-w-full"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Box Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090d18] p-3 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition-all"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${currentTheme.bg} text-slate-950 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 shrink-0 shadow-md`}
          >
            <PaperPlaneRight weight="bold" className="h-4 w-4" />
          </button>
        </form>

        {/* Powered by ChatMolded Badge */}
        <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-slate-500 font-mono">
          <Lightning weight="fill" className={`h-2.5 w-2.5 ${currentTheme.text}`} />
          <span>Powered by</span>
          <a
            href="https://chatmolded.app"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white font-semibold underline underline-offset-2"
          >
            ChatMolded
          </a>
        </div>
      </footer>
    </div>
  );
}
