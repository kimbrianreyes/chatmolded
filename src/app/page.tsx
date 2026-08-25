"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AudienceSplit from "@/components/AudienceSplit";
import DocumentEnginePreview from "@/components/DocumentEnginePreview";
import DemoBotBuilder from "@/components/DemoBotBuilder";
import BYOKExplainer from "@/components/BYOKExplainer";
import EmbedCodeShowcase from "@/components/EmbedCodeShowcase";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import FloatingChatbotWidget, { BotTheme, PERSONAS } from "@/components/FloatingChatbotWidget";

export default function Home() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [activePersonaKey, setActivePersonaKey] = useState("portfolio");
  const [theme, setTheme] = useState<BotTheme>("emerald");
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  const handleOpenWidget = () => {
    setIsWidgetOpen(true);
  };

  const handleTestCustomBotInWidget = (customBot: {
    name: string;
    welcome: string;
    knowledge: string;
    theme: BotTheme;
    avatarImage?: string | null;
  }) => {
    setCustomAvatar(customBot.avatarImage || null);

    PERSONAS["custom_sandbox"] = {
      id: "custom_sandbox",
      name: customBot.name,
      subtitle: `Molded Knowledge (${customBot.knowledge.length} chars)`,
      avatarIcon: "✨",
      avatarImage: customBot.avatarImage || undefined,
      welcomeMsg: customBot.welcome,
      sampleQuestions: [
        `What can ${customBot.name} help me with?`,
        "Summarize the knowledge you have",
        "How can I get in touch?",
      ],
      knowledgeContext: customBot.knowledge,
      responses: {
        default: `Based on the custom knowledge provided:\n\n${customBot.knowledge.slice(0, 200)}...\n\n(Tested in BYOK Sandbox mode)`,
      },
    };

    setActivePersonaKey("custom_sandbox");
    setTheme(customBot.theme);
    setIsWidgetOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Linear-style navigation */}
      <Navbar onOpenDemo={handleOpenWidget} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenWidget={handleOpenWidget}
          selectedTheme={theme}
          setSelectedTheme={setTheme}
        />

        {/* Capabilities Section */}
        <AudienceSplit />

        {/* Vector Ingestion Pipeline & Chunks Inspector */}
        <DocumentEnginePreview />

        {/* Interactive Bot Studio Sandbox with Logo Upload */}
        <DemoBotBuilder onTestInWidget={handleTestCustomBotInWidget} />

        {/* BYOK $0 Zero-Cost Architecture Explainer */}
        <BYOKExplainer />

        {/* 1-Line Embed Code Integration */}
        <EmbedCodeShowcase />

        {/* Transparent Pricing ($0 BYOK) */}
        <PricingSection />

        {/* FAQs */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Chatbot Widget with Custom Avatar Logo */}
      <FloatingChatbotWidget
        isOpen={isWidgetOpen}
        setIsOpen={setIsWidgetOpen}
        activePersonaKey={activePersonaKey}
        setActivePersonaKey={setActivePersonaKey}
        theme={theme}
        setTheme={setTheme}
        customAvatarImage={customAvatar}
      />
    </div>
  );
}
