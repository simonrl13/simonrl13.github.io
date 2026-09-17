/* Best-effort per-IP rate limiting for the chat endpoint.
   In-memory, so it resets on cold start and isn't shared across serverless
   instances — it's a courtesy speed bump, not a hard guarantee. The real
   cost backstop is the per-key spend limit set in the Anthropic Console and
   the tight max_tokens cap on every request. If this ever needs to be a
   hard guarantee (e.g. traffic actually spikes), swap this module for
   Vercel KV / Upstash — same call shape, no caller changes needed. */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 8;
const MAX_TRACKED_KEYS = 5000;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return { allowed: true };
}
