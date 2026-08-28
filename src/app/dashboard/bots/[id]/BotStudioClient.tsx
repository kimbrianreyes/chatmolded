"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Bot, Document, BotTheme, AIProvider } from "@/types/database";
import { updateBotAction, addTextDocumentAction, deleteDocumentAction } from "./actions";
import {
  ArrowLeft,
  FloppyDisk,
  PaintBrush,
  BookOpen,
  Cpu,
  ShieldCheck,
  UploadSimple,
  Trash,
  Plus,
  CheckCircle,
  Eye,
  EyeSlash,
  Copy,
  PaperPlaneRight,
  ChatCircleDots,
  Sparkle,
  Globe,
  LockKey
} from "@phosphor-icons/react";

interface BotStudioClientProps {
  initialBot: Bot;
  initialDocuments: Document[];
}

export default function BotStudioClient({
  initialBot,
  initialDocuments,
}: BotStudioClientProps) {
  const [bot, setBot] = useState<Bot>(initialBot);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<"appearance" | "knowledge" | "ai" | "embed">("appearance");

  // Form states
  const [name, setName] = useState(bot.name);
  const [description, setDescription] = useState(bot.description || "");
  const [welcomeMessage, setWelcomeMessage] = useState(bot.welcome_message);
  const [theme, setTheme] = useState<BotTheme>(bot.theme);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(bot.avatar_url);
  const [position, setPosition] = useState(bot.position || "bottom-right");
  
  // Sample Questions
  const rawQuestions = Array.isArray(bot.sample_questions)
    ? (bot.sample_questions as string[])
    : ["What are your primary skills?", "How can I contact you?"];
  const [sampleQuestions, setSampleQuestions] = useState<string[]>(rawQuestions);
  const [newQuestion, setNewQuestion] = useState("");

  // AI & BYOK
  const [provider, setProvider] = useState<AIProvider>(bot.provider);
  const [model, setModel] = useState(bot.model);
  const [apiKey, setApiKey] = useState(bot.api_key_encrypted || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    bot.system_prompt ||
      "You are a helpful, concise AI assistant trained specifically on the provided knowledge context. If the answer cannot be found in the context, politely explain that you do not know."
  );

  // Security & Whitelist
  const [allowedOrigins, setAllowedOrigins] = useState<string[]>(
    bot.allowed_origins && bot.allowed_origins.length > 0 ? bot.allowed_origins : ["*"]
  );
  const [newOrigin, setNewOrigin] = useState("");
  const [isActive, setIsActive] = useState(bot.is_active);

  // Knowledge base text input state
  const [textDocTitle, setTextDocTitle] = useState("");
  const [textDocContent, setTextDocContent] = useState("");
  const [addingDoc, setAddingDoc] = useState(false);

  // Status & Simulator
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Simulator chat messages
  const [simMessages, setSimMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [simInput, setSimInput] = useState("");
  const [simTyping, setSimTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme styling helpers
  const themeColors: Record<BotTheme, { bg: string; text: string; ring: string; hex: string }> = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-400", ring: "ring-emerald-500", hex: "#10b981" },
    cyan: { bg: "bg-cyan-500", text: "text-cyan-400", ring: "ring-cyan-500", hex: "#06b6d4" },
    indigo: { bg: "bg-indigo-500", text: "text-indigo-400", ring: "ring-indigo-500", hex: "#6366f1" },
    purple: { bg: "bg-purple-500", text: "text-purple-400", ring: "ring-purple-500", hex: "#a855f7" },
  };

  // Handle Logo Upload via FileReader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setAvatarUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Question Pill
  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    if (sampleQuestions.length >= 4) {
      alert("Maximum 4 starter questions recommended.");
      return;
    }
    setSampleQuestions([...sampleQuestions, newQuestion.trim()]);
    setNewQuestion("");
  };

  // Remove Question Pill
  const handleRemoveQuestion = (idx: number) => {
    setSampleQuestions(sampleQuestions.filter((_, i) => i !== idx));
  };

  // Add Allowed Origin
  const handleAddOrigin = () => {
    if (!newOrigin.trim()) return;
    const clean = newOrigin.trim().toLowerCase();
    if (!allowedOrigins.includes(clean)) {
      const updated = allowedOrigins.filter((o) => o !== "*").concat(clean);
      setAllowedOrigins(updated);
    }
    setNewOrigin("");
  };

  const handleRemoveOrigin = (orig: string) => {
    const updated = allowedOrigins.filter((o) => o !== orig);
    setAllowedOrigins(updated.length === 0 ? ["*"] : updated);
  };

  // Save All Changes
  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await updateBotAction(bot.id, {
        name,
        description,
        welcome_message: welcomeMessage,
        theme,
        avatar_url: avatarUrl,
        position,
        sample_questions: sampleQuestions,
        provider,
        model,
        api_key_encrypted: apiKey,
        system_prompt: systemPrompt,
        allowed_origins: allowedOrigins,
        rate_limit_per_minute: 20,
        is_active: isActive,
      });

      if (updated) {
        setBot(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err: any) {
      alert(err.message || "Failed to save bot settings");
    } finally {
      setSaving(false);
    }
  };

  // Add text document to knowledge base
  const handleAddTextDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textDocContent.trim()) return;
    setAddingDoc(true);

    try {
      const newDoc = await addTextDocumentAction(
        bot.id,
        textDocTitle.trim() || "Text Knowledge",
        textDocContent.trim()
      );
      if (newDoc) {
        setDocuments([newDoc, ...documents]);
        setTextDocTitle("");
        setTextDocContent("");
      }
    } catch (err: any) {
      alert(err.message || "Failed to ingest text document");
    } finally {
      setAddingDoc(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document from your knowledge base?")) return;
    try {
      await deleteDocumentAction(docId, bot.id);
      setDocuments(documents.filter((d) => d.id !== docId));
    } catch (err: any) {
      alert(err.message || "Failed to delete document");
    }
  };

  // Simulator Send Message
  const handleSimSend = (textToSend?: string) => {
    const message = textToSend || simInput;
    if (!message.trim()) return;

    const newMsgs = [...simMessages, { role: "user" as const, content: message }];
    setSimMessages(newMsgs);
    setSimInput("");
    setSimTyping(true);

    setTimeout(() => {
      // Mocked sandbox response based on ingested documents count
      const answer =
        documents.length > 0
          ? `Based on your molded knowledge (${documents.length} document[s] indexed):\n\n` +
            `I found relevant context regarding: "${message}". In full BYOK mode, this will query your ${provider.toUpperCase()} (${model}) model using vector embeddings!`
          : `Hello! I am ${name}. You haven't added any documents to my Knowledge Base tab yet. Add your resume, FAQ, or docs so I can answer questions accurately!`;

      setSimMessages([...newMsgs, { role: "assistant", content: answer }]);
      setSimTyping(false);
    }, 700);
  };

  const getEmbedSnippet = () => {
    return `<!-- ChatMolded Script Tag -->
<script 
  src="${typeof window !== "undefined" ? window.location.origin : "https://chatmolded.app"}/widget.js" 
  data-bot-id="${bot.id}" 
  data-theme="${theme}"
  ${avatarUrl ? `data-avatar-url="${avatarUrl}"\n  ` : ""}data-position="${position}"
  defer>
</script>`;
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col font-sans">
      {/* Studio Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080c14]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:border-white/20 transition-all"
            >
              <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs overflow-hidden">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-mono font-bold text-emerald-400">
                    {name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="font-bold text-sm text-white">{name}</span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] text-emerald-400 border border-emerald-500/20">
                Studio
              </span>
            </div>
          </div>

          {/* Save Button & Active Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono border transition-all ${
                isActive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-white/10 bg-white/[0.03] text-slate-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-slate-500"}`} />
              <span>{isActive ? "Status: Active" : "Status: Disabled"}</span>
            </button>

            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition-all active:scale-98 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle weight="bold" className="h-4 w-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <FloppyDisk weight="bold" className="h-4 w-4" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace (Left Config Panel + Right Simulator) */}
      <div className="mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT CONFIGURATION PANEL (7 COLS) ================= */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#090d16] p-1 text-xs font-medium">
            {[
              { id: "appearance", label: "Appearance", icon: PaintBrush },
              { id: "knowledge", label: `Knowledge (${documents.length})`, icon: BookOpen },
              { id: "ai", label: "AI Engine", icon: Cpu },
              { id: "embed", label: "Embed & Security", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 font-bold shadow"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon weight={isSelected ? "bold" : "regular"} className="h-3.5 w-3.5" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: APPEARANCE & BRANDING */}
          {activeTab === "appearance" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-6 space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-slate-400">
                Bot Appearance &amp; Identity
              </h2>

              {/* Bot Name & Subtitle */}
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-xs text-slate-300 mb-1">
                    Chatbot Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#06080e] px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Alex Portfolio Assistant"
                  />
                </div>

                <div>
                  <label className="block font-medium text-xs text-slate-300 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#06080e] px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Ask me anything about my projects and tech stack"
                  />
                </div>
              </div>

              {/* Custom Logo Upload */}
              <div className="border-t border-white/[0.06] pt-4">
                <label className="block font-medium text-xs text-slate-300 mb-2">
                  Custom Logo / Avatar Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl border border-white/15 bg-[#06080e] flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-mono font-bold text-emerald-400 text-lg">
                        {name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.08]"
                    >
                      <UploadSimple weight="bold" className="h-3.5 w-3.5" />
                      <span>Upload Image</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl(null)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash weight="bold" className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Theme Color Palette */}
              <div className="border-t border-white/[0.06] pt-4">
                <label className="block font-medium text-xs text-slate-300 mb-2">
                  Widget Theme Color Accent
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {(["emerald", "cyan", "indigo", "purple"] as BotTheme[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs capitalize transition-all ${
                        theme === t
                          ? "border-white/30 bg-white/[0.08] font-bold text-white shadow"
                          : "border-white/10 bg-[#06080e] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full ${themeColors[t].bg}`} />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Welcome Message */}
              <div className="border-t border-white/[0.06] pt-4">
                <label className="block font-medium text-xs text-slate-300 mb-1">
                  Welcome Greeting Message
                </label>
                <textarea
                  rows={2}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#06080e] p-3 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                  placeholder="Hi! I'm an AI assistant. How can I help you today?"
                />
              </div>

              {/* Starter Sample Questions */}
              <div className="border-t border-white/[0.06] pt-4">
                <label className="block font-medium text-xs text-slate-300 mb-2">
                  Suggested Starter Questions ({sampleQuestions.length}/4)
                </label>
                <div className="space-y-2">
                  {sampleQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#06080e] px-3 py-1.5 text-xs text-slate-300"
                    >
                      <span className="truncate">&ldquo;{q}&rdquo;</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash weight="bold" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {sampleQuestions.length < 4 && (
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="e.g. What are your pricing plans?"
                        className="flex-1 rounded-lg border border-white/10 bg-[#06080e] px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="flex items-center gap-1 rounded-lg bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.12]"
                      >
                        <Plus weight="bold" className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KNOWLEDGE BASE */}
          {activeTab === "knowledge" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white">Knowledge Ingestion</h2>
                  <p className="text-xs text-slate-400">
                    Add custom documents and text to train this chatbot.
                  </p>
                </div>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
                  {documents.length} Docs Molded
                </span>
              </div>

              {/* Direct Text Knowledge Input */}
              <form onSubmit={handleAddTextDocument} className="space-y-3 rounded-xl border border-white/10 bg-[#080c14] p-4">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sparkle weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
                  Paste Text / Markdown Knowledge
                </span>

                <input
                  type="text"
                  placeholder="Document Title (e.g. Portfolio Resume / About Me)"
                  value={textDocTitle}
                  onChange={(e) => setTextDocTitle(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#06080e] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />

                <textarea
                  rows={4}
                  required
                  placeholder="Paste your resume details, technical background, FAQ questions and answers, or documentation..."
                  value={textDocContent}
                  onChange={(e) => setTextDocContent(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#06080e] p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono text-[11px] leading-relaxed"
                />

                <button
                  type="submit"
                  disabled={addingDoc || !textDocContent.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  <Plus weight="bold" className="h-3.5 w-3.5" />
                  <span>{addingDoc ? "Ingesting..." : "Ingest Text into Knowledge Base"}</span>
                </button>
              </form>

              {/* Ingested Documents List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
                  Ingested Knowledge Files
                </h3>

                {documents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-slate-500">
                    No knowledge documents added yet. Paste text above to mold this chatbot!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#06080e] p-3 text-xs"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-bold uppercase">
                            {doc.file_type}
                          </span>
                          <div className="truncate">
                            <p className="font-semibold text-white truncate">{doc.file_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {doc.file_size_bytes} bytes • {doc.chunk_count} chunk(s) indexed
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="rounded p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash weight="bold" className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BYOK AI ENGINE */}
          {activeTab === "ai" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-6 space-y-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-slate-400">
                BYOK AI Engine &amp; Inference Provider
              </h2>

              {/* Provider Selector Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "groq", name: "Groq", subtitle: "Llama 3.3 (Fastest & Free)" },
                  { id: "openai", name: "OpenAI", subtitle: "GPT-4o-mini" },
                  { id: "anthropic", name: "Anthropic", subtitle: "Claude 3.5 Haiku" },
                  { id: "gemini", name: "Gemini", subtitle: "Flash 1.5" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProvider(p.id as AIProvider);
                      if (p.id === "groq") setModel("llama-3.3-70b-versatile");
                      if (p.id === "openai") setModel("gpt-4o-mini");
                      if (p.id === "anthropic") setModel("claude-3-5-haiku-20241022");
                      if (p.id === "gemini") setModel("gemini-1.5-flash");
                    }}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      provider === p.id
                        ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                        : "border-white/10 bg-[#06080e] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <p className="font-bold text-xs text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.subtitle}</p>
                  </button>
                ))}
              </div>

              {/* BYOK API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-xs text-slate-300">
                    Your {provider.toUpperCase()} API Key (BYOK)
                  </label>
                  <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                    <LockKey weight="bold" className="h-3 w-3" />
                    Encrypted on save
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`gsk_... or sk-...`}
                    className="w-full rounded-lg border border-white/10 bg-[#06080e] px-3.5 py-2.5 pr-10 text-xs font-mono text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white"
                  >
                    {showApiKey ? <EyeSlash weight="bold" className="h-4 w-4" /> : <Eye weight="bold" className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* System Instructions / Prompt */}
              <div className="border-t border-white/[0.06] pt-4">
                <label className="block font-medium text-xs text-slate-300 mb-1">
                  System Instructions &amp; Persona Prompt
                </label>
                <textarea
                  rows={4}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#06080e] p-3 text-xs text-white font-mono text-[11px] leading-relaxed focus:border-emerald-500 focus:outline-none"
                  placeholder="You are a helpful assistant..."
                />
              </div>
            </div>
          )}

          {/* TAB 4: EMBED & SECURITY */}
          {activeTab === "embed" && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0e17] p-6 space-y-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-slate-400">
                1-Line Embed &amp; Security Whitelist
              </h2>

              {/* Domain Whitelist */}
              <div className="space-y-3">
                <label className="block font-medium text-xs text-slate-300">
                  Allowed Embed Domains (Security Whitelist)
                </label>
                <p className="text-[11px] text-slate-400">
                  Restrict embedding to your specific domain so other websites cannot use your bot quota.
                </p>

                <div className="flex flex-wrap gap-2">
                  {allowedOrigins.map((orig, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#06080e] px-2.5 py-1 text-xs font-mono text-slate-200"
                    >
                      <Globe weight="bold" className="h-3 w-3 text-emerald-400" />
                      <span>{orig === "*" ? "All Domains (*)" : orig}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOrigin(orig)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    placeholder="https://myportfolio.dev or http://localhost:3000"
                    className="flex-1 rounded-lg border border-white/10 bg-[#06080e] px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddOrigin}
                    className="rounded-lg bg-white/[0.08] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.12]"
                  >
                    Add Domain
                  </button>
                </div>
              </div>

              {/* Embed Code Snippet */}
              <div className="border-t border-white/[0.06] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-xs text-slate-300">
                    Your 1-Line Script Tag
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getEmbedSnippet());
                      setCopiedEmbed(true);
                      setTimeout(() => setCopiedEmbed(false), 1500);
                    }}
                    className="flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedEmbed ? <CheckCircle weight="bold" className="h-3.5 w-3.5" /> : <Copy weight="bold" className="h-3.5 w-3.5" />}
                    <span>{copiedEmbed ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#06080e] p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                  <pre>
                    <code>{getEmbedSnippet()}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT LIVE SIMULATOR (5 COLS) ================= */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-1.5">
              <Sparkle weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
              Live Interactive Simulator
            </span>
            <button
              onClick={() => {
                setSimMessages([{ role: "assistant", content: welcomeMessage }]);
              }}
              className="text-[11px] text-slate-500 hover:text-slate-300"
            >
              Reset Chat
            </button>
          </div>

          {/* Widget Container Mockup */}
          <div className="flex-1 min-h-[550px] rounded-2xl border border-white/[0.12] bg-[#0c101a] shadow-2xl flex flex-col overflow-hidden">
            {/* Widget Header */}
            <div className="border-b border-white/[0.08] bg-[#080c14] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-mono font-bold text-emerald-400">
                        {name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#080c14]" />
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white">{name}</h4>
                  <p className="text-[10px] text-slate-400">Online • BYOK Mode</p>
                </div>
              </div>

              <span className={`h-2.5 w-2.5 rounded-full ${themeColors[theme].bg}`} />
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[380px] text-xs">
              {simMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? `${themeColors[theme].bg} text-slate-950 font-medium`
                        : "bg-white/[0.05] border border-white/10 text-slate-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {simTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/[0.05] border border-white/10 px-3 py-2 text-[10px] text-slate-400 animate-pulse">
                    Molding response...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Starter Question Pills in Simulator */}
            {sampleQuestions.length > 0 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 border-t border-white/[0.04] pt-2">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSimSend(q)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-all truncate max-w-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Simulator Input Box */}
            <div className="border-t border-white/[0.08] bg-[#080c14] p-3 flex items-center gap-2">
              <input
                type="text"
                value={simInput}
                onChange={(e) => setSimInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSimSend();
                }}
                placeholder="Ask a question..."
                className="flex-1 rounded-xl border border-white/10 bg-[#06080e] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSimSend()}
                className={`rounded-xl ${themeColors[theme].bg} p-2 text-slate-950 hover:opacity-90 transition-all active:scale-95`}
              >
                <PaperPlaneRight weight="bold" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
