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
  ShieldCheck,
  X,
  Lightning,
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
    return `<!-- ChatMolded Widget -->
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
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--text-primary)] flex flex-col">
      {/* ── Floating Glass Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--surface-0)]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-default)] bg-white/[0.03] text-emerald-400 transition-colors group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5">
              <ChatCircleDots weight="bold" className="h-[18px] w-[18px]" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[15px] font-bold tracking-tight text-white">
                Chat<span className="text-emerald-400">Molded</span>
              </span>
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 tracking-wide">
                WORKSPACE
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[13px] font-semibold text-white leading-tight">
                {profile?.full_name || userEmail.split("@")[0]}
              </span>
              <span className="text-[11px] text-[var(--text-tertiary)] font-mono">{userEmail}</span>
            </div>

            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-white hover:bg-white/[0.06] active:scale-[0.97]"
              >
                <SignOut weight="bold" className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ── */}
      <main className="mx-auto max-w-7xl flex-1 px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* ── Metric Overview Strip ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in-up">
          {[
            {
              label: "Active Chatbots",
              value: String(bots.length),
              valueSize: "text-3xl",
              icon: ChatCircleDots,
              accent: "emerald",
            },
            {
              label: "Inference Engine",
              value: "BYOK",
              valueSize: "text-lg",
              icon: Lightning,
              accent: "cyan",
            },
            {
              label: "Embed Security",
              value: "Sandboxed",
              valueSize: "text-lg",
              icon: ShieldCheck,
              accent: "indigo",
            },
          ].map((metric) => {
            const Icon = metric.icon;
            const accentMap: Record<string, string> = {
              emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
              cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
              indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
            };
            const ac = accentMap[metric.accent];
            return (
              <div key={metric.label} className="bezel-shell">
                <div className="bezel-core p-5 flex items-center justify-between">
                  <div>
                    <p className="text-label text-[var(--text-tertiary)] font-mono">{metric.label}</p>
                    <h3 className={`${metric.valueSize} font-extrabold text-white mt-1.5 tracking-tight`}>{metric.value}</h3>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${ac}`}>
                    <Icon weight="bold" className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Workspace Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-[var(--border-subtle)] pb-8 animate-fade-in-up stagger-1">
          <div>
            <h1 className="text-display text-2xl sm:text-3xl text-white">
              Your Chatbots
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed">
              Manage molded bots, ingested knowledge, BYOK API keys, and 1-line script tags.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.97]"
          >
            <Plus weight="bold" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            <span>Create Chatbot</span>
          </button>
        </div>

        {/* ── Bots Grid ── */}
        {bots.length === 0 ? (
          <div className="bezel-shell max-w-lg mx-auto animate-fade-in-up stagger-2">
            <div className="bezel-core p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkle weight="fill" className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-headline text-xl text-white">No chatbots molded yet</h3>
              <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                Create your first chatbot, feed your portfolio resume or support documents, and get a 1-line embed script tag.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 active:scale-[0.97] shadow-lg shadow-emerald-500/20"
              >
                <Plus weight="bold" className="h-4 w-4" />
                <span>Mold Your First Bot</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot, idx) => {
              const currentTheme = themeColors[bot.theme] || themeColors.emerald;
              return (
                <div
                  key={bot.id}
                  className={`bezel-shell surface-panel-interactive animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}
                >
                  <div className="bezel-core p-6 flex flex-col justify-between h-full space-y-5">
                    <div>
                      {/* Top row */}
                      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                        <div className="flex items-center gap-3 truncate">
                          <div className="h-10 w-10 rounded-xl bg-white/5 border border-[var(--border-default)] flex items-center justify-center overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] shrink-0">
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
                            <h4 className="text-headline text-sm text-white truncate">{bot.name}</h4>
                            <p className="text-[11px] text-[var(--text-tertiary)] font-mono truncate">{bot.description || "AI Assistant"}</p>
                          </div>
                        </div>

                        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold ${currentTheme.badge} border ${currentTheme.border} shrink-0`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${currentTheme.bg} animate-pulse-soft`} />
                          Active
                        </span>
                      </div>

                      {/* Body */}
                      <div className="mt-4 space-y-3">
                        <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                          &ldquo;{bot.welcome_message}&rdquo;
                        </p>

                        <div className="pt-3 space-y-2 border-t border-[var(--border-subtle)]">
                          <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] font-mono">
                            <span>Provider</span>
                            <span className="text-white uppercase font-bold tracking-wider">{bot.provider}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] font-mono">
                            <span>Theme</span>
                            <span className={`capitalize ${currentTheme.text} font-bold`}>{bot.theme}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                      <Link
                        href={`/dashboard/bots/${bot.id}`}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl ${currentTheme.badge} border ${currentTheme.border} py-2.5 text-[13px] font-bold ${currentTheme.text} hover:bg-white/[0.06] active:scale-[0.97]`}
                      >
                        <Sliders weight="bold" className="h-4 w-4" />
                        <span>Open Studio</span>
                      </Link>

                      <button
                        onClick={() => setActiveEmbedBot(bot)}
                        title="Get Embed Code"
                        className="flex items-center justify-center rounded-xl border border-[var(--border-default)] bg-white/[0.02] p-2.5 text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-white active:scale-[0.97]"
                      >
                        <Code weight="bold" className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteBot(bot.id)}
                        title="Delete Bot"
                        className="rounded-xl p-2.5 text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 active:scale-[0.97]"
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

      {/* ── Create Bot Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-md bezel-shell animate-slide-up-modal">
            <div className="bezel-core p-7">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <h3 className="text-headline text-lg text-white">Mold a New Chatbot</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Configure identity and BYOK provider</p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl p-2 text-[var(--text-tertiary)] hover:text-white hover:bg-white/[0.06] active:scale-[0.95]"
                >
                  <X weight="bold" className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateBot} className="mt-5 space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-2">Bot Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Portfolio Assistant"
                    value={newBotName}
                    onChange={(e) => setNewBotName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)] px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-2">Welcome Message</label>
                  <input
                    type="text"
                    required
                    value={newBotWelcome}
                    onChange={(e) => setNewBotWelcome(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)] px-4 py-3 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-2">Color Theme</label>
                    <select
                      value={newBotTheme}
                      onChange={(e) => setNewBotTheme(e.target.value as BotTheme)}
                      className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)] px-4 py-3 text-sm text-white focus:outline-none"
                    >
                      <option value="emerald">Emerald</option>
                      <option value="cyan">Cyan</option>
                      <option value="indigo">Indigo</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-2">Provider</label>
                    <select
                      value={newBotProvider}
                      onChange={(e) => setNewBotProvider(e.target.value as AIProvider)}
                      className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-2)] px-4 py-3 text-sm text-white focus:outline-none"
                    >
                      <option value="openrouter">OpenRouter — Free</option>
                      <option value="gemini">Gemini — Free</option>
                      <option value="groq">Groq — Free Tier</option>
                      <option value="openai">OpenAI — Pay-As-You-Go</option>
                      <option value="xai">xAI Grok — Prepaid</option>
                      <option value="deepseek">DeepSeek — Pay-As-You-Go</option>
                      <option value="anthropic">Claude — Pay-As-You-Go</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-5 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl border border-[var(--border-default)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.04] active:scale-[0.97]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-[0.97]"
                  >
                    {creating ? "Creating..." : "Create Chatbot"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Embed Code Modal ── */}
      {activeEmbedBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg bezel-shell animate-slide-up-modal">
            <div className="bezel-core p-7">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <h3 className="text-headline text-lg text-white">Embed {activeEmbedBot.name}</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Copy this script tag onto any website</p>
                </div>
                <button
                  onClick={() => setActiveEmbedBot(null)}
                  className="rounded-xl p-2 text-[var(--text-tertiary)] hover:text-white hover:bg-white/[0.06] active:scale-[0.95]"
                >
                  <X weight="bold" className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 rounded-2xl bg-[var(--surface-2)] p-5 border border-[var(--border-subtle)] font-mono text-[13px] text-[var(--text-secondary)] overflow-x-auto leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                <pre>{getEmbedSnippet(activeEmbedBot)}</pre>
              </div>

              <div className="mt-6 flex items-center justify-between pt-5 border-t border-[var(--border-subtle)] gap-4 flex-wrap">
                <Link
                  href={`/test-embed?botId=${activeEmbedBot.id}`}
                  target="_blank"
                  className="text-[13px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-2 underline underline-offset-4"
                >
                  <Sparkle weight="fill" className="h-4 w-4" />
                  <span>Test on Live Playground</span>
                </Link>

                <button
                  onClick={() => handleCopyEmbed(activeEmbedBot)}
                  className="flex items-center gap-2.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-[0.97]"
                >
                  {copiedEmbed ? (
                    <>
                      <CheckCircle weight="bold" className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy weight="bold" className="h-4 w-4" />
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
