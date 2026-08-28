import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EmbedChatbotClient from "./EmbedChatbotClient";
import { Bot } from "@/types/database";

export const dynamic = "force-dynamic";

interface EmbedPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EmbedPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: bot } = await (supabase.from("bots") as any)
    .select("name, description")
    .eq("id", id)
    .single();

  return {
    title: bot?.name ? `${bot.name} | ChatMolded Widget` : "ChatMolded Widget",
    description: bot?.description || "Interactive AI Chatbot powered by ChatMolded",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: rawBot, error } = await (supabase.from("bots") as any)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !rawBot) {
    notFound();
  }

  const bot = rawBot as Bot;

  return <EmbedChatbotClient bot={bot} />;
}
