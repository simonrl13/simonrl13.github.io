# Security

Simon Laborde's portfolio: a Next.js site on Vercel (www.simonlaborde.com) with
one server endpoint, an "Ask about my work" chat backed by the Claude API.
This file is kept in step with the code: it changes whenever an endpoint,
dependency, data flow, header or limit does.

## What this project protects

- **The Anthropic API key and the spend behind it.** A dedicated "portfolio"
  workspace with its own key and a monthly Console spend limit; the key is
  scoped to Vercel *Production* only.
- **The Upstash Redis credentials** that back the rate limits.
- **Visitor privacy**: chat questions and IP addresses.
- **Accuracy and integrity of the content.** The site is a job-application
  asset; a wrong claim is a real harm (reputation).
- **Personal data in the public CV.** The phone number is kept out of it.

## Entry points and likely attacks

| Entry point | Likely attack | Control | Tested by |
|---|---|---|---|
| `POST /api/chat` (public, no auth by design) | Cost exhaustion / denial of wallet; scripted abuse from many IPs | Per-IP sliding window (8 / 10 min) **and** global daily cap (200 / UTC day) in Upstash Redis, shared across serverless instances; **fails closed** (503) if Redis errors or times out; `max_tokens` 500; Console spend limit as backstop | Local: 9th request from one IP → 429; 4th IP over a cap of 3 → 429; Redis unreachable → 503 (PR #26) |
| `POST /api/chat` | Oversized / malformed payloads | Body ≤ 16 KB (413) and shape validation (400) **before** any limit or model call; ≤ 8 turns × 800 chars; roles allow-listed | Local curl checks (PR #26); `npm run smoke` |
| `POST /api/chat` | Prompt injection (direct, and instructions embedded in pasted text) | Rules before data; profile wrapped in `<profile>` as reference data; visitor text cannot change rules/persona/format; no tools, no retrieval, no actions — worst case is off-topic text | `npm run redteam` — 6/6 passed against production on 2026-10-06 |
| `POST /api/chat` | System-prompt extraction | The prompt contains only public site content and the public contact email — nothing secret to leak | `npm run redteam` (extraction probe) |
| Chat output in the browser | XSS via model output | Answers rendered as React text nodes; never HTML or Markdown | Code review; CodeQL |
| Static pages | XSS, clickjacking, MIME sniffing | React escaping; `dangerouslySetInnerHTML` only on repo-authored strings in `content/`; CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff` | Headless browser check: no CSP violations (PR #28); `curl -I` |
| Build and dependencies | Vulnerable or malicious package; compromised action | Lockfile; runtime `npm audit` gate in CI; Dependabot; actions pinned to commit SHAs; packages vetted before install (age, downloads, maintainers) | CI `verify` job |
| Repository | Committed secret | gitleaks pre-commit hook + full-history gitleaks in CI; GitHub secret scanning | CI `secret-scan` job |
| Public CV (`/assets/cv.pdf`) | Personal data exposure | `npm run cv` strips the phone segment and **refuses to render** if a phone number or placeholder survives; the full CV is generated only into the gitignored `cv-private/` | Renderer guard |
| AI coding assistant (Claude Code) | Reading secrets, unreviewed installs or network calls | `.claude/settings.json`: deny reading `.env*`, keys and `cv-private/`; ask before installs, `curl`/`wget`, `git push`, web fetches | — |

## Controls mapped to OWASP

OWASP Top 10 for LLM Applications (2025):
- **LLM01 Prompt Injection** — prompt layout and refusal rules; no tools or
  side effects to hijack; red-team probes.
- **LLM02 Sensitive Information Disclosure** — the model only sees public
  content; the key never leaves the server.
- **LLM05 Improper Output Handling** — output rendered as text only.
- **LLM07 System Prompt Leakage** — the prompt holds nothing secret.
- **LLM09 Misinformation** — answers grounded only in the site's own content,
  with a no-embellishment rule; mitigated, not eliminated (see limitations).
- **LLM10 Unbounded Consumption** — input caps, `max_tokens`, per-IP and
  daily limits that fail closed, Console spend limit.

OWASP Top 10 (2021):
- **A03 Injection** — React escaping, CSP.
- **A05 Security Misconfiguration** — security headers on every route.
- **A06 Vulnerable and Outdated Components** — runtime audit gate, Dependabot.
- **A08 Software and Data Integrity Failures** — SHA-pinned actions,
  lockfile, CodeQL (JavaScript/TypeScript and GitHub Actions).

## Development safeguards

- Secret scanning: gitleaks in pre-commit (`git config core.hooksPath .githooks`)
  and on every PR over the full history; GitHub secret scanning.
- Dependency audits in CI (`npm audit --omit=dev --audit-level=high` blocks;
  the full audit is reported); Dependabot for npm and GitHub Actions.
- Static analysis: CodeQL, `security-extended` queries.
- `main` is protected: the `verify`, `secret-scan` and `codeql` checks are
  required, no admin bypass.
- Claude Code permissions: no reading secrets; approval required for installs
  and network commands.

## Data handling

- **Chat questions** are sent to Anthropic's Claude API (Claude Haiku 4.5)
  to generate an answer and are handled under Anthropic's API terms. This site
  doesn't log or store them; only failures are logged, without message content.
- **IP addresses** are used as the per-IP rate-limit key in Upstash Redis and
  expire with the 10-minute window. The daily counter holds no visitor data.
  Upstash analytics are off.
- **Hosting logs**: Vercel keeps its own platform request logs under its
  retention policy; this project doesn't add to them.
- **Browser storage**: `localStorage.theme` (the chosen theme) and
  `sessionStorage.drawn` (skip the draw-in animation on reloads). No cookies,
  no analytics, so no consent banner is needed.
- **The chat tells visitors** that answers are AI-generated, that questions
  go to Anthropic's Claude API, and how long the IP is held.

## Known limitations

- **CSP allows `'unsafe-inline'` for scripts and styles.** Statically rendered
  Next.js pages carry inline bootstrap scripts; per-request nonces would force
  every page to render on demand. Accepted.
- **The Vercel preview toolbar** (vercel.live) is blocked by the CSP on
  preview deployments.
- **simonrl13.github.io** (GitHub Pages) can't send custom headers or a
  server-side 301. It now serves only a static redirect page to
  www.simonlaborde.com (path preserved); no site content is hosted there.
- **IP-based limits** can be spread across many IPs. The global daily cap and
  the Console spend limit bound the cost.
- **If the Upstash environment variables are missing**, the endpoint falls back
  to per-instance in-memory limits and logs an error in production.
- **LLM answers can still overstate.** Grounding and the no-embellishment rule
  reduce it; the chat note asks visitors to verify with Simon directly.
- **The injection tests are probes, not proof.** Six heuristic cases plus
  manual review of every answer.
- **Dev-only advisory:** `braces` (via the ESLint tooling) has no non-breaking
  fix upstream. It isn't shipped to the site; CI reports it without blocking.
- **Google Fonts at build time:** `next/font/google` downloads the fonts while
  building (they are then self-hosted); a Google outage can fail a build.
- **Git history:** the phone number appears in earlier commits of the CV and
  its source (public before this hardening). History was not rewritten.

## Reporting a vulnerability

Email **simonrl865@gmail.com** (also in
[`/.well-known/security.txt`](https://www.simonlaborde.com/.well-known/security.txt)).
Please don't open a public issue for security problems. You'll get a reply
within a few days.
