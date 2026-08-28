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
  Sparkle,
  Globe,
  LockKey,
  FilePdf,
  FileDoc,
  FileText,
  FileCode,
  WarningCircle,
  SpinnerGap,
  ArrowClockwise,
  User,
  Lightning
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

  // Knowledge base document upload states
  const [textDocTitle, setTextDocTitle] = useState("");
  const [textDocContent, setTextDocContent] = useState("");
  const [addingDoc, setAddingDoc] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Status & Simulator
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedSimIdx, setCopiedSimIdx] = useState<number | null>(null);

  // Simulator chat messages
  const [simMessages, setSimMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [simInput, setSimInput] = useState("");
  const [simTyping, setSimTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // Theme styling helpers
  const themeColors: Record<BotTheme, { bg: string; text: string; ring: string; border: string; badge: string; hex: string }> = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-400", ring: "ring-emerald-500", border: "border-emerald-500/30", badge: "bg-emerald-500/10 text-emerald-300", hex: "#10b981" },
    cyan: { bg: "bg-cyan-500", text: "text-cyan-400", ring: "ring-cyan-500", border: "border-cyan-500/30", badge: "bg-cyan-500/10 text-cyan-300", hex: "#06b6d4" },
    indigo: { bg: "bg-indigo-500", text: "text-indigo-400", ring: "ring-indigo-500", border: "border-indigo-500/30", badge: "bg-indigo-500/10 text-indigo-300", hex: "#6366f1" },
    purple: { bg: "bg-purple-500", text: "text-purple-400", ring: "ring-purple-500", border: "border-purple-500/30", badge: "bg-purple-500/10 text-purple-300", hex: "#a855f7" },
  };

  const currentTheme = themeColors[theme] || themeColors.emerald;

  // Helper for file type icons
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FilePdf weight="bold" className="h-4 w-4 text-rose-400" />;
      case "docx":
        return <FileDoc weight="bold" className="h-4 w-4 text-blue-400" />;
      case "md":
        return <FileCode weight="bold" className="h-4 w-4 text-emerald-400" />;
      default:
        return <FileText weight="bold" className="h-4 w-4 text-slate-400" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Actions
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
        is_active: isActive,
      });

      setBot(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert("Failed to save changes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Avatar image size must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    if (sampleQuestions.length >= 4) {
      alert("Maximum 4 starter questions allowed.");
      return;
    }
    setSampleQuestions([...sampleQuestions, newQuestion.trim()]);
    setNewQuestion("");
  };

  const handleRemoveQuestion = (idx: number) => {
    setSampleQuestions(sampleQuestions.filter((_, i) => i !== idx));
  };

  const handleAddOrigin = () => {
    if (!newOrigin.trim()) return;
    const formatted = newOrigin.trim();
    if (!allowedOrigins.includes(formatted)) {
      setAllowedOrigins([...allowedOrigins, formatted]);
    }
    setNewOrigin("");
  };

  const handleRemoveOrigin = (originToRemove: string) => {
    const filtered = allowedOrigins.filter((o) => o !== originToRemove);
    setAllowedOrigins(filtered.length === 0 ? ["*"] : filtered);
  };

  const handleAddTextDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textDocContent.trim()) return;
    setAddingDoc(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const newDoc = await addTextDocumentAction(
        bot.id,
        textDocTitle || "Pasted Knowledge Notes",
        textDocContent
      );
      setDocuments([newDoc, ...documents]);
      setTextDocTitle("");
      setTextDocContent("");
      setUploadSuccess(`Ingested "${newDoc.file_name}" (${newDoc.chunk_count} chunks indexed).`);
    } catch (err: any) {
      setUploadError(err.message || "Failed to ingest text document.");
    } finally {
      setAddingDoc(false);
    }
  };

  const handleDocumentFileUpload = async (file: File) => {
    setUploadingFile(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/bots/${bot.id}/documents`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to upload and parse document");
      }

      setDocuments([result.document, ...documents]);
      setUploadSuccess(`Molded "${result.document.file_name}" into ${result.chunksCreated} indexed chunks.`);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setUploadingFile(false);
      if (docFileInputRef.current) docFileInputRef.current.value = "";
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to remove this document from the knowledge base?")) return;
    try {
      await deleteDocumentAction(docId, bot.id);
      setDocuments(documents.filter((d) => d.id !== docId));
    } catch (err: any) {
      alert("Failed to delete document: " + err.message);
    }
  };

  const handleCopyMessage = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedSimIdx(idx);
    setTimeout(() => setCopiedSimIdx(null), 1500);
  };

  const handleSimSend = async (forcedText?: string) => {
    const textToSend = forcedText || simInput;
    if (!textToSend.trim() || simTyping) return;

    const userMsg = textToSend.trim();
    const updatedUserMsgs = [...simMessages, { role: "user" as const, content: userMsg }];
    setSimMessages(updatedUserMsgs);
    setSimInput("");
    setSimTyping(true);

    try {
      const response = await fetch(`/api/bots/${bot.id}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          messages: updatedUserMsgs.filter((m) => m.content.trim().length > 0),
          apiKey: apiKey || undefined,
          provider: provider,
          model: model,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response stream received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedAnswer = "";

      // Append initial placeholder for assistant
      setSimMessages([...updatedUserMsgs, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        accumulatedAnswer += textChunk;

        setSimMessages([
          ...updatedUserMsgs,
          { role: "assistant", content: accumulatedAnswer },
        ]);
      }
    } catch (err: any) {
      setSimMessages([
        ...updatedUserMsgs,
        {
          role: "assistant",
          content: `⚠️ Failed to generate completion: ${err.message || "Unknown error"}\n\nMake sure you have selected a valid provider and entered your API key in the "AI Engine" tab.`,
        },
      ]);
    } finally {
      setSimTyping(false);
    }
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
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Studio Top Floating Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070a12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/[0.06] transition-all"
            >
              <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-xs overflow-hidden shadow-inner">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className={`font-mono font-bold ${currentTheme.text}`}>
                      {name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-slate-500"} ring-2 ring-[#070a12]`} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white tracking-tight">{name}</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
                    Studio Mode
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button & Active Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono border transition-all ${
                isActive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-sm"
                  : "border-white/10 bg-white/[0.03] text-slate-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              <span>{isActive ? "Status: Active" : "Status: Paused"}</span>
            </button>

            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className={`group flex items-center gap-2 rounded-xl ${currentTheme.bg} px-4 py-2 text-xs font-bold text-slate-950 shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50`}
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

      {/* Main Studio Workspace (Left Config Double-Bezel + Right Simulator Double-Bezel) */}
      <div className="mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT CONFIGURATION PANEL (7 COLS) ================= */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#090d18] p-1.5 text-xs font-medium shadow-xl">
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
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all ${
                    isSelected
                      ? `${currentTheme.bg} text-slate-950 font-bold shadow-md`
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon weight={isSelected ? "bold" : "regular"} className="h-4 w-4" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: APPEARANCE & BRANDING (Double-Bezel Architecture) */}
          {activeTab === "appearance" && (
            <div className="p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-2xl">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">
                      Bot Appearance &amp; Identity
                    </h2>
                    <p className="text-xs text-slate-400">
                      Customize how your AI chatbot looks when embedded on your website.
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-mono ${currentTheme.badge} border ${currentTheme.border}`}>
                    Live Theming
                  </span>
                </div>

                {/* Bot Name & Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-xs text-slate-300 mb-1.5">
                      Chatbot Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white focus:border-white/30 focus:outline-none transition-all"
                      placeholder="e.g. Alex Portfolio Assistant"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-xs text-slate-300 mb-1.5">
                      Short Description / Subtitle
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white focus:border-white/30 focus:outline-none transition-all"
                      placeholder="e.g. Ask me anything about my projects and tech stack"
                    />
                  </div>
                </div>

                {/* Custom Logo Upload */}
                <div className="border-t border-white/[0.06] pt-5">
                  <label className="block font-medium text-xs text-slate-300 mb-2">
                    Custom Logo / Avatar Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl border border-white/15 bg-[#05070d] flex items-center justify-center overflow-hidden shadow-inner">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <span className={`font-mono font-bold ${currentTheme.text} text-xl`}>
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
                        className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition-all shadow-sm"
                      >
                        <UploadSimple weight="bold" className="h-3.5 w-3.5" />
                        <span>Upload Image</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl(null)}
                          className="rounded-xl p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="Remove Avatar"
                        >
                          <Trash weight="bold" className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Theme Color Palette */}
                <div className="border-t border-white/[0.06] pt-5">
                  <label className="block font-medium text-xs text-slate-300 mb-2.5">
                    Widget Accent Theme
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {(["emerald", "cyan", "indigo", "purple"] as BotTheme[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTheme(t)}
                        className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs capitalize transition-all ${
                          theme === t
                            ? "border-white/30 bg-white/[0.08] font-bold text-white shadow-lg ring-1 ring-white/20"
                            : "border-white/10 bg-[#05070d] text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <span className={`h-3.5 w-3.5 rounded-full ${themeColors[t].bg} shadow-sm`} />
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="border-t border-white/[0.06] pt-5">
                  <label className="block font-medium text-xs text-slate-300 mb-1.5">
                    Welcome Greeting Message
                  </label>
                  <textarea
                    rows={2}
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#05070d] p-3 text-xs text-white focus:border-white/30 focus:outline-none leading-relaxed transition-all"
                    placeholder="Hi! I'm an AI assistant. How can I help you today?"
                  />
                </div>

                {/* Starter Sample Questions */}
                <div className="border-t border-white/[0.06] pt-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="font-medium text-xs text-slate-300">
                      Suggested Starter Questions ({sampleQuestions.length}/4)
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">1-click prompts</span>
                  </div>

                  <div className="space-y-2">
                    {sampleQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2 text-xs text-slate-300 shadow-sm"
                      >
                        <span className="truncate">&ldquo;{q}&rdquo;</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
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
                          className="flex-1 rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2 text-xs text-white focus:border-white/30 focus:outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleAddQuestion}
                          className="flex items-center gap-1 rounded-xl bg-white/[0.08] px-4 py-2 text-xs font-bold text-white hover:bg-white/[0.14] transition-all shadow-sm"
                        >
                          <Plus weight="bold" className="h-3.5 w-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KNOWLEDGE BASE (Double-Bezel Architecture) */}
          {activeTab === "knowledge" && (
            <div className="p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-2xl">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">Document &amp; Knowledge Ingestion</h2>
                    <p className="text-xs text-slate-400">
                      Upload PDFs, DOCX, Markdown, or raw notes to train your AI chatbot.
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold ${currentTheme.badge} border ${currentTheme.border}`}>
                    {documents.length} Docs Indexed
                  </span>
                </div>

                {/* Status Alerts */}
                {uploadSuccess && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 shadow-sm animate-fade-in">
                    <CheckCircle weight="fill" className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                {uploadError && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 shadow-sm animate-fade-in">
                    <WarningCircle weight="fill" className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* 1. Drag & Drop File Upload Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleDocumentFileUpload(file);
                  }}
                  className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-500/[0.08] scale-[0.99]"
                      : "border-white/15 bg-[#05070d] hover:border-white/30"
                  }`}
                >
                  <input
                    ref={docFileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentFileUpload(file);
                    }}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-emerald-400 border border-white/10 shadow-inner">
                      {uploadingFile ? (
                        <SpinnerGap weight="bold" className="h-6 w-6 animate-spin" />
                      ) : (
                        <UploadSimple weight="bold" className="h-6 w-6" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white">
                        {uploadingFile ? "Parsing & Chunking Document..." : "Drag & drop your document here, or"}
                      </p>
                      {!uploadingFile && (
                        <button
                          type="button"
                          onClick={() => docFileInputRef.current?.click()}
                          className={`mt-1 text-xs font-bold ${currentTheme.text} hover:underline underline-offset-2`}
                        >
                          Browse Files from Computer
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>PDF</span>
                      <span>•</span>
                      <span>DOCX</span>
                      <span>•</span>
                      <span>TXT</span>
                      <span>•</span>
                      <span>Markdown (Max 5MB)</span>
                    </div>
                  </div>
                </div>

                {/* 2. Direct Text Knowledge Input */}
                <form onSubmit={handleAddTextDocument} className="space-y-3.5 rounded-2xl border border-white/10 bg-[#05070d] p-5 shadow-sm">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkle weight="fill" className={`h-3.5 w-3.5 ${currentTheme.text}`} />
                    Or Paste Raw Notes &amp; Markdown
                  </span>

                  <input
                    type="text"
                    placeholder="Document Title (e.g. Portfolio Bio / Experience)"
                    value={textDocTitle}
                    onChange={(e) => setTextDocTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#070912] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition-all"
                  />

                  <textarea
                    rows={3}
                    required
                    placeholder="Paste resume details, tech stack, FAQs, or bio context..."
                    value={textDocContent}
                    onChange={(e) => setTextDocContent(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#070912] p-3 text-xs text-white placeholder-slate-500 focus:border-white/30 focus:outline-none font-mono text-[11px] leading-relaxed transition-all"
                  />

                  <button
                    type="submit"
                    disabled={addingDoc || !textDocContent.trim()}
                    className={`flex items-center gap-1.5 rounded-xl ${currentTheme.bg} px-4 py-2 text-xs font-bold text-slate-950 hover:opacity-90 transition-all disabled:opacity-50 shadow-md`}
                  >
                    <Plus weight="bold" className="h-3.5 w-3.5" />
                    <span>{addingDoc ? "Ingesting..." : "Ingest Text"}</span>
                  </button>
                </form>

                {/* 3. Ingested Documents List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
                    Ingested Knowledge Documents ({documents.length})
                  </h3>

                  {documents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs text-slate-500">
                      No documents uploaded yet. Drag &amp; drop a PDF or paste text above!
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#05070d] p-3.5 text-xs hover:border-white/20 transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-3.5 truncate">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 shadow-inner">
                              {getFileIcon(doc.file_type)}
                            </div>
                            <div className="truncate">
                              <p className="font-semibold text-white truncate">{doc.file_name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {formatBytes(doc.file_size_bytes)} • {doc.chunk_count} chunks indexed
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="rounded-xl p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Delete Document"
                          >
                            <Trash weight="bold" className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BYOK AI ENGINE (Double-Bezel Architecture) */}
          {activeTab === "ai" && (
            <div className="p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-2xl">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">
                      BYOK AI Engine &amp; Inference Provider
                    </h2>
                    <p className="text-xs text-slate-400">
                      Choose any AI provider and bring your API key for 100% cost-free inference.
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold ${currentTheme.badge} border ${currentTheme.border}`}>
                    Zero Markup
                  </span>
                </div>

                {/* Provider Selector Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "groq", name: "Groq", subtitle: "Llama 3.1 (Free & Fast)" },
                    { id: "openrouter", name: "OpenRouter", subtitle: "100+ Free & Paid Models" },
                    { id: "xai", name: "xAI (Grok)", subtitle: "grok-beta (console.x.ai)" },
                    { id: "openai", name: "OpenAI", subtitle: "GPT-4o-mini" },
                    { id: "deepseek", name: "DeepSeek", subtitle: "deepseek-chat (V3)" },
                    { id: "gemini", name: "Gemini", subtitle: "Flash 1.5 (Free)" },
                    { id: "anthropic", name: "Anthropic", subtitle: "Claude 3.5 Haiku" },
                    { id: "custom", name: "Custom / Any", subtitle: "Self-Hosted / Other" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setProvider(p.id as AIProvider);
                        if (p.id === "groq") setModel("llama-3.1-8b-instant");
                        if (p.id === "xai") setModel("grok-beta");
                        if (p.id === "openai") setModel("gpt-4o-mini");
                        if (p.id === "deepseek") setModel("deepseek-chat");
                        if (p.id === "anthropic") setModel("claude-3-5-haiku-20241022");
                        if (p.id === "gemini") setModel("gemini-1.5-flash");
                        if (p.id === "openrouter") setModel("poolside/laguna-s-2.1:free");
                      }}
                      className={`rounded-2xl border p-3.5 text-left transition-all ${
                        provider === p.id
                          ? "border-white/30 bg-white/[0.08] shadow-lg ring-1 ring-white/20"
                          : "border-white/10 bg-[#05070d] text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <p className="font-bold text-xs text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">{p.subtitle}</p>
                    </button>
                  ))}
                </div>

                {/* Model & API Key Config */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-xs text-slate-300 mb-1.5">
                        Model Identifier
                      </label>
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. llama-3.1-8b-instant"
                        className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:border-white/30 focus:outline-none transition-all"
                      />

                      {/* Quick Model Selector Pills */}
                      {provider === "groq" && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setModel(m)}
                              className={`rounded-lg px-2.5 py-1 font-mono text-[10px] border transition-all ${
                                model === m
                                  ? `${currentTheme.badge} ${currentTheme.border} font-bold`
                                  : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      )}

                      {provider === "openrouter" && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {["poolside/laguna-s-2.1:free", "meta-llama/llama-3.3-70b-instruct", "mistralai/mistral-7b-instruct:free"].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setModel(m)}
                              className={`rounded-lg px-2.5 py-1 font-mono text-[10px] border transition-all ${
                                model === m
                                  ? `${currentTheme.badge} ${currentTheme.border} font-bold`
                                  : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                              }`}
                            >
                              {m.split("/")[1] || m}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-medium text-xs text-slate-300">
                          {provider.toUpperCase()} API Key
                        </label>
                        <span className={`font-mono text-[10px] ${currentTheme.text} flex items-center gap-1`}>
                          <LockKey weight="bold" className="h-3 w-3" />
                          BYOK Encrypted
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Paste API Key..."
                          className="w-full rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 pr-10 text-xs font-mono text-white placeholder-slate-600 focus:border-white/30 focus:outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white transition-colors"
                        >
                          {showApiKey ? <EyeSlash weight="bold" className="h-4 w-4" /> : <Eye weight="bold" className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {provider === "openrouter" && (
                      <span>🔑 Access 100+ models via <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className={`font-semibold ${currentTheme.text} underline`}>openrouter.ai</a>.</span>
                    )}
                    {provider === "groq" && (
                      <span>🔑 Get your free ultra-fast key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className={`font-semibold ${currentTheme.text} underline`}>console.groq.com</a>.</span>
                    )}
                    {provider === "xai" && (
                      <span>🔑 Get your Grok key from <a href="https://console.x.ai" target="_blank" rel="noreferrer" className={`font-semibold ${currentTheme.text} underline`}>console.x.ai</a>.</span>
                    )}
                  </p>
                </div>

                {/* System Instructions / Prompt */}
                <div className="border-t border-white/[0.06] pt-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-medium text-xs text-slate-300">
                      System Instructions &amp; Persona Prompt
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">Token optimized</span>
                  </div>
                  <textarea
                    rows={3}
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#05070d] p-3.5 text-xs text-white font-mono text-[11px] leading-relaxed focus:border-white/30 focus:outline-none transition-all"
                    placeholder="You are a helpful assistant..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EMBED & SECURITY (Double-Bezel Architecture) */}
          {activeTab === "embed" && (
            <div className="p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-2xl">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#090d18] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">
                      1-Line Embed Script &amp; Domain Whitelist
                    </h2>
                    <p className="text-xs text-slate-400">
                      Add to any website with 1 line of code. Secure it with domain whitelisting.
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold ${currentTheme.badge} border ${currentTheme.border}`}>
                    Zero CSS-Bleed
                  </span>
                </div>

                {/* Domain Whitelist */}
                <div className="space-y-3">
                  <label className="block font-medium text-xs text-slate-300">
                    Allowed Embed Domains (Security Whitelist)
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Restrict embedding to your specific domain so external sites cannot use your bot quota.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {allowedOrigins.map((orig, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#05070d] px-3 py-1.5 text-xs font-mono text-slate-200 shadow-sm"
                      >
                        <Globe weight="bold" className={`h-3.5 w-3.5 ${currentTheme.text}`} />
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
                      className="flex-1 rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2 text-xs text-white focus:border-white/30 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddOrigin}
                      className="rounded-xl bg-white/[0.08] px-4 py-2 text-xs font-bold text-white hover:bg-white/[0.14] transition-all shadow-sm"
                    >
                      Add Domain
                    </button>
                  </div>
                </div>

                {/* Embed Code Snippet */}
                <div className="border-t border-white/[0.06] pt-5 space-y-3">
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
                      className={`flex items-center gap-1 text-xs font-mono font-semibold ${currentTheme.text} hover:opacity-80 transition-opacity`}
                    >
                      {copiedEmbed ? <CheckCircle weight="bold" className="h-3.5 w-3.5" /> : <Copy weight="bold" className="h-3.5 w-3.5" />}
                      <span>{copiedEmbed ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#05070d] p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed shadow-inner">
                    <pre>
                      <code>{getEmbedSnippet()}</code>
                    </pre>
                  </div>

                  {/* Playground Test Link */}
                  <div className="pt-2">
                    <Link
                      href={`/test-embed?botId=${bot.id}`}
                      target="_blank"
                      className={`inline-flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/[0.08] hover:${currentTheme.border} transition-all shadow-sm`}
                    >
                      <Sparkle weight="fill" className={`h-4 w-4 ${currentTheme.text}`} />
                      <span>Open Live Embed Playground &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT LIVE SIMULATOR (5 COLS) ================= */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-1.5">
              <Sparkle weight="fill" className={`h-3.5 w-3.5 ${currentTheme.text}`} />
              Live Interactive Simulator
            </span>
            <button
              onClick={() => {
                setSimMessages([{ role: "assistant", content: welcomeMessage }]);
              }}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <ArrowClockwise weight="bold" className="h-3 w-3" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Double-Bezel Mockup Container */}
          <div className="p-1.5 rounded-[2rem] bg-white/[0.02] ring-1 ring-white/10 shadow-2xl flex-1 flex flex-col min-h-[580px]">
            <div className="flex-1 rounded-[calc(2rem-0.375rem)] bg-[#090d18] flex flex-col overflow-hidden border border-white/[0.06]">
              {/* Widget Header */}
              <div className="border-b border-white/[0.08] bg-[#070a12]/80 p-4 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3 truncate">
                  <div className="relative shrink-0">
                    <div className="h-9 w-9 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center overflow-hidden shadow-inner">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className={`font-mono font-bold ${currentTheme.text}`}>
                          {name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070a12]" />
                  </div>

                  <div className="truncate">
                    <h4 className="font-bold text-xs text-white truncate">{name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Lightning weight="fill" className={`h-2.5 w-2.5 ${currentTheme.text}`} />
                      <span>{provider.toUpperCase()} • BYOK</span>
                    </p>
                  </div>
                </div>

                <span className={`h-3 w-3 rounded-full ${currentTheme.bg} shadow-md`} />
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 space-y-3.5 overflow-y-auto max-h-[380px] text-xs select-text">
                {simMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[10px] mt-0.5 shadow-sm">
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatarUrl} alt="" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                          <span className={`font-mono font-bold ${currentTheme.text}`}>
                            {name.charAt(0)}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="group relative max-w-[85%]">
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? `${currentTheme.bg} text-slate-950 font-medium shadow-md`
                            : "bg-[#0c101c] border border-white/[0.08] text-slate-200 shadow-sm"
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Micro-Action: Copy message */}
                      {msg.role === "assistant" && msg.content && (
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.content, i)}
                          title="Copy text"
                          className="opacity-0 group-hover:opacity-100 absolute -bottom-4 right-1 rounded bg-[#090d18] border border-white/10 p-1 text-[9px] text-slate-400 hover:text-white transition-opacity shadow-sm"
                        >
                          {copiedSimIdx === i ? <CheckCircle weight="bold" className="h-3 w-3 text-emerald-400" /> : <Copy weight="bold" className="h-3 w-3" />}
                        </button>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[10px] text-slate-300 mt-0.5">
                        <User weight="bold" className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}

                {simTyping && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[10px]">
                      <Sparkle weight="fill" className={`h-3 w-3 ${currentTheme.text} animate-spin`} />
                    </div>
                    <div className="rounded-2xl bg-[#0c101c] border border-white/[0.08] px-3 py-2 text-[10px] text-slate-400 flex items-center gap-1.5 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Starter Question Pills in Simulator */}
              {sampleQuestions.length > 0 && (
                <div className="px-4 pb-2.5 flex flex-wrap gap-1.5 border-t border-white/[0.04] pt-2.5 bg-[#080b15]">
                  {sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSimSend(q)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] text-slate-300 hover:border-white/30 hover:text-white transition-all truncate max-w-full shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Simulator Input Box */}
              <div className="border-t border-white/[0.08] bg-[#070a12] p-3.5 flex items-center gap-2">
                <input
                  type="text"
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSimSend();
                  }}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-xl border border-white/10 bg-[#05070d] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-white/30 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleSimSend()}
                  disabled={!simInput.trim() || simTyping}
                  className={`rounded-xl ${currentTheme.bg} p-2.5 text-slate-950 hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 shadow-md`}
                >
                  <PaperPlaneRight weight="bold" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
