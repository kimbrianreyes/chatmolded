import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, Code, Sparkle, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

export default async function TestEmbedPage({
  searchParams,
}: {
  searchParams: Promise<{ botId?: string }>;
}) {
  const { botId } = await searchParams;
  const supabase = await createClient();

  // Fetch the latest bot or user's bot
  let targetBotId = botId;
  if (!targetBotId) {
    const { data: bots } = await (supabase.from("bots") as any)
      .select("id, name, theme")
      .order("created_at", { ascending: false })
      .limit(1);

    if (bots && bots.length > 0) {
      targetBotId = bots[0].id;
    }
  }

  const { data: bot } = targetBotId
    ? await (supabase.from("bots") as any).select("*").eq("id", targetBotId).single()
    : { data: null };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans flex flex-col">
      {/* Top Banner / Navbar */}
      <header className="border-b border-white/[0.08] bg-[#090d16]/90 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-white/20 transition-all"
            >
              <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-400 border border-emerald-500/20">
              Live Embed Playground
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Testing Bot:</span>
            <span className="text-white font-bold">{bot?.name || "None"}</span>
          </div>
        </div>
      </header>

      {/* Simulated External Website (e.g. Developer Portfolio / Client Landing Page) */}
      <main className="mx-auto max-w-5xl flex-1 px-6 py-12 flex flex-col justify-center space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-slate-300">
            <Sparkle weight="fill" className="h-3.5 w-3.5 text-emerald-400" />
            <span>Simulated Host Website (e.g. yourportfolio.dev)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Testing the 1-Line Embed Script Tag in Action
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            This page represents an external third-party website (such as your personal portfolio, SaaS landing page, or client website). Look at the bottom-right corner to see the live floating launcher button injected by <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono text-xs">widget.js</code>!
          </p>

          {/* Code Snippet Demonstration */}
          {targetBotId && (
            <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-[#05070d] p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Code weight="bold" className="h-4 w-4 text-emerald-400" />
                  Embedded Script Tag on this page:
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle weight="bold" className="h-3.5 w-3.5" />
                  Loaded Active
                </span>
              </div>

              <pre className="text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed p-2">
                <code>{`<!-- 1-Line Embed Script Tag -->
<script 
  src="/widget.js" 
  data-bot-id="${targetBotId}" 
  data-theme="${bot?.theme || "emerald"}"
  defer>
</script>`}</code>
              </pre>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow hover:bg-emerald-400 transition-all"
            >
              Sample Call to Action
            </button>
            <Link
              href={`/dashboard/bots/${targetBotId}`}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-bold text-white hover:bg-white/[0.08] transition-all flex items-center gap-1.5"
            >
              <span>Edit Bot in Studio</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Inject the actual widget.js for live testing! */}
      {targetBotId && (
        <Script
          src="/widget.js"
          data-bot-id={targetBotId}
          data-theme={bot?.theme || "emerald"}
          strategy="lazyOnload"
        />
      )}
    </div>
  );
}
