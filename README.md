# simonrl13.github.io

Simon Laborde's portfolio. Next.js (App Router) port of the hand-built
schematic / systems-diagram identity.

The pre-migration vanilla HTML/CSS/JS version is preserved at the git tag
[`v1.0-vanilla`](https://github.com/simonrl13/simonrl13.github.io/releases/tag/v1.0-vanilla).

## Stack

- **Next.js 16** (App Router) + **React 19**, TypeScript
- Plain CSS (`app/globals.css`) — no CSS framework
- `next/font` self-hosts Fraunces / Inter / JetBrains Mono
- One source, two build shapes — see Hosting below

## Hosting

- **Vercel** — the canonical deploy, and the only host that can run
  `/api/chat`. A normal Next.js build (`npm run build`); set
  `ANTHROPIC_API_KEY` under Project → Settings → Environment Variables
  (Production, Preview, and Development) for the chat console to work there.
- **GitHub Pages** — `simonrl13.github.io`, static-only, deployed by
  `.github/workflows/deploy.yml` on every push to `main`. That job strips
  `app/api` (a static host can't run it) and runs `npm run build:static`
  (sets `STATIC_EXPORT=true`, which flips `output: "export"` on in
  `next.config.mjs`). The chat launcher still renders there; asking it a
  question shows a friendly "ask on the live site" fallback instead of
  erroring, since there's no `/api/chat` to answer.

## Develop

```bash
npm install
npm run dev            # http://localhost:3000, hot reload
npm run build           # normal dynamic build (what Vercel runs)
npm run start            # serve that build at http://localhost:3000
npm run build:static  # static export to ./out (what GitHub Pages runs) —
                       # only meaningful after removing app/api locally too,
                       # otherwise it just builds normally with output:
                       # export set; CI is the real static-export check
npm run serve          # preview a ./out export on http://localhost:4321
npm run lint
```

For local chat testing, put a key in `.env.local` (gitignored):

```
ANTHROPIC_API_KEY=sk-ant-...
```

Without it, `/api/chat` still responds (so the UI and its fallback states are
testable) — it just returns a friendly "not configured yet" message instead
of a real answer.

## Content

Everything editable lives in `content/`:

- `content/site.ts` — profile facts, hero copy, links, journey, arsenal,
  credentials. Items tagged `TODO(simon)` need confirmation before launch.
- `content/projects.ts` — the Work carousel (cards + detail dialog + dots all
  read from this one array).
- `content/pipeline.ts` — the Lattes sync case-study section.
- `content/assistant-context.ts` — builds the chat console's system prompt
  from the three files above (single source of truth; nothing there should
  say anything the page itself doesn't already say).

## Assets

`scripts/gen-assets.mjs` rasterises the SVG sources into the referenced PNGs
(`public/og.png`, `app/apple-icon.png`). Re-run `npm run gen:assets` after
editing `scripts/og-source.svg` or `app/icon.svg`. CI runs it automatically.

## Verification

- `npm run shots` — desktop / tablet / mobile screenshots + overflow check
  (`scripts/.shots/`), needs Chrome installed. Targets `next start` by
  default (`localhost:3000`); pass a URL to target something else.
- `npm run smoke` — interactive checks (dialog, PT/EN toggle, carousel,
  mobile menu, rail lighting, chat console open/ask/close). Same default
  target as `shots`.

## Outstanding before launch

- Add `public/assets/cv.pdf` (the CV links 404 until then).
- Resolve the `TODO(simon)` markers in `content/`.
- Set `ANTHROPIC_API_KEY` on Vercel for the chat console to answer for real.
