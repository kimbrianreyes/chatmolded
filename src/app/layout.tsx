import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatMolded — Mold Custom AI Chatbots for Portfolios & Websites",
  description: "Feed your custom knowledge (PDF, Docs, Text) to an AI chatbot and embed a lightweight, customizable floating bubble on your portfolio or website. Bring Your Own API Key (BYOK) for 100% cost-free hosting.",
  keywords: ["chatbot builder", "portfolio chatbot", "BYOK AI", "embeddable chatbot widget", "support bot SaaS", "custom GPT"],
  authors: [{ name: "ChatMolded" }],
  openGraph: {
    title: "ChatMolded — Mold Custom AI Chatbots for Portfolios & Websites",
    description: "Train a custom AI chatbot on your documents and embed a floating widget on your website in under 2 minutes. Free forever with BYOK.",
    url: "https://chatmolded.app",
    siteName: "ChatMolded",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatMolded — Mold Custom AI Chatbots for Portfolios & Websites",
    description: "Train a custom AI chatbot on your documents and embed a floating widget on your website in under 2 minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#06080d] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
