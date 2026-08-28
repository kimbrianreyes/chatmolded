"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { BotTheme, AIProvider } from "@/types/database";

export interface UpdateBotPayload {
  name: string;
  description?: string | null;
  system_prompt?: string | null;
  welcome_message: string;
  sample_questions: string[];
  theme: BotTheme;
  avatar_url?: string | null;
  position: string;
  allowed_origins: string[];
  provider: AIProvider;
  model: string;
  api_key_encrypted?: string | null;
  rate_limit_per_minute?: number;
  is_active: boolean;
}

export async function updateBotAction(botId: string, payload: UpdateBotPayload) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await (supabase.from("bots") as any)
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", botId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/bots/${botId}`);
  revalidatePath("/dashboard");
  return data;
}

export async function addTextDocumentAction(
  botId: string,
  title: string,
  content: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 1. Verify user owns this bot
  const { data: bot } = await supabase
    .from("bots")
    .select("id")
    .eq("id", botId)
    .eq("user_id", user.id)
    .single();

  if (!bot) {
    throw new Error("Bot not found or unauthorized");
  }

  // 2. Insert document record
  const { data: doc, error: docError } = await (supabase.from("documents") as any)
    .insert({
      bot_id: botId,
      file_name: title || "Direct Text Knowledge",
      file_type: "txt",
      file_size_bytes: Buffer.byteLength(content, "utf8"),
      status: "indexed",
      chunk_count: 1,
    })
    .select()
    .single();

  if (docError) {
    throw new Error(docError.message);
  }

  // 3. Insert chunk record (without embedding for now until Phase 3 ingestion pipeline)
  const { error: chunkError } = await (supabase.from("document_chunks") as any).insert({
    bot_id: botId,
    document_id: doc.id,
    content: content,
    token_count: Math.ceil(content.length / 4),
    chunk_index: 0,
  });

  if (chunkError) {
    throw new Error(chunkError.message);
  }

  revalidatePath(`/dashboard/bots/${botId}`);
  return doc;
}

export async function deleteDocumentAction(docId: string, botId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership via bot
  const { data: bot } = await supabase
    .from("bots")
    .select("id")
    .eq("id", botId)
    .eq("user_id", user.id)
    .single();

  if (!bot) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", docId)
    .eq("bot_id", botId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/bots/${botId}`);
}
