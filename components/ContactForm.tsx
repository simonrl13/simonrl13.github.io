"use client";

import { useState } from "react";
import type { Bundle } from "@/content/i18n";
import { CONTACT_FIELDS } from "@/content/services";

/* Posts to /api/contact/, which validates everything again — the browser
   checks here are only for the visitor's convenience. The "website" field
   is a honeypot: hidden from people, filled by naive bots. */

type FormCopy = Bundle["services"]["form"];
type State = { kind: "idle" | "sending" | "sent" } | { kind: "error"; text: string };

export default function ContactForm({ copy, locale }: { copy: FormCopy; locale: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business: data.get("business"),
          email: data.get("email"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
          locale,
        }),
      });
      if (res.ok) {
        form.reset();
        setState({ kind: "sent" });
        return;
      }
      // the endpoint's own short messages; anything else is the generic one
      const text = await res.text().catch(() => "");
      setState({ kind: "error", text: text && text.length < 300 ? text : copy.failed });
    } catch {
      setState({ kind: "error", text: copy.failed });
    }
  }

  return (
    <form className="cform" onSubmit={submit}>
      <label className="cform__field">
        <span>{copy.name}</span>
        <input name="name" required maxLength={CONTACT_FIELDS.name} autoComplete="name" />
      </label>
      <label className="cform__field">
        <span>{copy.business}</span>
        <input name="business" required maxLength={CONTACT_FIELDS.business} autoComplete="organization" />
      </label>
      <label className="cform__field">
        <span>{copy.email}</span>
        <input name="email" type="email" required maxLength={CONTACT_FIELDS.email} autoComplete="email" />
      </label>
      <label className="cform__field cform__field--wide">
        <span>{copy.message}</span>
        <textarea name="message" required minLength={CONTACT_FIELDS.messageMin} maxLength={CONTACT_FIELDS.message} rows={6} />
      </label>
      <label className="cform__hp" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="cform__consent">
        <input type="checkbox" name="consent" required />
        <span>{copy.consent}</span>
      </label>
      <div className="cform__actions">
        <button className="btn btn--solid" type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? copy.sending : copy.submit}
        </button>
        <p className="cform__status" role="status" aria-live="polite">
          {state.kind === "sent" ? copy.sent : state.kind === "error" ? state.text : ""}
        </p>
      </div>
    </form>
  );
}
