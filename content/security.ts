/* Copy for /security — "How this site is secured". Plain-language summary of
   SECURITY.md and docs/audits/2026-09-30-audit.md. Every claim here must be
   true of the code; update it together with SECURITY.md. */

import { site } from "./site";

export type SecurityItem = {
  title: string;
  body: string;
  link?: { label: string; href: string };
};

export const securityPage = {
  title: "How this site is secured",
  eyebrow: "Detail — security",
  description:
    "How simonlaborde.com and its AI assistant are protected: spending limits, input checks, prompt-injection tests, security headers, CI gates and known limitations.",
  intro:
    "This portfolio runs a live AI assistant that costs real money on every answer, so it’s built like a small production service. Here is what protects it, in plain language — and what doesn’t yet.",

  items: [
    {
      title: "Spending limits on the AI assistant",
      body: "Each visitor can ask up to 8 questions per 10 minutes, and the whole site has a daily cap of 200 answers. Both counters live in Upstash Redis, so they hold across every server instance. If the limiter can’t be reached, the assistant refuses to answer instead of letting requests through. Behind that sits a monthly spend limit on a dedicated Anthropic workspace.",
    },
    {
      title: "Inputs are capped and checked first",
      body: "Requests over 16 KB are rejected, each message is cut to 800 characters, only the last 8 turns are kept, and answers are capped at 500 tokens. Malformed requests are refused before they reach any limit or the model.",
    },
    {
      title: "Only this site can call the assistant",
      body: "The assistant’s endpoint accepts browser requests only from simonlaborde.com. Any other website gets a 403 and no permission to read the response.",
    },
    {
      title: "Prompt-injection tests",
      body: "Six probes try to override the instructions, extract the system prompt, swap the assistant’s persona, smuggle instructions in through pasted text and pressure it into sharing private details — plus one normal question to check it still answers. All six passed against the live site. The assistant has no tools, takes no actions and only sees this site’s public content; its answers are shown as plain text, never as HTML.",
    },
    {
      title: "Your questions and your privacy",
      body: "Questions are sent to Anthropic’s Claude API to generate an answer. This site doesn’t save conversations, and your IP address is held for up to 10 minutes for rate limiting. No cookies, no analytics.",
    },
    {
      title: "Security headers",
      body: "A Content Security Policy that only allows this site’s own scripts, styles, fonts and connections; HTTPS enforced with HSTS; no MIME sniffing; a strict referrer policy; camera, microphone, location and payment features switched off; and no other site can embed these pages in a frame.",
      link: {
        label: "See the live report on securityheaders.com",
        href: "https://securityheaders.com/?q=www.simonlaborde.com&followRedirects=on",
      },
    },
    {
      title: "No third-party requests",
      body: "Fonts are self-hosted, so neither building the site nor visiting it contacts Google Fonts or any other third party — and the Content Security Policy enforces it.",
    },
    {
      title: "Every change passes the same gates",
      body: "Each change is a pull request that must pass a lint, a production build, a browser smoke test, a dependency audit, a secret scan of the full git history (gitleaks) and CodeQL static analysis. The main branch is protected with no admin bypass — not even the owner can push to it directly. Dependabot proposes updates, and CI actions are pinned to exact commit hashes. The audit that set this up also caught a critical Next.js advisory in the deployed version (GHSA-vcvr-r3jv-pc5j); it was patched the same day.",
    },
    {
      title: "Personal data",
      body: "The public CV is generated without a phone number — the generator refuses to build it otherwise — and the git history was rewritten to remove the number from every past commit.",
    },
  ] satisfies SecurityItem[],

  limitations: [
    "The Content Security Policy still allows inline scripts (‘unsafe-inline’). Statically rendered Next.js pages need them; removing them would mean rendering every page on demand.",
    "Rate limits are per IP address, so someone with many addresses could spread requests. The daily cap and the spend limit bound the cost.",
    "AI answers can still overstate. The assistant is grounded only in this site’s content and told not to embellish — verify anything important with me directly.",
    "Vercel’s CDN marks public static files as readable by any site (Access-Control-Allow-Origin: *). That’s harmless for public content; the assistant’s endpoint uses its own allow-list.",
  ],

  reportLine: `Found a problem? Email ${site.links.email} — the address is also in /.well-known/security.txt. Please don’t open a public issue for security problems.`,
  securityMd: "https://github.com/simonrl13/simonrl13.github.io/blob/main/SECURITY.md",
} as const;
