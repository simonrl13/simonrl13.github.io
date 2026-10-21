/* One question to the live chat after every production deploy: it only
   checks that the chat returns a real answer — not a 5xx, not the safe
   fallback. No judge, no key: it calls the public endpoint like a visitor
   (one chat request, inside the per-IP and daily limits). The full suite is
   scripts/redteam.mjs.
   Usage: node scripts/chat-smoke.mjs [baseUrl]   (default https://www.simonlaborde.com) */

import { pathToFileURL } from "node:url";

// the safe answer sent when no draft passes the grounding check (EN / PT)
export const FALLBACK = /an answer I can stand behind|uma resposta confiável/i;

const QUESTION = "What does Simon work on?";

async function main() {
  const base = (process.argv[2] || "https://www.simonlaborde.com").replace(/\/$/, "");
  const res = await fetch(`${base}/api/chat/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: QUESTION }] }),
    signal: AbortSignal.timeout(120_000),
  });
  const answer = (await res.text()).trim();
  const problem =
    res.status >= 500 ? `HTTP ${res.status} (no model answer)` :
    !res.ok ? `HTTP ${res.status}` :
    FALLBACK.test(answer) ? "the safe fallback instead of an answer" :
    answer.length < 40 ? "an answer too short to be real" : "";
  console.log(`Q: ${QUESTION}\nA: ${answer}`);
  console.log(problem ? `chat-smoke: FAIL — ${problem} (${base})` : `chat-smoke: pass (HTTP ${res.status}, ${base})`);
  process.exit(problem ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.log(`chat-smoke: FAIL — no response: ${err?.cause?.code ?? err}`);
    process.exit(1);
  });
}
