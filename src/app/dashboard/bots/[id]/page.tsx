import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import BotStudioClient from "./BotStudioClient";

interface BotStudioPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BotStudioPage({ params }: BotStudioPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch bot belonging to this user
  const { data: bot, error: botError } = await supabase
    .from("bots")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (botError || !bot) {
    notFound();
  }

  // 2. Fetch documents for this bot
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("bot_id", id)
    .order("created_at", { ascending: false });

  return (
    <BotStudioClient
      initialBot={bot}
      initialDocuments={documents || []}
    />
  );
}
