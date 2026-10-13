/* Rate limits for the public endpoints (/api/chat, /api/contact).

   Each limiter has two limits, both checked before any work is done:
   - per IP: a sliding window (e.g. chat: 8 requests / 10 minutes)
   - global: a fixed daily cap across all visitors (e.g. chat: 200 / UTC day)

   They live in Upstash Redis so every serverless instance shares one count.
   For the chat, the Anthropic Console spend limit on the dedicated
   "portfolio" workspace stays as the backstop behind both.

   Failure policy:
   - Redis configured but erroring or slow → deny (fail closed): an outage
     must never turn into unlimited spend or unlimited email.
   - Redis not configured (local dev, CI, preview without the integration) →
     per-instance in-memory counters, logged loudly so a misconfigured
     production deploy shows up in the Vercel logs.

   Privacy: the per-IP key holds the raw IP for at most the window length
   (Redis TTL); the daily key holds no visitor data. No analytics. */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type LimitResult =
  | { allowed: true }
  | { allowed: false; scope: "ip" | "global" | "unavailable"; retryAfterSeconds: number };

export type LimitConfig = {
  /** Redis key prefix: `<name>:ip`, `<name>:day` */
  name: string;
  perIp: number;
  perIpWindowMinutes: number;
  dailyCap: number;
  redisTimeoutMs: number;
};

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

if (!redis && process.env.VERCEL_ENV === "production") {
  console.error(
    "rate-limit: Upstash Redis is not configured (UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN) — falling back to per-instance limits",
  );
}

const secondsUntil = (resetMs: number) =>
  Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));

const unavailable = (): LimitResult => ({ allowed: false, scope: "unavailable", retryAfterSeconds: 60 });

/** A per-IP + daily limiter; returns the check function. */
export function createLimiter(cfg: LimitConfig): (ip: string) => Promise<LimitResult> {
  if (!redis) return memoryLimiter(cfg);

  const ipLimit = new Ratelimit({
    redis,
    prefix: `${cfg.name}:ip`,
    limiter: Ratelimit.slidingWindow(cfg.perIp, `${cfg.perIpWindowMinutes} m`),
    timeout: cfg.redisTimeoutMs,
    analytics: false,
  });
  const dayLimit = new Ratelimit({
    redis,
    prefix: `${cfg.name}:day`,
    limiter: Ratelimit.fixedWindow(cfg.dailyCap, "1 d"),
    timeout: cfg.redisTimeoutMs,
    analytics: false,
  });

  return async (ip) => {
    try {
      const perIp = await ipLimit.limit(ip);
      // the library *allows* on timeout; we don't
      if (perIp.reason === "timeout") return unavailable();
      if (!perIp.success) {
        return { allowed: false, scope: "ip", retryAfterSeconds: secondsUntil(perIp.reset) };
      }

      const day = await dayLimit.limit("all");
      if (day.reason === "timeout") return unavailable();
      if (!day.success) {
        return { allowed: false, scope: "global", retryAfterSeconds: secondsUntil(day.reset) };
      }
      return { allowed: true };
    } catch (err) {
      console.error(`${cfg.name}: rate limiter unavailable:`, err);
      return unavailable();
    }
  };
}

/* ---- fallback: per-instance memory (no Redis configured) ---- */

const MAX_TRACKED_KEYS = 5000;

function memoryLimiter(cfg: LimitConfig): (ip: string) => Promise<LimitResult> {
  const windowMs = cfg.perIpWindowMinutes * 60 * 1000;
  const hits = new Map<string, number[]>();
  let day = { key: "", count: 0 };

  return async (ip) => {
    const now = Date.now();

    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= cfg.perIp) {
      return {
        allowed: false,
        scope: "ip",
        retryAfterSeconds: Math.ceil((windowMs - (now - recent[0])) / 1000),
      };
    }

    const today = new Date(now).toISOString().slice(0, 10);
    if (day.key !== today) day = { key: today, count: 0 };
    if (day.count >= cfg.dailyCap) {
      const midnight = Date.parse(`${today}T00:00:00Z`) + 86_400_000;
      return { allowed: false, scope: "global", retryAfterSeconds: secondsUntil(midnight) };
    }

    recent.push(now);
    hits.set(ip, recent);
    day.count++;

    if (hits.size > MAX_TRACKED_KEYS) {
      for (const [k, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(k);
      }
    }
    return { allowed: true };
  };
}
