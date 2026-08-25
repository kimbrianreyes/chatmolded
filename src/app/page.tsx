"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AudienceSplit from "@/components/AudienceSplit";
import DemoBotBuilder from "@/components/DemoBotBuilder";
import HowItWorks from "@/components/HowItWorks";
import BYOKExplainer from "@/components/BYOKExplainer";
import EmbedCodeShowcase from "@/components/EmbedCodeShowcase";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FloatingChatbotWidget, { BotTheme, PERSONAS } from "@/components/FloatingChatbotWidget";

export default function Home() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [activePersonaKey, setActivePersonaKey] = useState("portfolio");
  const [theme, setTheme] = useState<BotTheme>("indigo");

  const handleOpenWidget = () => {
    setIsWidgetOpen(true);
  };

  const handleTestCustomBotInWidget = (customBot: {
    name: string;
    welcome: string;
    knowledge: string;
    theme: BotTheme;
  }) => {
    // Dynamically inject custom persona into widget memory
    PERSONAS["custom_sandbox"] = {
      id: "custom_sandbox",
      name: customBot.name,
      subtitle: `Molded Knowledge (${customBot.knowledge.length} chars)`,
      avatarIcon: "✨",
      welcomeMsg: customBot.welcome,
      sampleQuestions: [
        `What can ${customBot.name} help me with?`,
        "Summarize the knowledge you have",
        "How can I get in touch?",
      ],
      knowledgeContext: customBot.knowledge,
      responses: {
        default: `Based on the molded knowledge:\n\n${customBot.knowledge.slice(0, 240)}...\n\n(Tested live in BYOK Sandbox mode)`,
      },
    };

    setActivePersonaKey("custom_sandbox");
    setTheme(customBot.theme);
    setIsWidgetOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#05070c] text-slate-100 flex flex-col">
      {/* Navigation */}
      <Navbar onOpenDemo={handleOpenWidget} />

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenWidget={handleOpenWidget}
          selectedTheme={theme}
          setSelectedTheme={setTheme}
        />

        {/* Audience Focus: Developers vs Small Businesses */}
        <AudienceSplit />

        {/* Interactive Bot Studio Sandbox */}
        <DemoBotBuilder onTestInWidget={handleTestCustomBotInWidget} />

        {/* How It Works (3 Steps) */}
        <HowItWorks />

        {/* BYOK $0 Zero-Cost Explainer */}
        <BYOKExplainer />

        {/* 1-Line Embed Code Integration */}
        <EmbedCodeShowcase />

        {/* Pricing (BYOK Free Forever vs Phase 2 Pro) */}
        <PricingSection />

        {/* FAQs */}
        <FAQSection />

        {/* CTA Section */}
        <CTASection onOpenWidget={handleOpenWidget} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Bottom-Right Chatbot Widget (Always Interactive) */}
      <FloatingChatbotWidget
        isOpen={isWidgetOpen}
        setIsOpen={setIsWidgetOpen}
        activePersonaKey={activePersonaKey}
        setActivePersonaKey={setActivePersonaKey}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
