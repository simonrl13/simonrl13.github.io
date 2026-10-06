# simonlaborde.com

Simon Laborde's portfolio — a Next.js (App Router) site with a hand-built
schematic / systems-diagram identity and an "Ask about my work" chat backed by
the Claude API. Live at **https://www.simonlaborde.com**.

The pre-migration vanilla HTML/CSS/JS version is preserved at the git tag
[`v1.0-vanilla`](https://github.com/simonrl13/simonrl13.github.io/releases/tag/v1.0-vanilla).

## Stack

- **Next.js 16** (App Router) + **React 19**, TypeScript
- Plain CSS (`app/globals.css`) — no CSS framework
- Fonts self-hosted from `app/fonts` via `next/font/local` (Fraunces / Inter /
  JetBrains Mono, latin subsets, SIL OFL — licenses alongside): no Google
  Fonts request at build or runtime
- Chat: `@anthropic-ai/sdk` (Claude Haiku 4.5) with rate limits in Upstash Redis

## Hosting

- **Vercel** is the only host: `www.simonlaborde.com` (apex redirects to www).
  Environment variables, scoped to **Production**:
  - `ANTHROPIC_API_KEY` — the dedicated "portfolio" workspace key
  - `KV_REST_API_URL` + `KV_REST_API_TOKEN` (from the Vercel Marketplace Upstash
    integration) — or `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
  - optional: `CHAT_PER_IP_LIMIT`, `CHAT_PER_IP_WINDOW_MINUTES`, `CHAT_DAILY_CAP`
- **`simonrl13.github.io`** is retired. GitHub Pages now serves only
  `pages-redirect/` (deployed by `.github/workflows/deploy.yml`), which sends
  visitors — and the path they asked for — to www.simonlaborde.com.

## Develop

```bash
npm install
git config core.hooksPath .githooks   # once: gitleaks pre-commit hook
npm run dev       # http://localhost:3000, hot reload
npm run build     # production build (what Vercel runs)
npm run start     # serve that build at http://localhost:3000
npm run lint
```

For local chat testing, put a key in `.env.local` (gitignored):

```
ANTHROPIC_API_KEY=sk-ant-...
```

Without it, `/api/chat` still responds — validation and rate limits run, then
it returns a friendly "not configured yet" message. Without Upstash variables
the limits fall back to per-instance memory.

## Content

Everything editable lives in `content/`:

- `content/site.ts` — profile facts, hero copy, availability and right to work,
  links, journey, arsenal, certifications and training, chat copy.
- `content/projects.ts` — the Work carousel (cards + detail dialog + dots all
  read from this one array).
- `content/pipeline.ts` — the Lattes sync case-study section.
- `content/assistant-context.ts` — builds the chat's system prompt from the
  files above (nothing there should say anything the page doesn't).

`TODO(simon)` notes belong in code comments only; the smoke test fails if one
reaches the rendered page.

## CV

`scripts/cv-source.html` is the CV's single source of truth.

- `npm run cv` → `public/assets/cv.pdf`, the public copy (no phone number; the
  renderer refuses to write it if one slips in).
- `npm run cv:full` → `cv-private/Simon_Laborde_CV_full.pdf` with the phone from
  `CV_PHONE` in `.env.local`. The folder is gitignored and never published.

## Assets

`npm run gen:assets` rasterises the SVG sources into the committed PNGs
(`public/og.png`, `app/apple-icon.png`). Re-run it after editing
`scripts/og-source.svg` or `app/icon.svg`.

## Verification

- `npm run smoke` — interactive checks against `next start` (dialogs, no
  rendered TODOs, PT/EN toggle, carousel, mobile menu, rail, chat).
- `npm run shots` — desktop / tablet / mobile screenshots + overflow check.
- `npm run redteam [url]` — prompt-injection probes against the chat.
- CI (`.github/workflows/ci.yml`) runs lint, the runtime dependency audit, the
  build and smoke (`verify`), gitleaks over the full history (`secret-scan`)
  and CodeQL (`codeql`) on every PR; all three are required to merge.

## Security

See [SECURITY.md](SECURITY.md) — threat model, controls, known limitations,
and how to report a vulnerability.
