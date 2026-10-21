/* The date of the latest full probe pass, for /security: the latest
   successful run of .github/workflows/probes.yml (a success = every probe
   passed: scripts/redteam.mjs exits non-zero on any failure). Read on the
   server from GitHub's public API, no token, at most once a day (ISR); no
   visitor data is sent. If GitHub is unreachable or rate-limited, `recorded`
   (the last pass written in content/security.ts) is used — the page never
   shows an older date than that. */

const RUNS =
  "https://api.github.com/repos/simonrl13/simonrl13.github.io/actions/workflows/probes.yml/runs?status=success&per_page=1";

/** YYYY-MM-DD of the latest full pass, never earlier than `recorded`. */
export async function latestProbePass(recorded: string): Promise<string> {
  try {
    const res = await fetch(RUNS, {
      headers: { accept: "application/vnd.github+json" },
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return recorded;
    const run = (await res.json())?.workflow_runs?.[0];
    const day = typeof run?.updated_at === "string" ? run.updated_at.slice(0, 10) : "";
    return /^\d{4}-\d{2}-\d{2}$/.test(day) && day > recorded ? day : recorded;
  } catch {
    return recorded;
  }
}
