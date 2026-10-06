import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/content/assistant-context";
import { site } from "@/content/site";
import { checkRateLimit, type LimitResult } from "./rate-limit";
import { CHAT_LIMITS, CHAT_MODEL } from "./config";

export const runtime = "nodejs";

type IncomingMessage = { role: "user" | "assistant"; content: string };
type BlockedScope = Extract<LimitResult, { allowed: false }>["scope"];

const email = site.links.email;

const LIMIT_MESSAGES: Record<BlockedScope, string> = {
  ip: `That's a lot of questions in a short time — try again in a few minutes, or email ${email} directly.`,
  global: `The assistant has reached today's limit — it resets at midnight UTC. In the meantime, email ${email}.`,
  unavailable: `The assistant is briefly unavailable — please try again shortly, or email ${email}.`,
};

function text(body: string, status: number, headers: Record<string, string> = {}) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function clientIp(req: NextRequest): string {
  // Vercel sets x-forwarded-for itself (client-supplied values are overwritten)
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
    .slice(-CHAT_LIMITS.maxHistory)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, CHAT_LIMITS.maxMessageChars),
    }));
}

export async function POST(req: NextRequest) {
  // 1. cheap validation first — malformed requests never touch the limits
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > CHAT_LIMITS.maxBodyBytes) return text("Request too large.", 413);

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return text("Bad request.", 400);
  }
  if (raw.length > CHAT_LIMITS.maxBodyBytes) return text("Request too large.", 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return text("Bad request.", 400);
  }

  const messages = sanitize(
    body && typeof body === "object" ? (body as { messages?: unknown }).messages : undefined,
  );
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return text("Bad request.", 400);
  }

  // 2. spend controls — per-IP window, then the global daily cap
  const limit = await checkRateLimit(clientIp(req));
  if (!limit.allowed) {
    return text(LIMIT_MESSAGES[limit.scope], limit.scope === "unavailable" ? 503 : 429, {
      "retry-after": String(limit.retryAfterSeconds),
    });
  }

  // 3. the model call
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("chat: ANTHROPIC_API_KEY is not set");
    return text(`This assistant isn't configured yet. Email ${email} in the meantime.`, 500);
  }

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: CHAT_MODEL,
          max_tokens: CHAT_LIMITS.maxOutputTokens,
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
            : `Something went wrong answering that. Please try again, or email ${email}.`;
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
