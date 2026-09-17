import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/content/assistant-context";
import { checkRateLimit } from "./rate-limit";

export const runtime = "nodejs";

const MODEL = "claude-haiku-4-5";
const MAX_OUTPUT_TOKENS = 500;
const MAX_HISTORY = 8; // user+assistant turns kept from the client
const MAX_MESSAGE_CHARS = 800;

type IncomingMessage = { role: "user" | "assistant"; content: string };

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function sanitize(messages: unknown): Anthropic.MessageParam[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m): m is IncomingMessage =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_MESSAGE_CHARS),
    }));
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(clientIp(req));
  if (!rl.allowed) {
    return new Response(
      "This assistant is taking a short breather — try again in a few minutes, or email simonrl865@gmail.com directly.",
      {
        status: 429,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "retry-after": String(rl.retryAfterSeconds ?? 600),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request.", { status: 400 });
  }

  const messages = sanitize(
    body && typeof body === "object" ? (body as { messages?: unknown }).messages : undefined,
  );
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return new Response("Bad request.", { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("chat: ANTHROPIC_API_KEY is not set");
    return new Response(
      "This assistant isn't configured yet. Email simonrl865@gmail.com in the meantime.",
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_OUTPUT_TOKENS,
          system: buildSystemPrompt(),
          messages,
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("chat stream error:", err);
        const message =
          err instanceof Anthropic.RateLimitError
            ? "The assistant is in high demand right now — please try again shortly."
            : "Something went wrong answering that. Please try again, or email simonrl865@gmail.com.";
        controller.enqueue(encoder.encode(message));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
