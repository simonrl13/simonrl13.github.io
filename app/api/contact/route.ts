import type { NextRequest } from "next/server";
import { fill, getBundle } from "@/content/i18n";
import { CONTACT_FIELDS } from "@/content/services";
import { createLimiter } from "@/lib/rate-limit";
import { ALLOWED_ORIGINS } from "../chat/config";

/* Contact form → one email to Simon via Resend (plain HTTPS, no SDK).
   Nothing is stored: the message exists only in this request and in the
   delivered email. Nothing from the visitor is ever logged.

   Env (Vercel, Production): RESEND_API_KEY, CONTACT_TO, CONTACT_FROM.
   CONTACT_TO is never written anywhere in the repo or sent to the client. */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8_192;
const SUBJECT_PREFIX = "[simonlaborde.com]";

// spam control: a person sends one or two messages; bots get cut off fast
const checkRateLimit = createLimiter({
  name: "contact",
  perIp: 3,
  perIpWindowMinutes: 60,
  dailyCap: 20,
  redisTimeoutMs: 2000,
});

// pragmatic shape check (the real proof is a reply); no whitespace, quotes or brackets
const EMAIL = /^[^\s@"'<>()[\]\\,;:]+@[^\s@"'<>()[\]\\,;:]+\.[^\s@"'<>()[\]\\,;:]{2,}$/;

function text(body: string, status: number) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

/** Single-line field: control characters (incl. CR/LF) collapsed to spaces. */
function oneLine(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
}

type Contact = { name: string; business: string; email: string; message: string };

/** Validated, normalized fields — or null if anything is off. */
function parseContact(body: Record<string, unknown>): Contact | null {
  const { name, business, email, message } = body;
  if (![name, business, email, message].every((v) => typeof v === "string")) return null;
  const c = {
    name: oneLine(name as string),
    business: oneLine(business as string),
    email: oneLine(email as string),
    message: (message as string).replace(/\r\n?/g, "\n").trim(),
  };
  if (!c.name || c.name.length > CONTACT_FIELDS.name) return null;
  if (!c.business || c.business.length > CONTACT_FIELDS.business) return null;
  if (c.email.length > CONTACT_FIELDS.email || !EMAIL.test(c.email)) return null;
  if (c.message.length < CONTACT_FIELDS.messageMin || c.message.length > CONTACT_FIELDS.message) return null;
  return c;
}

function clientIp(req: NextRequest): string {
  // Vercel sets x-forwarded-for itself (client-supplied values are overwritten)
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // 0. same-site browsers only: the form always sends an allowed Origin
  const origin = req.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return text("Forbidden origin.", 403);

  // 1. size → JSON → shape, before anything else
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return text("Request too large.", 413);
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return text("Bad request.", 400);
  }
  if (raw.length > MAX_BODY_BYTES) return text("Request too large.", 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return text("Bad request.", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return text("Bad request.", 400);
  const b = body as Record<string, unknown>;

  const locale = typeof b.locale === "string" ? b.locale : "";
  const copy = getBundle(locale).services;
  const say = (key: keyof typeof copy.server) => fill(copy.server[key]);

  // 2. honeypot: pretend success, send nothing, spend no limit
  if (typeof b.website === "string" && b.website.trim() !== "") return text("ok", 200);

  const contact = parseContact(b);
  if (!contact) return text(say("invalid"), 400);
  if (b.consent !== true) return text(say("consent"), 400);

  // 3. per-IP + daily cap (fails closed)
  const limit = await checkRateLimit(clientIp(req));
  if (!limit.allowed) {
    return new Response(say(limit.scope), {
      status: limit.scope === "unavailable" ? 503 : 429,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "retry-after": String(limit.retryAfterSeconds),
      },
    });
  }

  // 4. delivery
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !to || !from) {
    console.error("contact: RESEND_API_KEY / CONTACT_TO / CONTACT_FROM not set");
    return text(say("notConfigured"), 503);
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: contact.email,
        subject: `${SUBJECT_PREFIX} ${contact.business} — ${contact.name}`.slice(0, 200),
        text: [
          `Name: ${contact.name}`,
          `Business: ${contact.business}`,
          `Email: ${contact.email}`,
          `Page language: ${getBundle(locale).locale}`,
          "",
          contact.message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("contact: Resend responded", res.status); // status only, never the payload
      return text(fill(copy.form.failed), 502);
    }
  } catch (err) {
    console.error("contact: Resend request failed:", err instanceof Error ? err.name : "unknown");
    return text(fill(copy.form.failed), 502);
  }

  return text("ok", 200);
}
