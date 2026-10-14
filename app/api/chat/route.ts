import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";
import { fill, getBundle } from "@/content/i18n";
import { createLimiter } from "@/lib/rate-limit";
import { ALLOWED_ORIGINS, CHAT_LIMITS } from "./config";
import { answer } from "./grounding";

export const runtime = "nodejs";

const checkRateLimit = createLimiter({ name: "chat", ...CHAT_LIMITS });

type IncomingMessage = { role: "user" | "assistant"; content: string };

/** Server messages in the visitor's language; an unknown or missing locale
 * gets English (getBundle validates it against content/locales.json). */
function serverCopy(body: unknown) {
  const locale = body && typeof body === "object" ? (body as { locale?: unknown }).locale : undefined;
  const t = getBundle(typeof locale === "string" ? locale : "").ui.chatServer;
  return (key: keyof typeof t) => fill(t[key]);
}

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

/* CORS: an explicit allow-list. Allowed origins get their own origin echoed
   back (never `*`); anything else gets 403 and no CORS headers, so a browser
   on another site can neither preflight nor read the response. */
function corsHeaders(origin: string): Record<string, string> {
  return { "access-control-allow-origin": origin, vary: "Origin" };
}

function originCheck(req: NextRequest): { ok: true; cors: Record<string, string> } | { ok: false } {
  const origin = req.headers.get("origin");
  if (!origin) return { ok: true, cors: { vary: "Origin" } };
  return ALLOWED_ORIGINS.includes(origin) ? { ok: true, cors: corsHeaders(origin) } : { ok: false };
}

export function OPTIONS(req: NextRequest) {
  const check = originCheck(req);
  if (!check.ok) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 204,
    headers: {
      ...check.cors,
      "access-control-allow-methods": "POST",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "600",
    },
  });
}

export async function POST(req: NextRequest) {
  // 0. origin allow-list — before reading the body
  const check = originCheck(req);
  if (!check.ok) return text("Forbidden origin.", 403);
  const res = await handle(req);
  for (const [k, v] of Object.entries(check.cors)) res.headers.set(k, v);
  return res;
}

async function handle(req: NextRequest): Promise<Response> {
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
  const say = serverCopy(body);

  // 2. spend controls — per-IP window, then the global daily cap
  const limit = await checkRateLimit(clientIp(req));
  if (!limit.allowed) {
    return text(say(limit.scope), limit.scope === "unavailable" ? 503 : 429, {
      "retry-after": String(limit.retryAfterSeconds),
    });
  }

  // 3. the model call
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("chat: ANTHROPIC_API_KEY is not set");
    return text(say("notConfigured"), 500);
  }

  // 4. draft → grounding check → (one redraft) → send; never stream an
  // unchecked answer. Fail-closed: anything unverified gets the safe answer.
  const client = new Anthropic({ apiKey, timeout: 20_000, maxRetries: 1 });
  let reply: string;
  try {
    reply = (await answer(client, messages)) ?? say("unverified");
  } catch (err) {
    console.error("chat: model error:", err instanceof Error ? err.name : "unknown");
    return text(err instanceof Anthropic.RateLimitError ? say("rateLimited") : say("streamError"), 503);
  }

  return new Response(reply, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
