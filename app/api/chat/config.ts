/* Model and limits for the chat endpoint, in one place. Limits can be
   tuned per environment in Vercel without a code change; anything missing
   or malformed falls back to the default. */

function positiveInt(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export const CHAT_MODEL = "claude-haiku-5-5";

export const CHAT_LIMITS = {
  // Haiku 5.5 thinks by default and thinking counts toward max_tokens, so the
  // cap covers reasoning + a 2-4 sentence answer; effort "low" keeps it short
  maxOutputTokens: 1500,
  effort: "low" as const,
  checkMaxTokens: 2000, // grounding-check verdict (app/api/chat/grounding.ts)
  maxHistory: 8, // user + assistant turns kept from the client
  maxMessageChars: 800,
  maxBodyBytes: 16_384, // 8 × 800 chars of JSON fits comfortably

  perIp: positiveInt("CHAT_PER_IP_LIMIT", 8),
  perIpWindowMinutes: positiveInt("CHAT_PER_IP_WINDOW_MINUTES", 10),
  // each request = up to 2 drafts + 2 grounding checks on Haiku 5.5
  // ($0.10 / $0.50 per MTok); measured cost per answer is in SECURITY.md
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
