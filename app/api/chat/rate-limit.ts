/* Spend controls for the chat endpoint.

   Two limits, both checked before any model call:
   - per IP: a sliding window (default 8 requests / 10 minutes)
   - global: a fixed daily cap across all visitors (default 200 / UTC day)

   They live in Upstash Redis so every serverless instance shares one count.
   The Anthropic Console spend limit on the dedicated "portfolio" workspace
   stays as the backstop behind both.

   Failure policy:
   - Redis configured but erroring or slow → deny (fail closed): an outage
     must never turn into unlimited spend.
   - Redis not configured (local dev, CI, preview without the integration) →
     per-instance in-memory counters, logged loudly so a misconfigured
     production deploy shows up in the Vercel logs.

   Privacy: the per-IP key holds the raw IP for at most the window length
   (Redis TTL); the daily key holds no visitor data. No analytics. */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { CHAT_LIMITS } from "./config";

export type LimitResult =
  | { allowed: true }
  | { allowed: false; scope: "ip" | "global" | "unavailable"; retryAfterSeconds: number };

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

const durable = redis
  ? {
      ip: new Ratelimit({
        redis,
        prefix: "chat:ip",
        limiter: Ratelimit.slidingWindow(CHAT_LIMITS.perIp, `${CHAT_LIMITS.perIpWindowMinutes} m`),
        timeout: CHAT_LIMITS.redisTimeoutMs,
        analytics: false,
      }),
      global: new Ratelimit({
        redis,
        prefix: "chat:day",
        limiter: Ratelimit.fixedWindow(CHAT_LIMITS.dailyCap, "1 d"),
        timeout: CHAT_LIMITS.redisTimeoutMs,
        analytics: false,
      }),
    }
  : null;

if (!durable && process.env.VERCEL_ENV === "production") {
  console.error(
    "chat: Upstash Redis is not configured (UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN) — falling back to per-instance limits",
  );
}

const secondsUntil = (resetMs: number) =>
  Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));

export async function checkRateLimit(ip: string): Promise<LimitResult> {
  if (!durable) return memoryLimit(ip);

  try {
    const perIp = await durable.ip.limit(ip);
    // the library *allows* on timeout; we don't
    if (perIp.reason === "timeout") return unavailable();
    if (!perIp.success) {
      return { allowed: false, scope: "ip", retryAfterSeconds: secondsUntil(perIp.reset) };
    }

    const day = await durable.global.limit("all");
    if (day.reason === "timeout") return unavailable();
    if (!day.success) {
      return { allowed: false, scope: "global", retryAfterSeconds: secondsUntil(day.reset) };
    }
    return { allowed: true };
  } catch (err) {
    console.error("chat: rate limiter unavailable:", err);
    return unavailable();
  }
}

function unavailable(): LimitResult {
  return { allowed: false, scope: "unavailable", retryAfterSeconds: 60 };
}

/* ---- fallback: per-instance memory (no Redis configured) ---- */

const WINDOW_MS = CHAT_LIMITS.perIpWindowMinutes * 60 * 1000;
const MAX_TRACKED_KEYS = 5000;
const hits = new Map<string, number[]>();
let day = { key: "", count: 0 };

function memoryLimit(ip: string): LimitResult {
  const now = Date.now();

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= CHAT_LIMITS.perIp) {
    return {
      allowed: false,
      scope: "ip",
      retryAfterSeconds: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000),
    };
  }

  const today = new Date(now).toISOString().slice(0, 10);
  if (day.key !== today) day = { key: today, count: 0 };
  if (day.count >= CHAT_LIMITS.dailyCap) {
    const midnight = Date.parse(`${today}T00:00:00Z`) + 86_400_000;
    return { allowed: false, scope: "global", retryAfterSeconds: secondsUntil(midnight) };
  }

  recent.push(now);
  hits.set(ip, recent);
  day.count++;

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return { allowed: true };
}
