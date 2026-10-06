# Simon Laborde — portfolio (simonlaborde.com)

## Stack & hosting
- Next.js 16 App Router, React 19, TS, plain CSS (`app/globals.css`), `next/font`.
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
- **Update `SECURITY.md`** whenever the attack surface or controls change (endpoint,
  dependency, data flow, header, limit, third-party service).
- Public CV never contains the phone number (`npm run cv` enforces it); `TODO(simon)`
  notes stay in code comments (the smoke test fails if one renders).

## Where things live
- `content/site.ts` — profile, hero copy, status, right to work, journey, arsenal,
  certifications/training, chat copy, links.
- `content/projects.ts` — Work carousel (card skins + dialog + `layers` for IsoStack).
- `content/pipeline.ts` — Lattes sync case study section.
- `content/assistant-context.ts` — builds the chat system prompt from the files above
  (rules first, then `<profile>` as reference data).
- `components/` — `SiteChrome` (rail, nav, mobile menu, `ThemeToggle`), `SheetFrame`,
  `RevealController`, `WorkCarousel` (cards, `ProjectDialog`), `IsoStack`, `ChatConsole`,
  `sections/*`.
- `app/api/chat/` — `route.ts` (Claude Haiku 4.5, streaming), `config.ts` (model + limits,
  env-tunable), `rate-limit.ts` (Upstash per-IP + daily cap, fail closed; in-memory
  fallback when Upstash env vars are absent).
- `scripts/cv-source.html` — the CV's single source. `npm run cv` → public PDF without
  the phone; `npm run cv:full` → private PDF (phone from `CV_PHONE`) in gitignored
  `cv-private/`.
- `scripts/redteam.mjs` — prompt-injection probes. `scripts/smoke.mjs` — browser smoke.
- `SECURITY.md`, `public/.well-known/security.txt`, `.github/workflows/ci.yml`,
  `.github/dependabot.yml`, `.githooks/pre-commit`, `.claude/settings.json`.

## Features live
Blueprint (dark, default) + whiteprint (light) theme · rail draw-in + scroll trace ·
hero dimension lines · drawing-sheet frame · scroll-revealed meters/ECG/XP/vitals ·
section connectors · AS-BUILT stamp · exploded isometric project diagrams · Lattes
pipeline flow diagram · "Ask about my work" chat with privacy note · security headers ·
SEO/OG/JSON-LD · CV download.

## Facts to keep right
- Availability: open to AI and software engineering roles, remote or on-site in the EU
  (full-time, contract, freelance). **No master's mentions anywhere.**
- French citizen, full right to work in the EU, no visa sponsorship needed; based in
  Brazil, open to remote work and relocation.
- Accenture title: **Custom Software Engineer** (Jun 2022 – Jun 2023).
- LABNOV = a site Simon built as independent/freelance work — **not** a research role.
- NutriQuest = a **personal project** — never list it as freelance or client work.
- MedHelp: only "92% accuracy on clinical terminology normalization". No recall claim.
- No "graduated with highest honors". Thesis defended with distinction is fine.
- Certifications (exam-based): AI-900, SFC, EF SET C2 (77/100). Training (courses):
  5 × Anthropic Academy, Accenture Academy (Oracle BRM). Never call training a certification.
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
- On-load sequence (rail, nodes, hero dims) is one set: node delays = rail delay + when
  `--ease` reaches each node's `--at` (verified in slow motion, ≤1 frame off) — change
  together. It plays once per tab session; later loads get `data-drawn`.
- CSP (`next.config.mjs`) is strict apart from `'unsafe-inline'`: any new third-party
  script, font, image or API origin needs a deliberate CSP change + SECURITY.md entry.
- `@upstash/ratelimit` *allows* on timeout by default — `rate-limit.ts` treats
  `reason === "timeout"` as a block. Keep it that way.

## Open
- NDA freelance project details → CV + journey (Simon to send).
- Rogério Freire card has a placeholder — needs the artwork images (centred in the 5:2
  mat, `object-fit: contain`) and the live URL. LABNOV live URL missing.
- Scout project case study (backs Docker, pytest, AWS).
- Animation pass: chunks 4 and 7 held for Simon's call.
- Language switcher (EN/FR/PT) — planned for later (see docs/audits/2026-09-30-audit.md).
