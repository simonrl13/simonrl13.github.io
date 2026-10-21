/* Waits until every check run on a commit has completed, then reports each
   one's final conclusion. Never reports from a partial state: a run still
   queued or in progress, or a required check that hasn't started yet, means
   keep waiting; a timeout or an API error is reported as such, not as a
   result.
   Usage: node scripts/ci-wait.mjs <sha> [timeoutSec]   (default 1200)
   Token: GITHUB_TOKEN, else `git credential fill` for github.com (never printed).
   Exit: 0 all completed and green · 1 a check failed · 2 timeout or API error. */

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const REPO = "simonrl13/simonrl13.github.io";
// branch protection's required checks (.github/workflows/ci.yml)
export const REQUIRED = ["verify", "secret-scan", "codeql"];
const PASSING = new Set(["success", "neutral", "skipped"]);

/** The decision, from the check runs as GitHub lists them. A re-run adds a
 * run with the same name: only the latest (highest id) counts. */
export function verdict(runs, required = REQUIRED) {
  const latest = new Map();
  for (const r of runs) if (!latest.has(r.name) || r.id > latest.get(r.name).id) latest.set(r.name, r);
  const all = [...latest.values()];
  const pending = [
    ...all.filter((r) => r.status !== "completed").map((r) => `${r.name} (${r.status})`),
    ...required.filter((n) => !latest.has(n)).map((n) => `${n} (not started)`),
  ];
  if (pending.length) return { done: false, pending, runs: all };
  const failed = all.filter((r) => !PASSING.has(r.conclusion)).map((r) => `${r.name}: ${r.conclusion}`);
  for (const n of required) if (latest.get(n).conclusion !== "success") failed.push(`${n} (required): ${latest.get(n).conclusion}`);
  return { done: true, ok: failed.length === 0, failed: [...new Set(failed)], runs: all };
}

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  const out = execFileSync("git", ["credential", "fill"], { input: "protocol=https\nhost=github.com\n\n", encoding: "utf8" });
  return out.match(/^password=(.*)$/m)?.[1];
}

async function checkRuns(sha, auth) {
  const runs = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/commits/${sha}/check-runs?per_page=100&page=${page}`, {
      headers: { authorization: `Bearer ${auth}`, accept: "application/vnd.github+json" },
    });
    // an API error is never "not done yet": stop and say so
    if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`);
    const j = await res.json();
    runs.push(...j.check_runs.map((r) => ({ id: r.id, name: r.name, status: r.status, conclusion: r.conclusion, url: r.html_url })));
    if (runs.length >= j.total_count || !j.check_runs.length) return runs;
  }
}

async function main() {
  const [sha, timeoutSec = "1200"] = process.argv.slice(2);
  if (!sha) throw new Error("usage: node scripts/ci-wait.mjs <sha> [timeoutSec]");
  const auth = token();
  if (!auth) throw new Error("no GitHub token (GITHUB_TOKEN or git credential fill)");
  const deadline = Date.now() + Number(timeoutSec) * 1000;
  let v, settled = 0, lastCount = -1;
  for (;;) {
    v = verdict(await checkRuns(sha, auth));
    // done twice in a row with the same runs: a check created late (e.g. the
    // CodeQL analysis run after the codeql job) can't slip past
    settled = v.done && v.runs.length === lastCount ? settled + 1 : v.done ? 1 : 0;
    lastCount = v.runs.length;
    if (settled >= 2) break;
    if (Date.now() > deadline) {
      console.log(`TIMED OUT after ${timeoutSec}s — still pending: ${(v.pending ?? ["(settling)"]).join(", ")}`);
      process.exit(2);
    }
    await new Promise((r) => setTimeout(r, v.done ? 10_000 : 15_000));
  }
  for (const r of v.runs) console.log(`${r.name.padEnd(28)} ${r.conclusion}${PASSING.has(r.conclusion) ? "" : `  ${r.url}`}`);
  console.log(v.ok ? "ALL CHECKS COMPLETED AND PASSED" : `CHECKS FAILED: ${v.failed.join(", ")}`);
  process.exit(v.ok ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.log(`ERROR: ${err.message}`);
    process.exit(2);
  });
}
