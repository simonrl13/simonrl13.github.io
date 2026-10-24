/* Which commit is production serving? The sha of the newest Production
   deployment whose latest status is "success" (Vercel reports each deploy to
   GitHub). The probes workflow pins a run to it at the start and checks it
   again at the end, so a pass never mixes two deploys.
   Usage: node scripts/prod-deploy.mjs              → prints the sha
          node scripts/prod-deploy.mjs --wait <sha> → waits (≤ 20 min) until
            that commit's production deploy succeeds; exit 1 on failure/timeout
   Needs GITHUB_TOKEN (deployments: read). */

import { pathToFileURL } from "node:url";

const REPO = process.env.GITHUB_REPOSITORY || "simonrl13/simonrl13.github.io";

/** Newest deployment (API order) whose latest status is success, or null. */
export async function latestSuccess(deployments, latestState) {
  for (const d of deployments) if ((await latestState(d)) === "success") return d.sha;
  return null;
}

async function api(path) {
  const res = await fetch(`https://api.github.com/${path}`, {
    headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status} on ${path}`);
  return res.json();
}

const state = async (d) => (await api(`repos/${REPO}/deployments/${d.id}/statuses?per_page=1`))[0]?.state;
const production = (q = "") => api(`repos/${REPO}/deployments?environment=Production&per_page=20${q}`);

async function main() {
  const [flag, sha] = process.argv.slice(2);
  if (flag === "--wait") {
    for (let i = 0; i < 80; i++) {
      const [d] = await production(`&sha=${sha}`);
      const s = d && (await state(d));
      console.error(`deploy of ${sha.slice(0, 7)}: ${s ?? "not reported yet"}`);
      if (s === "success") return;
      if (s === "failure" || s === "error") process.exit(1);
      await new Promise((r) => setTimeout(r, 15_000));
    }
    console.error(`no successful production deploy of ${sha} after 20 minutes`);
    process.exit(1);
  }
  const live = await latestSuccess(await production(), state);
  if (!live) throw new Error("no successful production deployment found");
  console.log(live);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(String(err?.message ?? err));
    process.exit(2);
  });
}
