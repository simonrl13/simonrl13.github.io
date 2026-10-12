/* Copy for /services (English) — the Portuguese version, /pt/empresas, is
   the primary page and lives in content/i18n/pt.ts. Same shape in both.

   Rules: no invented prices, clients, numbers or testimonials. [PRAZO] and
   [PRICE] stay visible until Simon fills them (the assistant only quotes a
   price once [PRICE] is gone). The data commitments describe how the work
   is actually delivered — change them together with SECURITY.md.

   TODO(simon): confirm both "included" lists and every line of `data`
   before merge. "Never used to train models" is deliberately absent until
   it's verified against each AI provider's terms. */

/** Contact form field limits (max length in characters), shared by the form and /api/contact. */
export const CONTACT_FIELDS = { name: 100, business: 120, email: 254, message: 3000, messageMin: 10 } as const;

export const servicesPage = {
  title: "Project work for businesses",
  eyebrow: "Services",
  description:
    "Two fixed-scope projects for small businesses: a customer assistant that answers on WhatsApp from your own documents, and document processing that ends retyping receipts and scanned paperwork.",
  intro:
    "Two fixed-scope projects for small businesses, built by me end to end and run on my infrastructure. Each one is written below as the result you get, not the technology behind it.",

  labels: {
    included: "What’s included",
    timeline: "Timeline",
    price: "Investment",
    cta: "Ask about this project",
  },

  offers: [
    {
      id: "assistant",
      kicker: "Customer assistant",
      outcome: "Your customers get answers on WhatsApp at 11 p.m., from your own documents.",
      included: [
        "An assistant set up from the documents you already have: FAQs, price lists, policies, catalogue.",
        "Answers on your business’s WhatsApp, any time of day.",
        "Questions it can’t answer from your documents are passed to you instead of guessed.",
        "Usage and spending limits, so the running cost stays predictable.",
      ],
      timeline: "[PRAZO]",
      price: "from R$ [PRICE]",
    },
    {
      id: "documents",
      kicker: "Document processing",
      outcome: "Stop retyping receipts, boletos and scanned documents.",
      included: [
        "The fields you actually use — amounts, dates, due dates, CNPJ/CPF — pulled out automatically.",
        "Works with photos, PDFs and scanned paper.",
        "Fields it isn’t sure about are flagged for a person to check.",
        "Results delivered to a spreadsheet or to the system you already use.",
      ],
      timeline: "[PRAZO]",
      price: "from R$ [PRICE]",
    },
  ],

  data: {
    title: "How your data is handled",
    intro: "In plain language — and written into the project agreement.",
    items: [
      {
        title: "Hosted on my infrastructure, isolated per client",
        body: "Your project’s data is stored on infrastructure I run, not in your accounts, and kept separate for each client: no client can reach another client’s data.",
      },
      {
        title: "Processed by a US-based AI provider",
        body: "The AI that reads your documents and messages is run by a provider based in the United States. Under Brazil’s LGPD that is an international data transfer, and it is stated in the agreement before any data is sent.",
      },
      {
        title: "Deleted at the end of the project",
        body: "When the project ends, the client data I hold for it is deleted.",
      },
      {
        title: "This contact form",
        body: "What you send below goes straight to my email to answer you. This site doesn’t store it.",
      },
    ],
  },

  form: {
    title: "Tell me about your business",
    intro: "I reply by email.",
    name: "Your name",
    business: "Business",
    email: "Email",
    message: "What would you like to solve?",
    consent:
      "I agree that this information is used to reply to my message, as described in “How your data is handled”.",
    submit: "Send",
    sending: "Sending…",
    sent: "Thanks — your message was sent. I’ll reply by email.",
    /** {email} is replaced with the public contact address */
    failed: "Your message couldn’t be sent just now. Please try again, or email {email}.",
  },

  /** /api/contact responses, in the visitor’s language */
  server: {
    invalid: "Please check the fields and try again.",
    consent: "Please tick the consent box so I can reply.",
    ip: "Too many messages from this connection — please try again later, or email {email}.",
    global: "The form has reached today’s limit. Please email {email} instead.",
    unavailable: "The form is briefly unavailable — please try again shortly, or email {email}.",
    notConfigured: "The form isn’t set up yet. Please email {email} instead.",
  },

  footerLink: "Available for project work",
} as const;
