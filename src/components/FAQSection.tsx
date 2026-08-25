"use client";

import React, { useState } from "react";
import { CaretDown, Question } from "@phosphor-icons/react";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What does BYOK (Bring Your Own Key) mean and why is it free?",
      a: "BYOK means you plug in your own API key from OpenAI, Groq, or Anthropic. ChatMolded handles the document chunking, vector indexing, and embeddable UI runtime. You pay $0 platform fees and only pay pennies (or $0.00 on Groq's free tier) directly to your model provider.",
    },
    {
      q: "How does the widget prevent CSS clashes on my portfolio or website?",
      a: "Our widget renders inside an isolated sandboxed iframe combined with a tiny (<3.8 KB) async loader script. Host website CSS rules will never break the chatbot, and the chatbot will never affect your website layout.",
    },
    {
      q: "What document formats are supported in v1?",
      a: "In v1, we strictly ingest text and document knowledge: Raw Text, Markdown (.md), PDF documents (.pdf), and Word documents (.docx). File uploads are rate-limited to maintain fast and reliable vector indexing.",
    },
    {
      q: "Can other developers steal my bot script and embed it on their sites?",
      a: "No. You can configure Domain Whitelisting (e.g., yourdomain.com, localhost:3000) in your bot settings. The runtime validates incoming HTTP Origin and Referer headers and blocks any unauthorized requests.",
    },
  ];

  return (
    <section id="faq" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#06080d] border-t border-white/[0.07]">
      <div className="mx-auto max-w-4xl">
        <div className="border-b border-white/[0.08] pb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Technical specifics regarding BYOK, document parsing, and embed security.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/[0.08] bg-[#0c101a] transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-white focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <CaretDown
                    weight="bold"
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/[0.06] px-4 pt-3 pb-4 text-xs leading-relaxed text-slate-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
