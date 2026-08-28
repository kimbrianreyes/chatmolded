"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bot, Profile, BotTheme, AIProvider } from "@/types/database";
import { signOutAction, deleteBotAction } from "@/app/auth/actions";
import {
  ChatCircleDots,
  Plus,
  SignOut,
  Sparkle,
  Code,
  Trash,
  Sliders,
  CheckCircle,
  Copy,
  Cpu,
  ShieldCheck,
  X,
  Lightning,
  ArrowSquareOut,
  BookOpen
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

interface DashboardClientProps {
  userEmail: string;
  profile: Profile | null;
  initialBots: Bot[];
}

export default function DashboardClient({
  userEmail,
  profile,
  initialBots,
}: DashboardClientProps) {
  const [bots, setBots] = useState<Bot[]>(initialBots);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [newBotWelcome, setNewBotWelcome] = useState("Hello! How can I help you today?");
  const [newBotTheme, setNewBotTheme] = useState<BotTheme>("emerald");
  const [newBotProvider, setNewBotProvider] = useState<AIProvider>("openrouter");
  const [creating, setCreating] = useState(false);
  const [activeEmbedBot, setActiveEmbedBot] = useState<Bot | null>(null);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const supabase = createClient();

  const themeColors: Record<BotTheme, { bg: string; text: string; ring: string; border: string; badge: string }> = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-400", ring: "ring-emerald-500", border: "border-emerald-500/30", badge: "bg-emerald-500/10 text-emerald-300" },
    cyan: { bg: "bg-cyan-500", text: "text-cyan-400", ring: "ring-cyan-500", border: "border-cyan-500/30", badge: "bg-cyan-500/10 text-cyan-300" },
    indigo: { bg: "bg-indigo-500", text: "text-indigo-400", ring: "ring-indigo-500", border: "border-indigo-500/30", badge: "bg-indigo-500/10 text-indigo-300" },
    purple: { bg: "bg-purple-500", text: "text-purple-400", ring: "ring-purple-500", border: "border-purple-500/30", badge: "bg-purple-500/10 text-purple-300" },
  };

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await (supabase.from("bots") as any)
        .insert({
          user_id: user.id,
          name: newBotName || "My AI Assistant",
          welcome_message: newBotWelcome,
          theme: newBotTheme,
          provider: newBotProvider,
          model: newBotProvider === "openrouter" ? "poolside/laguna-s-2.1:free" : "llama-3.1-8b-instant",
          allowed_origins: ["*"],
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setBots([data, ...bots]);
        setIsCreateModalOpen(false);
        setNewBotName("");
      }
    } catch (err: any) {
      alert(err.message || "Failed to create bot");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBot = async (botId: string) => {
    if (!confirm("Are you sure you want to delete this chatbot?")) return;
    try {
      await deleteBotAction(botId);
      setBots(bots.filter((b) => b.id !== botId));
    } catch (err: any) {
      alert(err.message || "Failed to delete bot");
    }
  };

  const getEmbedSnippet = (bot: Bot) => {
    return `<!-- ChatMolded Embed Script -->
<script 
  src="${typeof window !== "undefined" ? window.location.origin : "https://chatmolded.app"}/widget.js" 
  data-bot-id="${bot.id}" 
  data-theme="${bot.theme}"
  ${bot.avatar_url ? `data-avatar-url="${bot.avatar_url}"\n  ` : ""}defer>
</script>`;
  };

  const handleCopyEmbed = (bot: Bot) => {
    navigator.clipboard.writeText(getEmbedSnippet(bot));
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Top Floating App Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070a12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-emerald-400 shadow-inner group-hover:border-emerald-500/40 transition-colors">
              <ChatCircleDots weight="bold" className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">
                Chat<span className="text-emerald-400">Molded</span>
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-emerald-400">
                Dashboard
              </span>
            </div>
          </Link>

          {/* User Profile & Sign Out */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-semibold text-white">
                {profile?.full_name || userEmail.split("@")[0]}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{userEmail}</span>
            </div>

            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-white/25 hover:text-white transition-all shadow-sm"
              >
                <SignOut weight="bold" className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Metric Overview Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-1.5 rounded-2xl bg-white/[0.02] ring-1 ring-white/10 shadow-lg">
            <div className="rounded-xl bg-[#090d18] p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Active Chatbots</p>
                <h3 className="text-2xl font-black text-white mt-0.5">{bots.length}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ChatCircleDots weight="bold" className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="p-1.5 rounded-2xl bg-white/[0.02] ring-1 ring-white/10 shadow-lg">
            <div className="rounded-xl bg-[#090d18] p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Inference Model</p>
                <h3 className="text-base font-bold text-white mt-1">BYOK Engine</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Lightning weight="bold" className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="p-1.5 rounded-2xl bg-white/[0.02] ring-1 ring-white/10 shadow-lg">
            <div className="rounded-xl bg-[#090d18] p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Embed Protection</p>
                <h3 className="text-base font-bold text-white mt-1">Sandboxed Iframe</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck weight="bold" className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Title & Create CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your Custom Chatbots
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Manage your molded bots, ingested documents, BYOK API keys, and 1-line script tags.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg transition-all hover:bg-emerald-400 active:scale-95"
          >
            <Plus weight="bold" className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span>Create New Chatbot</span>
          </button>
        </div>

        {/* Bots Grid (Double-Bezel Card Architecture) */}
        {bots.length === 0 ? (
          /* Empty State */
          <div className="p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-2xl max-w-xl mx-auto mt-12">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
                <Sparkle weight="fill" className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white tracking-tight">No chatbots molded yet</h3>
              <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Create your first chatbot, feed your portfolio resume or support documents, and get your 1-line embed script tag.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md active:scale-95"
              >
                <Plus weight="bold" className="h-4 w-4" />
                <span>Mold Your First Bot</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot) => {
              const currentTheme = themeColors[bot.theme] || themeColors.emerald;
              return (
                <div
                  key={bot.id}
                  className="p-1.5 rounded-[1.75rem] bg-white/[0.02] ring-1 ring-white/10 shadow-xl hover:ring-white/20 transition-all group flex flex-col justify-between"
                >
                  <div className="rounded-[calc(1.75rem-0.375rem)] bg-[#090d18] p-5 flex flex-col justify-between h-full space-y-4">
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
                        <div className="flex items-center gap-3 truncate">
                          <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs overflow-hidden shadow-inner shrink-0">
                            {bot.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={bot.avatar_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className={`font-mono font-bold ${currentTheme.text} text-sm`}>
                                {bot.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="truncate">
                            <h4 className="font-bold text-xs text-white truncate">{bot.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{bot.description || "Portfolio Assistant"}</p>
                          </div>
                        </div>

                        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold ${currentTheme.badge} border ${currentTheme.border} shrink-0`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${currentTheme.bg} animate-pulse`} />
                          Active
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="mt-3.5 space-y-2 text-xs font-mono">
                        <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                          &ldquo;{bot.welcome_message}&rdquo;
                        </p>

                        <div className="pt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/[0.04]">
                          <span>Provider:</span>
                          <span className="text-white uppercase font-bold">{bot.provider}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Theme Accent:</span>
                          <span className={`capitalize ${currentTheme.text} font-bold`}>{bot.theme}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <Link
                        href={`/dashboard/bots/${bot.id}`}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl ${currentTheme.badge} border ${currentTheme.border} py-2 text-xs font-bold ${currentTheme.text} hover:bg-white/[0.08] transition-all shadow-sm`}
                      >
                        <Sliders weight="bold" className="h-3.5 w-3.5" />
                        <span>Open Studio</span>
                      </Link>

                      <button
                        onClick={() => setActiveEmbedBot(bot)}
                        title="Get Embed Code"
                        className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] p-2 text-xs font-semibold text-slate-300 hover:border-white/25 hover:text-white transition-all shadow-sm"
                      >
                        <Code weight="bold" className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteBot(bot.id)}
                        title="Delete Bot"
                        className="rounded-xl p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash weight="bold" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Bot Modal (Double-Bezel Architecture) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md p-1.5 rounded-[2rem] bg-white/[0.03] ring-1 ring-white/15 shadow-2xl">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Mold a New Chatbot</h3>
                  <p className="text-[11px] text-slate-400">Configure identity and BYOK provider</p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X weight="bold" className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateBot} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5">Bot Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Portfolio Assistant"
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1.5">
                    Welcome Message
                  </label>
                  <input
                    type="text"
                    required
                    value={newBotWelcome}
                    onChange={(e) => setNewBotWelcome(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1.5">Color Theme</label>
                    <select
                      value={newBotTheme}
                      onChange={(e) => setNewBotTheme(e.target.value as BotTheme)}
                      className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white focus:border-white/30 focus:outline-none transition-all"
                    >
                      <option value="emerald">Emerald</option>
                      <option value="cyan">Cyan</option>
                      <option value="indigo">Indigo</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1.5">Provider (BYOK)</label>
                    <select
                      value={newBotProvider}
                      onChange={(e) => setNewBotProvider(e.target.value as AIProvider)}
                      className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white focus:border-white/30 focus:outline-none transition-all"
                    >
                      <option value="openrouter">OpenRouter (100+ Models)</option>
                      <option value="groq">Groq (Ultra-Fast & Free)</option>
                      <option value="xai">xAI Grok (console.x.ai)</option>
                      <option value="openai">OpenAI (GPT-4o-mini)</option>
                      <option value="deepseek">DeepSeek (V3)</option>
                      <option value="gemini">Google Gemini (Flash)</option>
                      <option value="anthropic">Claude 3.5 Haiku</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-md active:scale-95"
                  >
                    {creating ? "Creating..." : "Create Chatbot"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Modal (Double-Bezel Architecture) */}
      {activeEmbedBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg p-1.5 rounded-[2rem] bg-white/[0.03] ring-1 ring-white/15 shadow-2xl">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Embed {activeEmbedBot.name}</h3>
                  <p className="text-[11px] text-slate-400">Copy this 1-line script tag onto any website</p>
                </div>
                <button
                  onClick={() => setActiveEmbedBot(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X weight="bold" className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 rounded-2xl bg-[#05070d] p-4 border border-white/[0.08] font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed shadow-inner">
                <pre>{getEmbedSnippet(activeEmbedBot)}</pre>
              </div>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/[0.06] gap-3 flex-wrap">
                <Link
                  href={`/test-embed?botId=${activeEmbedBot.id}`}
                  target="_blank"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 underline underline-offset-4"
                >
                  <Sparkle weight="fill" className="h-3.5 w-3.5" />
                  <span>Test on Live Playground &rarr;</span>
                </Link>

                <button
                  onClick={() => handleCopyEmbed(activeEmbedBot)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md active:scale-95"
                >
                  {copiedEmbed ? (
                    <>
                      <CheckCircle weight="bold" className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy weight="bold" className="h-3.5 w-3.5" />
                      <span>Copy Script Tag</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
