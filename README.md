# simonrl13.github.io

Simon Laborde's portfolio. Next.js (App Router) port of the hand-built
schematic / systems-diagram identity.

The pre-migration vanilla HTML/CSS/JS version is preserved at the git tag
[`v1.0-vanilla`](https://github.com/simonrl13/simonrl13.github.io/releases/tag/v1.0-vanilla).

## Stack

- **Next.js 16** (App Router) + **React 19**, TypeScript
- Plain CSS (`app/globals.css`) — no CSS framework
- `next/font` self-hosts Fraunces / Inter / JetBrains Mono
- `output: "export"` — one static build serves both hosts

## Hosting

- **GitHub Pages** — `simonrl13.github.io`, deployed by
  `.github/workflows/deploy.yml` on every push to `main` (static export).
- **Vercel** — the canonical deploy (auto-detected; serves the same export).

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
npm run serve        # preview ./out on http://localhost:4321
npm run lint
```

## Content

Everything editable lives in `content/`:

- `content/site.ts` — profile facts, hero copy, links, journey, arsenal,
  credentials. Items tagged `TODO(simon)` need confirmation before launch.
- `content/projects.ts` — the Work carousel (cards + detail dialog + dots all
  read from this one array).

## Assets

`scripts/gen-assets.mjs` rasterises the SVG sources into the referenced PNGs
(`public/og.png`, `app/apple-icon.png`). Re-run `npm run gen:assets` after
editing `scripts/og-source.svg` or `app/icon.svg`. CI runs it automatically.

## Verification

- `npm run shots` — desktop / tablet / mobile screenshots + overflow check
  (`scripts/.shots/`), needs Chrome installed.
- `npm run smoke` — interactive checks (dialog, PT/EN toggle, carousel, mobile
  menu, rail lighting).

## Outstanding before launch

- Add `public/assets/cv.pdf` (the CV links 404 until then).
- Resolve the `TODO(simon)` markers in `content/`.
- Deferred to a follow-up: the LLM "ask about my work" console (needs a server
  endpoint, so it lands on Vercel first).
