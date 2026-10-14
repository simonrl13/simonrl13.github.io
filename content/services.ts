/* Copy for /services (English) — the Portuguese version, /pt/empresas, is
   the primary page and lives in content/i18n/pt.ts. Same shape in both.

   Rules: no invented prices, clients, numbers or testimonials. No prices or
   timelines on the page (quote on request) and the assistant never states
   one. The data commitments describe how the work is actually delivered —
   change them together with SECURITY.md.

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
    audience: "Who it’s for",
    pilot: "How a pilot works",
    timeline: "Timeline",
    price: "Investment",
  },

  pilot: "A fixed-scope pilot first: the scope is agreed in writing, 50% is paid upfront, and early clients get a discount.",

  offers: [
    {
      id: "assistant",
      kicker: "Customer assistant",
      outcome: "Your customers get answers on WhatsApp at 11 p.m., from your own documents.",
      audience: "Accounting firms, clinics and course sellers.",
      included: [
        "An assistant set up from the documents you already have: FAQs, price lists, policies, catalogue.",
        "Answers on your business’s WhatsApp, any time of day.",
        "Questions it can’t answer from your documents are passed to you instead of guessed.",
        "Usage and spending limits, so usage costs stay predictable.",
      ],
      timeline: "Agreed in the proposal",
      price: "Request a quote",
    },
    {
      id: "documents",
      kicker: "Document processing",
      outcome: "Stop retyping receipts, boletos and scanned documents.",
      audience: "Accounting firms and distributors.",
      included: [
        "The fields you actually use — amounts, dates, due dates, CNPJ/CPF — pulled out automatically.",
        "Works with photos, PDFs and scanned paper.",
        "Fields it isn’t sure about are flagged for a person to check.",
        "Results delivered to a spreadsheet, or in a format your system can import.",
      ],
      timeline: "Agreed in the proposal",
      price: "Request a quote",
    },
  ],

  data: {
    title: "How your data is handled",
    intro: "In plain language — and written into the project agreement.",
    items: [
      // TODO(simon): per-tenant isolation test required before the first pilot.
      {
        title: "Hosted on my infrastructure, isolated per client",
        body: "By default, your project’s data is stored on infrastructure I run, not in your accounts, and kept separate for each client: no client can reach another client’s data.",
      },
      {
        title: "Processed by a US-based AI provider",
        body: "The AI that reads your documents and messages is run by a provider based in the United States. Under Brazil’s LGPD that is an international data transfer, and it is stated in the agreement before any data is sent.",
      },
      {
        title: "Deleted at the end of the project",
        body: "When the project ends, the client data I hold for it is deleted. The providers used (AI and email) keep temporary logs under their own terms, described in the agreement.",
      },
    ],
  },

  form: {
    title: "Tell me about your business",
    intro: "I reply by email.",
    privacy:
      "This form collects your name, business, email and message. Once it’s enabled, they will be delivered to my inbox by email through Resend, a US-based email service, only so I can reply; until then, sending the form shows my email address instead. Resend keeps a temporary copy of the message. Nothing is stored on this site.",
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
