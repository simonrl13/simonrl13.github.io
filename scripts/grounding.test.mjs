/* Unit test for the chat's grounding check (app/api/chat/grounding.ts).
   Run: npm test. No network, no API key: the Anthropic client is a fake.

   A checker verdict that can't be read (malformed JSON, or an empty reply)
   must log `parse_error` for each attempt, never pass the draft, and end in
   the safe fallback (answer() returns null; the route then sends the
   localized "ask Simon directly" message). */

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

// compile the real module (and its imports) with the project's TypeScript,
// inside node_modules/.cache so it resolves the project's packages
mkdirSync(path.join("node_modules", ".cache"), { recursive: true });
const out = mkdtempSync(path.join("node_modules", ".cache", "grounding-test-"));
execFileSync(process.execPath, [path.join("node_modules", "typescript", "bin", "tsc"), "app/api/chat/grounding.ts", "--rootDir", ".", "--outDir", out, "--module", "commonjs", "--target", "es2022", "--resolveJsonModule", "--esModuleInterop", "--skipLibCheck"], { stdio: "inherit" });
const { answer } = createRequire(import.meta.url)(path.resolve(out, "app", "api", "chat", "grounding.js"));
rmSync(out, { recursive: true, force: true });

const text = (t) => [{ type: "text", text: t }];

/** A fake client: drafts succeed; every checker call (the request with a
 * JSON-schema format) returns `verdictContent`. */
function fakeClient(verdictContent) {
  return {
    messages: {
      create: async (req) =>
        req.output_config?.format
          ? { stop_reason: "end_turn", content: verdictContent }
          : { stop_reason: "end_turn", content: text("Simon is a backend engineer.") },
    },
  };
}

async function run(verdictContent) {
  const lines = [];
  const original = console.warn;
  console.warn = (msg) => lines.push(String(msg));
  try {
    const result = await answer(fakeClient(verdictContent), [{ role: "user", content: "Who is Simon?" }]);
    return { result, events: lines.map((l) => JSON.parse(l)) };
  } finally {
    console.warn = original;
  }
}

for (const [name, content] of [
  ["malformed verdict", text("{ grounded: true, unsupported: [")],
  ["empty verdict", text("")],
  ["no text block at all", []],
]) {
  test(`${name}: parse_error on both attempts, then the fallback`, async () => {
    const { result, events } = await run(content);
    assert.equal(result, null, "a draft with an unreadable verdict must never be returned");
    const failures = events.filter((e) => e.event === "chat_check_failed");
    assert.deepEqual(failures, [
      { event: "chat_check_failed", reason: "parse_error", attempt: 1 },
      { event: "chat_check_failed", reason: "parse_error", attempt: 2 },
    ]);
    const fallback = events.find((e) => e.event === "chat_fallback");
    assert.equal(fallback?.reason, "parse_error");
    // the logs carry codes and counts only — never the question or the draft
    assert.ok(!events.some((e) => JSON.stringify(e).includes("Simon")), "log lines must not contain content");
  });
}

test("a readable grounded verdict returns the draft (control)", async () => {
  const { result, events } = await run(text(JSON.stringify({ grounded: true, unsupported: [] })));
  assert.equal(result, "Simon is a backend engineer.");
  assert.equal(events.length, 0);
});
