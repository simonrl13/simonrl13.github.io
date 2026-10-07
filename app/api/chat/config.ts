/* Model and limits for the chat endpoint, in one place. Limits can be
   tuned per environment in Vercel without a code change; anything missing
   or malformed falls back to the default. */

function positiveInt(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export const CHAT_MODEL = "claude-haiku-4-5";

export const CHAT_LIMITS = {
  maxOutputTokens: 500,
  maxHistory: 8, // user + assistant turns kept from the client
  maxMessageChars: 800,
  maxBodyBytes: 16_384, // 8 × 800 chars of JSON fits comfortably

  perIp: positiveInt("CHAT_PER_IP_LIMIT", 8),
  perIpWindowMinutes: positiveInt("CHAT_PER_IP_WINDOW_MINUTES", 10),
  // worst case ≈ $0.007/request on Haiku 4.5 → 200/day ≈ $1.40/day ceiling
  dailyCap: positiveInt("CHAT_DAILY_CAP", 200),
  redisTimeoutMs: 2000,
} as const;

/* Browser origins allowed to call the chat. Production accepts only the
   site itself; localhost is allowed everywhere else (dev, CI smoke). A
   request with a foreign Origin header is refused before anything runs;
   requests without one (curl, server-side) are bounded by the rate limits. */
export const ALLOWED_ORIGINS: readonly string[] = [
  "https://www.simonlaborde.com",
  "https://simonlaborde.com",
  ...(process.env.VERCEL_ENV === "production"
    ? []
    : ["http://localhost:3000", "http://127.0.0.1:3000"]),
];
