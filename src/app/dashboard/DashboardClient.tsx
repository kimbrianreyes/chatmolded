"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bot, Profile } from "@/types/database";
import { signOutAction, deleteBotAction } from "@/app/auth/actions";
import {
  ChatCircleDots,
  Plus,
  SignOut,
  Sparkle,
  Code,
  FileText,
  Trash,
  Sliders,
  CheckCircle,
  Copy,
  TerminalWindow,
  Cpu,
  ShieldCheck,
  X
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
  const [newBotTheme, setNewBotTheme] = useState("emerald");
  const [newBotProvider, setNewBotProvider] = useState("groq");
  const [creating, setCreating] = useState(false);
  const [activeEmbedBot, setActiveEmbedBot] = useState<Bot | null>(null);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const supabase = createClient();

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
          theme: newBotTheme as any,
          provider: newBotProvider as any,
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
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col font-sans">
      {/* Top App Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080c14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-emerald-400">
              <ChatCircleDots weight="bold" className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white">
                Chat<span className="text-emerald-400">Molded</span>
              </span>
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.2 font-mono text-[9px] text-emerald-400">
                Workspace
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
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 hover:border-white/20 hover:text-white transition-all"
              >
                <SignOut weight="bold" className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Workspace Title & Create CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your Custom Chatbots
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Manage your molded bots, ingested documents, BYOK API keys, and embed scripts.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md transition-all hover:bg-emerald-400 active:scale-98"
          >
            <Plus weight="bold" className="h-4 w-4" />
            <span>Create New Chatbot</span>
          </button>
        </div>

        {/* Bots Grid */}
        {bots.length === 0 ? (
          /* Empty State */
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 bg-[#090d17] p-12 text-center max-w-xl mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkle weight="fill" className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">No chatbots created yet</h3>
            <p className="mt-1.5 text-xs text-slate-400">
              Create your first chatbot, feed your portfolio resume or support documents, and get your 1-line embed script.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all"
            >
              <Plus weight="bold" className="h-4 w-4" />
              <span>Mold Your First Bot</span>
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0a0e17] p-5 shadow-xl hover:border-white/20 transition-all group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs overflow-hidden">
                        {bot.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={bot.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-mono font-bold text-emerald-400">
                            {bot.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-xs text-white truncate max-w-[140px]">
                        {bot.name}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] text-emerald-400 border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>

                  {/* Body Specs */}
                  <div className="mt-4 space-y-2 text-xs font-mono">
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                      {bot.welcome_message}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/[0.04]">
                      <span>Inference Provider:</span>
                      <span className="text-white uppercase font-bold">{bot.provider}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Theme Accent:</span>
                      <span className="capitalize text-emerald-400 font-bold">{bot.theme}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <Link
                    href={`/dashboard/bots/${bot.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                  >
                    <Sliders weight="bold" className="h-3.5 w-3.5" />
                    <span>Open Studio</span>
                  </Link>

                  <button
                    onClick={() => setActiveEmbedBot(bot)}
                    title="Get Embed Code"
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-2 text-xs font-semibold text-slate-300 hover:border-white/20 hover:text-white transition-all"
                  >
                    <Code weight="bold" className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteBot(bot.id)}
                    title="Delete Bot"
                    className="rounded-lg p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash weight="bold" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Bot Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0e17] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white">Mold a New Chatbot</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X weight="bold" className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBot} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Bot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Portfolio Assistant"
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#06080e] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Welcome Message
                </label>
                <input
                  type="text"
                  required
                  value={newBotWelcome}
                  onChange={(e) => setNewBotWelcome(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#06080e] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Color Theme</label>
                  <select
                    value={newBotTheme}
                    onChange={(e) => setNewBotTheme(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#06080e] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="emerald">Emerald</option>
                    <option value="cyan">Cyan</option>
                    <option value="indigo">Indigo</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Provider (BYOK)</label>
                  <select
                    value={newBotProvider}
                    onChange={(e) => setNewBotProvider(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#06080e] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="groq">Groq (Free Tier)</option>
                    <option value="openai">OpenAI GPT-4o-mini</option>
                    <option value="anthropic">Claude 3.5 Haiku</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Chatbot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embed Code Modal */}
      {activeEmbedBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0e17] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Embed {activeEmbedBot.name}</h3>
                <p className="text-[11px] text-slate-400">Copy this 1-line script onto your site</p>
              </div>
              <button
                onClick={() => setActiveEmbedBot(null)}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X weight="bold" className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-[#06080e] p-4 border border-white/[0.06] font-mono text-xs text-slate-200 overflow-x-auto">
              <pre>{getEmbedSnippet(activeEmbedBot)}</pre>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/[0.06] gap-3 flex-wrap">
              <Link
                href={`/test-embed?botId=${activeEmbedBot.id}`}
                target="_blank"
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 underline underline-offset-4"
              >
                <Sparkle weight="fill" className="h-3.5 w-3.5" />
                <span>Test on Live Playground &rarr;</span>
              </Link>

              <button
                onClick={() => handleCopyEmbed(activeEmbedBot)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow"
              >
                {copiedEmbed ? (
                  <>
                    <CheckCircle weight="bold" className="h-3.5 w-3.5" />
                    <span>Copied to Clipboard!</span>
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
      )}
    </div>
  );
}
