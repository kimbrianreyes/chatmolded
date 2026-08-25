"use client";

import React, { useState } from "react";
import { FilePdf, FileDoc, FileText, Database, ShieldCheck, Cpu, CheckCircle, ArrowRight } from "@phosphor-icons/react";

export default function DocumentEnginePreview() {
  const [activeDocType, setActiveDocType] = useState<"pdf" | "docx" | "txt">("pdf");

  const sampleChunks = {
    pdf: [
      {
        id: "chunk_01",
        heading: "Resume Summary & Core Stack",
        text: "Alex Chen - Senior Fullstack Engineer (5+ yrs). Core: Next.js 15, TypeScript, Python (FastAPI), PostgreSQL pgvector, AWS Lambda.",
        tokens: 38,
        similarity: 0.94,
      },
      {
        id: "chunk_02",
        heading: "Production Projects & AI Pipelines",
        text: "Architected ChatMolded.app: Sandboxed BYOK chatbot platform supporting streaming LLM completions and multi-tenant vector retrieval.",
        tokens: 42,
        similarity: 0.91,
      },
      {
        id: "chunk_03",
        heading: "Availability & Location",
        text: "Open for Senior Fullstack / AI Engineering roles (Remote, Worldwide). Contact: alex@example.com",
        tokens: 29,
        similarity: 0.88,
      },
    ],
    docx: [
      {
        id: "chunk_01",
        heading: "Pricing & Refund Guarantee",
        text: "All subscriptions are month-to-month. Cancel anytime without penalty. Full 14-day zero-questions refund policy.",
        tokens: 31,
        similarity: 0.96,
      },
      {
        id: "chunk_02",
        heading: "Domain Whitelisting Security",
        text: "Chatbots verify HTTP Origin and Referer headers against registered dashboard domains to prevent unauthorized script theft.",
        tokens: 35,
        similarity: 0.93,
      },
    ],
    txt: [
      {
        id: "chunk_01",
        heading: "Support Escalation Guidelines",
        text: "For tier-2 technical queries, transfer conversation to human engineer at support@novacloud.io or trigger Discord webhook.",
        tokens: 34,
        similarity: 0.89,
      },
    ],
  };

  const chunks = sampleChunks[activeDocType];

  return (
    <section id="pipeline" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#05070c] border-t border-white/[0.07]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Document Ingestion &amp; Vector Pipeline
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
              Inspect how PDF, DOCX, and raw text documents are parsed, chunked, and embedded into isolated vector memory with upload rate-limiting.
            </p>
          </div>

          {/* Doc Format Switcher */}
          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1 font-mono text-xs">
            <button
              onClick={() => setActiveDocType("pdf")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
                activeDocType === "pdf"
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FilePdf weight="bold" className="h-3.5 w-3.5" />
              <span>Resume.pdf</span>
            </button>
            <button
              onClick={() => setActiveDocType("docx")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
                activeDocType === "docx"
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileDoc weight="bold" className="h-3.5 w-3.5" />
              <span>Pricing_FAQ.docx</span>
            </button>
            <button
              onClick={() => setActiveDocType("txt")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
                activeDocType === "txt"
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText weight="bold" className="h-3.5 w-3.5" />
              <span>Guidelines.txt</span>
            </button>
          </div>
        </div>

        {/* Chunks Inspector Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {chunks.map((chunk, idx) => (
            <div
              key={chunk.id}
              className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0a0e18] p-5 transition-all hover:border-emerald-500/30"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="font-mono text-[10px] text-emerald-400">
                    VECTOR_CHUNK #{idx + 1}
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
                    Similarity: {(chunk.similarity * 100).toFixed(0)}%
                  </span>
                </div>

                <h4 className="mt-3 text-xs font-bold text-white tracking-tight">
                  {chunk.heading}
                </h4>

                <p className="mt-2 text-xs text-slate-300 font-mono leading-relaxed bg-[#06080e] p-3 rounded-lg border border-white/[0.04]">
                  {chunk.text}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span>Tokens: {chunk.tokens}</span>
                <span className="text-emerald-400">pgvector ready</span>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Note */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck weight="bold" className="h-4 w-4 text-emerald-400" />
            <span>
              <strong>Rate-Limited Ingestion:</strong> Max 10 docs/hour per account in v1 to protect infrastructure and prevent abuse.
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">No Image Bloat &bull; Text First RAG</span>
        </div>
      </div>
    </section>
  );
}
