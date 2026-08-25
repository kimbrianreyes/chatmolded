"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What does BYOK (Bring Your Own Key) mean and why is it free?",
      a: "BYOK means you provide your own API key from providers like OpenAI, Groq, or Anthropic. Instead of charging you a monthly subscription with a 100x markup on AI inference, ChatMolded simply provides the document parsing, vector indexing, and embeddable UI. You only pay pennies (or $0.00 on Groq's free tier) directly to your model provider.",
    },
    {
      q: "How does the embeddable floating widget work without breaking my site's CSS?",
      a: "Our widget utilizes an isolated sandboxed iframe architecture combined with a tiny (<5KB) async loader script. This ensures that none of your website's CSS rules will mess up the chatbot UI, and the chatbot's styles will never accidentally alter your website's layout.",
    },
    {
      q: "What document formats are supported in v1?",
      a: "In v1, we strictly prioritize text and document knowledge: Raw Text, Markdown (.md), PDF documents (.pdf), and Word documents (.docx). To ensure high performance, images inside documents are stripped in v1, and file uploads are rate-limited to protect infrastructure.",
    },
    {
      q: "Can I prevent other people from copying my script and using my bot?",
      a: "Yes! In your ChatMolded bot settings, you can configure Domain Whitelisting (e.g., yourportfolio.dev, localhost:3000). The embed runtime verifies the origin header of the request, blocking any unauthorized domain from loading your bot or invoking completions.",
    },
    {
      q: "Can I customize the colors and greeting of the floating bubble?",
      a: "Yes! You can customize your bot's name, avatar icon, greeting message, suggested questions, and choose from curated color themes (Indigo Blue, Cyber Cyan, Emerald Green, Neon Magenta) to seamlessly match your personal brand or portfolio aesthetic.",
    },
  ];

  return (
    <section id="faq" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#07090e]">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Everything you need to know about BYOK, document ingestion, and embed security.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#0b0f19] transition-colors hover:border-slate-700"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-white focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-800/80 px-5 pt-3 pb-5 text-xs leading-relaxed text-slate-300">
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
