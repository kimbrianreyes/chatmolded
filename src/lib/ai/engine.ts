import { OpenAI } from "openai";
import Groq from "groq-sdk";
import Anthropic from "@anthropic-ai/sdk";
import { AIProvider } from "@/types/database";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamCompletionOptions {
  provider: AIProvider;
  model: string;
  apiKey: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  customBaseUrl?: string;
}

/**
 * Auto-detects the provider from the API key prefix if there's a mismatch
 */
export function detectProviderFromKey(apiKey: string, selectedProvider: AIProvider): AIProvider {
  const trimmed = apiKey.trim();
  if (trimmed.startsWith("xai-")) return "xai";
  if (trimmed.startsWith("gsk_")) return "groq";
  if (trimmed.startsWith("sk-ant-")) return "anthropic";
  if (trimmed.startsWith("AIza")) return "gemini";
  if (trimmed.startsWith("sk-or-")) return "openrouter";
  return selectedProvider;
}

/**
 * Sanitizes model string to ensure it matches the selected provider's catalog
 */
export function sanitizeModelForProvider(provider: AIProvider, model: string): string {
  const m = (model || "").toLowerCase().trim();

  switch (provider) {
    case "xai":
      return m.startsWith("grok") ? model : "grok-beta";

    case "groq":
      if (m.startsWith("llama") || m.startsWith("mixtral") || m.startsWith("gemma")) return model;
      return "llama-3.1-8b-instant";

    case "openai":
      if (m.startsWith("gpt") || m.startsWith("o1") || m.startsWith("o3") || m.startsWith("text-")) return model;
      return "gpt-4o-mini";

    case "deepseek":
      if (m.startsWith("deepseek")) return model;
      return "deepseek-chat";

    case "openrouter":
      return model || "meta-llama/llama-3.3-70b-instruct";

    case "anthropic":
      if (m.startsWith("claude")) return model;
      return "claude-3-5-haiku-20241022";

    case "gemini":
      if (m.startsWith("gemini")) return model;
      return "gemini-1.5-flash";

    default:
      return model || "gpt-4o-mini";
  }
}

/**
 * Creates a standard ReadableStream of text chunks across all LLM providers
 * with a hard token ceiling (default 450 tokens) to minimize cost and latency.
 */
export async function createCompletionStream({
  provider,
  model,
  apiKey,
  messages,
  temperature = 0.5,
  maxTokens = 450,
  customBaseUrl,
}: StreamCompletionOptions): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  
  // Auto-correct provider if API key prefix explicitly indicates a specific service
  const effectiveProvider = detectProviderFromKey(apiKey, provider);
  const effectiveModel = sanitizeModelForProvider(effectiveProvider, model);

  switch (effectiveProvider) {
    case "groq": {
      const groq = new Groq({ apiKey });
      const stream = await groq.chat.completions.create({
        model: effectiveModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    }

    case "xai": {
      // Elon Musk's xAI Grok (https://api.x.ai/v1)
      const openai = new OpenAI({
        apiKey,
        baseURL: "https://api.x.ai/v1",
      });

      const stream = await openai.chat.completions.create({
        model: effectiveModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    }

    case "deepseek": {
      // DeepSeek API (https://api.deepseek.com)
      const openai = new OpenAI({
        apiKey,
        baseURL: "https://api.deepseek.com",
      });

      const stream = await openai.chat.completions.create({
        model: effectiveModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    }

    case "openrouter": {
      // OpenRouter (https://openrouter.ai/api/v1) - Access 100+ AI models
      const openai = new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://chatmolded.app",
          "X-Title": "ChatMolded",
        },
      });

      const stream = await openai.chat.completions.create({
        model: effectiveModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    }

    case "custom": {
      // Custom OpenAI-compatible endpoint (Ollama, LMStudio, Together AI, Mistral, etc.)
      const openai = new OpenAI({
        apiKey,
        baseURL: customBaseUrl || "https://api.openai.com/v1",
      });

      const stream = await openai.chat.completions.create({
        model: effectiveModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    }

    case "openai": {
      const openai = new OpenAI({ apiKey });
      const stream = await openai.chat.completions.create({
        model: effectiveModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    }

    case "anthropic": {
      const anthropic = new Anthropic({ apiKey });
      const systemMessage = messages.find((m) => m.role === "system")?.content || "";
      const userAndAssistantMsgs = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      const stream = await anthropic.messages.stream({
        model: effectiveModel,
        max_tokens: maxTokens,
        system: systemMessage,
        messages: userAndAssistantMsgs,
        temperature,
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (
                chunk.type === "content_block_delta" &&
                chunk.delta.type === "text_delta"
              ) {
                controller.enqueue(encoder.encode(chunk.delta.text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    }

    case "gemini": {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${effectiveModel}:streamGenerateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: messages
              .filter((m) => m.role !== "system")
              .map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
              })),
            systemInstruction: {
              parts: [{ text: messages.find((m) => m.role === "system")?.content || "" }],
            },
            generationConfig: {
              temperature,
              maxOutputTokens: maxTokens,
            },
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      return new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const text = decoder.decode(value);
              try {
                const matches = text.match(/"text":\s*"((?:[^"\\]|\\.)*)"/g);
                if (matches) {
                  for (const match of matches) {
                    const parsed = JSON.parse(`{${match}}`);
                    if (parsed.text) controller.enqueue(encoder.encode(parsed.text));
                  }
                }
              } catch {
                controller.enqueue(value);
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
    }

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
