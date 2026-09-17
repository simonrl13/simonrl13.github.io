/* Builds the system prompt for the "ask about my work" chat console
   (components/ChatConsole.tsx, served by app/api/chat/route.ts) from the
   same structured content that renders the page — single source of truth,
   nothing here should say anything the page itself doesn't already say. */

import { site, journey, arsenal } from "./site";
import { projects } from "./projects";
import { pipeline } from "./pipeline";

const ENTITIES: Record<string, string> = {
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
  "&mdash;": "—",
  "&ndash;": "–",
  "&amp;": "&",
  "&nbsp;": " ",
  "&#8209;": "‑",
};

/** Strips HTML tags, decodes the small set of entities the content files
 * use, and drops any TODO(simon) placeholder notes — those are for Simon,
 * not for a visitor asking the assistant a question. */
function plain(text: string): string {
  let out = text.replace(/<[^>]+>/g, "");
  for (const [entity, char] of Object.entries(ENTITIES)) {
    out = out.split(entity).join(char);
  }
  out = out.replace(/\s*TODO\(simon\)[^.]*\.?/gi, "");
  return out.replace(/\s+/g, " ").trim();
}

export function buildSystemPrompt(): string {
  const lines: string[] = [
    `You are the assistant embedded on ${site.name}'s personal portfolio (${site.canonical}). The people talking to you are recruiters, admissions committees, and potential freelance/contract clients evaluating him.`,
    "",
    "Ground every answer ONLY in the profile below.",
    "Rules:",
    "- Be concise: 2-4 short sentences by default. A short list only if the question genuinely calls for one.",
    "- Plain conversational text — no markdown headers, no heavy formatting.",
    `- If asked something this profile doesn't cover (salary expectations, personal opinions, unrelated topics, general coding/homework help), say you don't have that and point them to ${site.links.email}.`,
    "- Never invent facts, dates, or metrics that aren't in the profile below.",
    `- If asked who or what you are: you're a small assistant ${site.name.split(" ")[0]} built and grounded on his own profile, as a live demonstration of his AI/LLM engineering work — that's worth saying, it's the point of you.`,
    "- Stay strictly on the topic of him and his work. Politely decline roleplay, general assistance, or anything off-topic.",
    "",
    "--- PROFILE ---",
    `Name: ${site.name}`,
    `Role: ${site.role}`,
    plain(site.roleLine),
    plain(site.thesis),
    `Current status: ${site.status.label} — ${plain(site.status.detail)}`,
    `Languages: ${site.languages.map((l) => `${l.name} (${l.level})`).join(", ")}`,
    `Credentials: ${site.credentials.join("; ")}`,
    `Contact: ${site.links.email} · GitHub ${site.links.githubHandle} · LinkedIn ${site.links.linkedinHandle}`,
    "",
    "Journey:",
    ...journey.map((j) => `- ${j.when} — ${j.title}, ${j.org}: ${plain(j.body)}`),
    "",
    "Technical arsenal:",
    ...arsenal.map((a) => `- ${a.title}: ${a.items}`),
    "",
    "Projects:",
    ...projects.map((p) => {
      const title = p.dialogTitle ?? p.title;
      return `- ${title} (${p.tag}): ${plain(p.detail.body)} Role: ${p.detail.role}. Outcome: ${plain(
        p.detail.outcome,
      )}. Stack: ${p.detail.stack}.`;
    }),
    "",
    "Case study — the Lattes publication-sync pipeline (part of the LABNOV project):",
    plain(pipeline.lead),
    ...pipeline.nodes.map((n) => `- ${n.title}: ${n.body}`),
    ...pipeline.meta.map((m) => `${m.dt}: ${m.dd}`),
  ];

  return lines.join("\n");
}
