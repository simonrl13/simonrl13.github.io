# Simon Laborde — portfolio (simonlaborde.com)

## Stack & hosting
- Next.js 16 App Router, React 19, TS, plain CSS (`app/globals.css`).
- Fonts: `next/font/local` from `app/fonts` (latin subsets, OFL). Don't reintroduce
  `next/font/google` — builds must not depend on Google Fonts.
- **Vercel** is the only host (`www.simonlaborde.com`, apex → www); deploys on push to `main`.
- `simonrl13.github.io` is **retired**: GitHub Pages serves only `pages-redirect/`
  (`.github/workflows/deploy.yml`), which forwards visitors — and their path — to
  www.simonlaborde.com. No static export exists any more.

## Security rules (every change)
- **No secrets** in code, logs, commits, prompts or fixtures. Keys live only in Vercel env
  vars (Production scope) or a gitignored `.env.local`. Never read `.env*` files.
- **Validate every input** at the trust boundary (type, length, shape) before using it —
  see `app/api/chat/route.ts`: size cap → JSON → shape → limits → model.
- **Model output is rendered as text only.** `dangerouslySetInnerHTML` is allowed solely
  for repo-authored strings in `content/` — never for model or visitor content.
- **Ask before adding any dependency or external service.** Before installing, check the
  package exists on npm and is established (age, weekly downloads, maintainers).
- **Chat spend controls stay on:** per-IP + daily cap in Upstash, fail closed, limits in
  `app/api/chat/config.ts`. Run `npm run redteam <url>` after changing the prompt.
- **Every change goes through a PR and passes CI** (`verify`, `secret-scan`, `codeql`);
  `main` is protected with no admin bypass.
- **Update `SECURITY.md`** (and the /security page copy) whenever the attack surface or
  controls change (endpoint, dependency, data flow, header, limit, third-party service).
- Public CV never contains the phone number (`npm run cv` enforces it); `TODO(simon)`
  notes stay in code comments (the smoke test fails if one renders).

## Where things live
- `content/site.ts` — profile, hero copy, status, right to work, journey, arsenal,
  certifications/training, chat copy, links.
- `content/projects.ts` — Work carousel (card skins + dialog + `layers` for IsoStack).
- `content/pipeline.ts` — Lattes sync case study section.
- `content/security.ts` + `app/security/page.tsx` — the public "How this site is secured"
  page (/security). Plain-language summary of SECURITY.md: keep them in sync, facts only.
- `content/i18n/` — EN + PT (French-ready). `locales.json` (root) lists locales; `routes.ts`
  localized slugs (`/security/` ↔ `/pt/seguranca/`); `en.ts` UI strings, `pt.ts` the full PT-BR
  bundle (TS enforces the EN shape); `index.ts` assembles bundles. English = unprefixed URLs
  (next.config rewrites to `app/[locale]` as /en; /en/* redirects back). Adding French = `fr.ts`,
  one line in `bundles`, `"fr"` in locales.json, a slug per page. Dialog case studies stay EN.
  The switcher remembers the choice but **never redirects** — the URL always wins.
- `content/assistant-context.ts` — builds the chat system prompt from the files above:
  rules, `<facts>` (only source for claims about Simon, plus `CLARIFICATIONS`), `<services>`,
  `<security>`, then the no-embellishment rule again. `npm run redteam` judges fit answers
  against `<facts>` with Claude Opus 5.5 (needs `ANTHROPIC_API_KEY` in `.env.local`).
- `components/` — `SiteChrome` (rail, nav, mobile menu, `ThemeToggle`), `SheetFrame`,
  `RevealController`, `WorkCarousel` (cards, `ProjectDialog`), `IsoStack`, `ChatConsole`,
  `ContactForm`, `LangSwitch`, `sections/*`.
- `app/api/chat/` — `route.ts` (Claude Haiku 5.5, effort `low`, no streaming), `grounding.ts`
  (draft → second-call check against `buildReference()` → one redraft → safe answer; fail-closed),
  `config.ts` (model + limits, env-tunable, `ALLOWED_ORIGINS`).
- `app/api/contact/route.ts` — services contact form → one plain-text email via Resend
  (`fetch`, no SDK). Env: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` (Vercel only;
  never write `CONTACT_TO`’s value anywhere). Stores and logs nothing from visitors.
- `lib/rate-limit.ts` — `createLimiter()`: Upstash per-IP + daily cap, fail closed;
  in-memory fallback when Upstash env vars are absent. Chat 8/10 min + 200/day,
  contact 3/60 min + 20/day.
- `content/services.ts` (EN) + `pt.ts` `services` — /services and /pt/empresas (primary):
  two offers, LGPD data block, form copy. `[PRAZO]`/`[PRICE]` stay visible until Simon fills
  them; never invent prices, clients, numbers or testimonials.
- `scripts/cv-source.html` — the CV's single source. `npm run cv` → public PDF without
  the phone; `npm run cv:full` → private PDF (phone from `CV_PHONE`) in gitignored
  `cv-private/`.
- `scripts/redteam.mjs` — prompt-injection probes. `scripts/smoke.mjs` — browser smoke.
- `SECURITY.md`, `public/.well-known/security.txt`, `.github/workflows/ci.yml`,
  `.github/dependabot.yml`, `.githooks/pre-commit`, `.claude/settings.json`.

## Features live
Blueprint (dark, default) + whiteprint (light) theme · rail draw-in + scroll trace ·
drafted hero map (Origin → Paris: compass, pencil, dividers, great circle) ·
survey-traverse carousel stations ·
hero dimension lines · drawing-sheet frame · scroll-revealed meters/ECG/XP/vitals ·
section connectors · AS-BUILT stamp · exploded isometric project diagrams · Lattes
pipeline flow diagram · "Ask about my work" chat with privacy note · security headers ·
SEO/OG/JSON-LD · CV download · EN / PT-BR (/pt/) with hreflang + nav switcher.

## Facts to keep right
- Availability: open to AI and software engineering roles, remote or on-site in the EU
  (full-time, contract, freelance). **No master's mentions anywhere.**
- French citizen, full right to work in the EU, no visa sponsorship needed; based in
  Brazil, open to remote work and relocation.
- Accenture title: **Custom Software Engineer** (Jun 2022 – Jun 2023).
- LABNOV = a site Simon built as independent/freelance work — **not** a research role.
- NutriQuest = a **personal project** — never list it as freelance or client work. Status: "In
  development (redesign in progress)" / "Em desenvolvimento (redesign em andamento)" — never
  shipped, released, live or published. Describe only what its current code does
  (C:\Projetos\Webpage\nutriquest): no sync or backend; leaderboard on sample data; photo logging planned.
- MedHelp: designed for SUS, built and evaluated on **synthetic data**, never real patient records
  or a real SUS system. Only figure: "92% (23 of 25 terms) on clinical terminology normalization,
  evaluated on synthetic data in the thesis (chapter 4.3)" (short: "92% (23/25 terms, synthetic
  data)") — never cite the repo's 8-case gold set as its source. No recall claim. Stack: a
  rule-based FastAPI service (C:\Projetos\Medhelper) — no scikit-learn, pandas or NumPy.
  Role line: "Undergraduate thesis project".
- Accenture: no "improved data accuracy" claim.
- LinkedIn: linkedin.com/in/simonrodrigueslaborde (the old -2131861bb URL is obsolete).
- Rogério Freire site = client work (CV freelance section + Journey). Game-dev 2018–2020
  entry: site Journey only, never on the CV. Certifications are listed without dates.
- Scout (github.com/simonrl13/footballscout, read-only source at C:\Projetos\Scout) is
  first in Selected Projects and the Work carousel, labelled "In progress". Check every
  number against its README/reports before changing copy (8,190 players, 82.2% interval
  coverage, MAE 0.357 vs 0.410 no-change). Agent and MCP server are **built** (19/20 held-out, 2/2 injection resisted); forecasting
  model complete; deployment next (not live); it does **not** beat linear — never say it does.
  The chat's verified Scout entry is `SCOUT` in `content/assistant-context.ts`.
- No "graduated with highest honors", no "with distinction". Thesis: "MedHelp: Sistema de Apoio à Decisão Clínica para Recomendações de Exames Preventivos com Processamento de Linguagem Natural" (keep the
  Portuguese title; in English add a bracketed translation marked as one). Topic: NLP for
  clinical decision support — never generative AI or LLM work. Graded 10/10, the maximum grade
  ("aprovado com nota máxima (10)").
- Certifications (exam-based): AI-900, SFC, EF SET C2 (77/100). Training (courses):
  Accenture Academy (Oracle BRM) and exactly these 5 Anthropic Academy courses: AI Fluency:
  Framework & Foundations (Mar 2026); Claude Code in Action (Mar 2026); Building with the Claude
  API (Jul 2026); Introduction to Model Context Protocol (Aug 2026); Model Context Protocol:
  Advanced Topics (Aug 2026). Never call training a certification.
- Skills: no Kubernetes, JMeter, Vue or Flask. Docker, pytest and AWS stay (Scout project
  case study coming).
- Languages: PT native, EN C2, FR C1, ES B1.
- Never invent roles/metrics/titles — ask.

## Workflow
- Branch → commit → push → PR → CI green → merge (GitHub API, token from
  `git credential fill`; no `gh` CLI). One PR per change.
- Once per clone: `git config core.hooksPath .githooks` (gitleaks pre-commit).
- Verify: `npm run lint`, `npm run build`, `npm run start` (port 3000), `npm run smoke`,
  `npm run shots`. Puppeteer scripts must live in `scripts/` to resolve node_modules.
- Windows: free port 3000 via `netstat -ano | grep :3000` → `taskkill //F //PID <pid>`.

## Gotchas
- `.sheet--chat` display is scoped to `[open]` — an unscoped author `display` beats the
  UA's `dialog:not([open]){display:none}` and leaves the dialog rendered.
- `.sheet` is `position: fixed; z-index: 300` on purpose (don't rely on top layer) — it
  also keeps the sheet on top during its exit fade where `overlay` isn't supported.
- `ProjectDialog`: `open` drives showModal/close; `active` outlives close so the exit
  animation has content. Don't clear `active` on close.
- Press feedback is `translate: 0 1px` (Simon's choice), never `scale(.97)`.
- `IsoStack` takes any number of layers; `--k` per slab drives the explode spread.
- `trailingSlash: true` → client fetches `/api/chat/` (avoids a 308 hop).
- The root layout lives under `app/[locale]`, so unmatched URLs use `app/global-not-found.tsx`
  (`experimental.globalNotFound`); shared fonts + theme head are in `app/document.tsx`.
- `npm run redteam` exits non-zero on any failure and stops (exit 2) without `ANTHROPIC_API_KEY`
  in `.env.local`. Never pipe it through `tail` without `set -o pipefail` — that masked an exit code once.
- Smoke-test TODO checks on PT pages match `TODO(`/`TODO:` only — "todo" is a Portuguese word.
- On-load sequence is one set: rail 1.5 s from .3 s, node pops = rail delay + when
  `--ease` over 1.5 s reaches each node's `--at`, hero dims .5–1.9 s, the drafted map
  (`MapDraft`: a Web Animations timeline in `draft()`, ≈14 s wide (C) / ≈6 s phone (A), from when
  its JSON arrives after `load` + idle; pencil paced per vertex). Wide = variant C (camera
  following the pencil, bold ink, texture, climax); phones = A. The title block's S. LABORDE
  signature, then AS-BUILT, wait for the drawing (`md-wait` → `md-landed`; skip = `md-skip`,
  stamped at once); with no map they land at 2.85 / 3.2 s. Once per tab
  session (`data-drawn`). Skip = any click/tap/key/scroll (phone: scroll the figure away).
- Map line work that draws itself is stroked in user units (`--u`, set by MapDraft), never
  `vector-effect: non-scaling-stroke`: Chrome then takes the dashes in screen space and the
  draw-on breaks under any transform (e.g. a camera zoom).
  Bearing (027°) and distance (7,259 km) → Paris are computed in `content/geo.ts` and tested.
- Map data: `npm run gen:map` → committed `public/map/*.json` (Natural Earth, public domain).
  d3-geo / topojson-client / world-atlas are devDependencies only — never import them in app code.
- Inter and JetBrains Mono use `display: "optional"` (a swap rewrapped the hero role line:
  CLS 0.02). Keep it; Fraunces stays `swap`.
- CSP (`next.config.mjs`) is strict apart from `'unsafe-inline'`: any new third-party
  script, font, image or API origin needs a deliberate CSP change + SECURITY.md entry.
- `@upstash/ratelimit` *allows* on timeout by default — `lib/rate-limit.ts` treats
  `reason === "timeout"` as a block. Keep it that way.

## Open
- Services: Simon fills `[PRAZO]` and `[PRICE]` (EN + PT); verify "never used to train
  models" against each AI provider’s terms before adding it.
- NDA freelance project details → CV + journey (Simon to send).
- Rogério Freire card has a placeholder — needs the artwork images (centred in the 5:2
  mat, `object-fit: contain`) and the live URL. LABNOV live URL missing.
- Scout full case study (card + CV entry live; backs Docker, pytest, AWS, LightGBM, MLflow).
- French locale (structure ready; content only).
- ESLint upgrade: ESLint 9 → 10 (major ignored in dependabot.yml) together with
  eslint-config-next; clears the dev-only braces/micromatch audit chain once a patched
  `braces` exists (logged in SECURITY.md → Development safeguards). Its own PR.
