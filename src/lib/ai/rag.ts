import { createClient } from "@/lib/supabase/server";
import { OpenAI } from "openai";

export interface RetrievedChunk {
  content: string;
  similarity?: number;
  fileName?: string;
}

/**
 * Retrieves top relevant knowledge chunks for a bot query
 */
export async function retrieveRelevantKnowledge(
  botId: string,
  query: string,
  apiKey?: string,
  provider?: string
): Promise<string> {
  const supabase = await createClient();

  // 1. Fetch all chunks for this bot
  const { data: chunks, error } = await (supabase.from("document_chunks") as any)
    .select("content, token_count, chunk_index")
    .eq("bot_id", botId)
    .order("chunk_index", { ascending: true })
    .limit(20);

  if (error || !chunks || chunks.length === 0) {
    return "";
  }

  const typedChunks = chunks as { content: string; token_count?: number; chunk_index?: number }[];

  // 2. If total content is compact (< 8,000 chars), feed all chunks for maximum recall
  const totalLength = typedChunks.reduce((acc, c) => acc + c.content.length, 0);
  if (totalLength < 8000) {
    return typedChunks.map((c) => c.content).join("\n\n---\n\n");
  }

  // 3. If OpenAI key is available, attempt vector similarity search
  if (provider === "openai" && apiKey && apiKey.startsWith("sk-")) {
    try {
      const openai = new OpenAI({ apiKey });
      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
      });

      const vector = embeddingRes.data[0].embedding;

      const { data: matchedChunks } = await (supabase.rpc as any)(
        "match_document_chunks",
        {
          query_embedding: vector,
          target_bot_id: botId,
          match_threshold: 0.3,
          match_count: 4,
        }
      );

      if (matchedChunks && matchedChunks.length > 0) {
        return (matchedChunks as any[]).map((c: any) => c.content).join("\n\n---\n\n");
      }
    } catch (err) {
      console.warn("Vector search fallback to keyword ranking:", err);
    }
  }

  // 4. Keyword relevance scoring fallback (Ultra-fast, zero extra API cost)
  const queryTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scoredChunks = typedChunks.map((c) => {
    const text = c.content.toLowerCase();
    let score = 0;
    queryTerms.forEach((term) => {
      if (text.includes(term)) score += 1;
    });
    return { content: c.content, score };
  });

  // Sort by score descending and take top 4 most relevant chunks to preserve token quota
  scoredChunks.sort((a, b) => b.score - a.score);
  const selected = scoredChunks.slice(0, 4).filter((c) => c.score > 0 || scoredChunks.length <= 2);

  return (selected.length > 0 ? selected : typedChunks.slice(0, 3))
    .map((c) => c.content)
    .join("\n\n---\n\n");
}

export function buildAugmentedSystemPrompt(
  baseSystemPrompt: string,
  knowledgeContext: string
): string {
  if (!knowledgeContext.trim()) {
    return `${baseSystemPrompt}\n\nIMPORTANT: Be concise, clear, and direct. Keep your answers under 2-3 short paragraphs unless the user specifically asks for deep detail.`;
  }

  return `${baseSystemPrompt}

==================================================
KNOWLEDGE BASE CONTEXT (USE THIS TO ANSWER QUESTIONS):
==================================================
${knowledgeContext}
==================================================

RESPONSE GUIDELINES & TOKEN CONSTRAINTS:
1. Answer the visitor's question accurately and concisely using ONLY the provided Knowledge Base Context above.
2. NO ROBOTIC PREAMBLES: NEVER start responses with phrases like "Based on the provided context...", "According to the knowledge base...", "Based on the resume...", or "Here are...". Jump directly into the answer in a natural, conversational voice.
3. CONCISENESS & SPEED: Keep answers crisp, structured, and direct (use bullet points or 1-2 brief paragraphs). Avoid unnecessary conversational filler.
4. If the answer cannot be determined or inferred from the context, politely state: "I don't have that information in my current knowledge base."
5. Do not fabricate facts, contact details, or experience not present in the context.`;
}
