/* English interface copy and section intros — the strings that used to be
   hard-coded in components. Profile facts and longer copy stay in
   content/site.ts, projects.ts, pipeline.ts and security.ts (the English
   source the chat assistant also reads). Every other locale must provide
   the same keys (see ./index.ts). */

export const enUi = {
  meta: { htmlLang: "en", ogLocale: "en_US", languageName: "English" },

  skipLink: "Skip to content",
  navLabel: "Section index",
  nav: { journey: "Journey", arsenal: "Arsenal", work: "Work", languages: "Languages", contact: "Contact" },
  /** nav link to the services page; empty = footer link only (English) */
  navServices: "",
  rail: { origin: "Origin", journey: "Journey", arsenal: "Arsenal", work: "Work", pipeline: "Detail", languages: "Languages", contact: "Contact" },
  menu: { open: "Open menu", close: "Close menu" },
  theme: { toLight: "Switch to whiteprint (light)", toDark: "Switch to blueprint (dark)", lightTitle: "Whiteprint", darkTitle: "Blueprint" },
  langSwitch: { label: "Language" },

  origin: {
    eyebrow: "DRAWING",
    statusKey: "STATUS",
    cta: "Start a conversation",
    cv: "Download CV",
    cvNote: "(PDF)",
    /** the other CVs linked beside the button (site.links.cvs langs) */
    cvOthers: ["fr", "pt-BR"],
    titleBlockLabel: "Drawing title block",
    languagesLabel: "Spoken languages",
    dimLabel: "SHEET 1 / 1 — SCALE 1:1",
    /** {deg} = initial great-circle bearing Origin → Paris (content/geo.ts) */
    bearingLabel: "BRG {deg} → PARIS",
  },
  journey: {
    title: "Journey",
    intro: "One throughline: learning how systems behave, then making them serve real needs — from physics engines to research infrastructure.",
  },
  arsenal: {
    title: "Technical arsenal",
    intro: "Read as a legend, not a tag cloud — grouped by the layer of the system each part touches.",
    credentials: "Certifications & Training",
    certifications: "Certifications",
    training: "Training",
  },
  work: {
    title: "Selected work",
    intro: "Six projects, six problems. Each drawing is styled after what the thing actually is.",
    hint: "scroll →",
  },
  carousel: {
    label: "Project carousel, scrollable",
    prev: "Previous project",
    next: "Next project",
    more: "Read the full drawing",
    cardLanguage: "Card language",
    close: "Close",
    /** shown at the top of an English project dialog in another locale; empty in English */
    detailNote: "",
    /** dialog labels, in the dialog's language (PT keeps them English, like its dialogs) */
    role: "Role",
    outcome: "Outcome",
    /** card marker for projects with a video in the dialog */
    videoMark: "Video",
    /** the poster button reads "Play video: Scout (25 s)" */
    playVideo: "Play video",
    /** iframe title: "Scout, video (YouTube)" */
    videoFrame: "video (YouTube)",
  },
  pipeline: { manualStep: "manual step" },
  languages: {
    title: "Languages",
    intro: "Multilingual and Europe-bound — measured on the CEFR scale, read like a signal meter.",
    names: { PT: "Portuguese", EN: "English", FR: "French", ES: "Spanish" },
    native: "native",
  },
  contact: { title: "Contact" },
  footer: {
    builtWith: "built by hand with Next.js, TypeScript & plain CSS, on the schematic identity from the vanilla original.",
    security: "How this site is secured",
  },
  securityUi: {
    controls: "Controls",
    limitations: "Known limitations",
    report: "Report a vulnerability",
    threatModel: "Full threat model: SECURITY.md on GitHub",
  },
  subpage: { back: "← Back to the drawing", footerBack: "back to simonlaborde.com" },
  notFound: { title: "Off the drawing", body: "This page doesn’t exist.", home: "Back to the drawing" },

  chat: {
    tag: "LIVE QUERY CONSOLE",
    title: "Ask about my work",
    intro: "Grounded on this site’s content — a small demo of the AI/LLM work described above it.",
    dialogLabel: "Ask an assistant about Simon's work",
    close: "Close",
    you: "You",
    thinking: "Thinking",
    placeholder: "e.g. What's his strongest project?",
    inputLabel: "Your question",
    send: "Send",
    /** {email} is replaced with the contact email */
    fallback: "Couldn't reach the assistant just now — check your connection and try again, or email {email} directly.",
  },
  /** server responses from /api/chat, in the visitor's language */
  chatServer: {
    ip: "That's a lot of questions in a short time — try again in a few minutes, or email {email} directly.",
    global: "The assistant has reached today's limit — it resets at midnight UTC. In the meantime, email {email}.",
    unavailable: "The assistant is briefly unavailable — please try again shortly, or email {email}.",
    notConfigured: "This assistant isn't configured yet. Email {email} in the meantime.",
    rateLimited: "The assistant is in high demand right now — please try again shortly, or email {email}.",
    streamError: "Something went wrong answering that. Please try again, or email {email}.",
    /** sent when no draft passes the grounding check */
    unverified: "I couldn't give you an answer I can stand behind on that one. Please ask Simon directly at {email}.",
  },
};
