import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { retrieveRelevantKnowledge, buildAugmentedSystemPrompt } from "@/lib/ai/rag";
import { createCompletionStream, ChatMessage } from "@/lib/ai/engine";
import { Bot } from "@/types/database";

// Visitor rate limiting map (IP -> timestamps array)
const visitorRateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 25;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkVisitorRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = visitorRateLimitMap.get(ip) || [];
  const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (valid.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  valid.push(now);
  visitorRateLimitMap.set(ip, valid);
  return true;
}

// CORS Headers helper
function setCorsHeaders(response: Response, origin: string | null, allowedOrigins: string[]): Response {
  const isAllowed =
    allowedOrigins.includes("*") ||
    (origin && allowedOrigins.some((ao: string) => ao.toLowerCase() === origin.toLowerCase()));

  if (isAllowed && origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");
  } else if (allowedOrigins.includes("*")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
  }

  return response;
}

// OPTIONS pre-flight handler for CORS in embedded widgets
export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: botId } = await params;
  const origin = request.headers.get("origin");

  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response, origin, ["*"]);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get("origin") || request.headers.get("referer");

  try {
    const { id: botId } = await params;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // 1. Enforce Rate Limiting
    if (!checkVisitorRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before sending more messages." },
        { status: 429 }
      );
    }

    const supabase = await createClient();

    // 2. Fetch Bot Configuration
    const { data: rawBot, error: botError } = await (supabase.from("bots") as any)
      .select("*")
      .eq("id", botId)
      .single();

    if (botError || !rawBot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const bot = rawBot as Bot;

    if (!bot.is_active) {
      return NextResponse.json({ error: "This chatbot is currently disabled by its owner." }, { status: 403 });
    }

    // 3. Security: Domain Whitelist Check
    const allowedOrigins = bot.allowed_origins && bot.allowed_origins.length > 0 ? bot.allowed_origins : ["*"];
    if (!allowedOrigins.includes("*") && origin) {
      const originHost = new URL(origin).origin.toLowerCase();
      const isPermitted = allowedOrigins.some((ao: string) => {
        try {
          return new URL(ao).origin.toLowerCase() === originHost;
        } catch {
          return ao.toLowerCase() === originHost;
        }
      });

      if (!isPermitted) {
        return NextResponse.json(
          { error: `Domain ${originHost} is not whitelisted to embed this bot.` },
          { status: 403 }
        );
      }
    }

    // 4. Parse Incoming Messages & Optional Dynamic API Key (from Studio test mode)
    const body = await request.json();
    const incomingMessages: { role: "user" | "assistant"; content: string }[] = body.messages || [];
    const clientProvidedKey = request.headers.get("x-api-key") || body.apiKey;

    if (incomingMessages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const userQuery = incomingMessages[incomingMessages.length - 1].content;
    const effectiveApiKey = clientProvidedKey || bot.api_key_encrypted;

    // 5. Check if BYOK API key is configured
    if (!effectiveApiKey) {
      // Return a simulated guidance message when no key is set yet
      const stream = new ReadableStream({
        start(controller) {
          const textEncoder = new TextEncoder();
          const guidance =
            `[BYOK Notice]: No ${bot.provider.toUpperCase()} API key has been added for "${bot.name}" yet.\n\n` +
            `To enable real AI streaming completions:\n` +
            `1. Open your Bot Studio -> "AI Engine" tab.\n` +
            `2. Paste your free ${bot.provider.toUpperCase()} API key.\n` +
            `3. Click "Save Changes".`;
          controller.enqueue(textEncoder.encode(guidance));
          controller.close();
        },
      });

      const response = new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
      return setCorsHeaders(response, origin, allowedOrigins);
    }

    // 6. RAG: Retrieve Relevant Knowledge Chunks
    const knowledgeContext = await retrieveRelevantKnowledge(
      bot.id,
      userQuery,
      effectiveApiKey,
      bot.provider
    );

    // 7. Compose Augmented System Prompt
    const basePrompt =
      bot.system_prompt ||
      `You are ${bot.name}, a helpful AI assistant for this website. Answer questions based on the knowledge provided.`;

    const augmentedPrompt = buildAugmentedSystemPrompt(basePrompt, knowledgeContext);

    // 8. Prepare Messages Array
    const messagesPayload: ChatMessage[] = [
      { role: "system", content: augmentedPrompt },
      ...incomingMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // 9. Dispatch to Streaming Engine
    const effectiveProvider = body.provider || bot.provider;
    const effectiveModel = body.model || bot.model;

    const stream = await createCompletionStream({
      provider: effectiveProvider,
      model: effectiveModel,
      apiKey: effectiveApiKey,
      messages: messagesPayload,
      temperature: 0.5,
      customBaseUrl: body.customBaseUrl,
    });

    const response = new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });

    return setCorsHeaders(response, origin, allowedOrigins);
  } catch (error: any) {
    console.error("Chat completion API error:", error);
    const errorResponse = NextResponse.json(
      { error: error.message || "Failed to generate AI completion" },
      { status: 500 }
    );
    return setCorsHeaders(errorResponse, origin, ["*"]);
  }
}
