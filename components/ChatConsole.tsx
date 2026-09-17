"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

type ChatMsg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's his experience with LLMs and agents?",
  "Tell me about the Lattes pipeline.",
  "Has he shipped anything to production?",
  "Is he open to freelance work in Europe?",
];

const FALLBACK_MESSAGE = `This assistant only runs on the live deployment — you're viewing a copy that can't reach it. Ask on the main site, or email ${site.links.email} directly.`;

/** A short plain-text error body actually read from our own /api/chat
 * response (rate limited, misconfigured, etc.) — distinct from a generic
 * fetch/JS exception, so the catch block never shows a raw "Failed to
 * fetch" or similar to the visitor. */
class ServerMessage extends Error {}

export default function ChatConsole() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => launcherRef.current?.focus();
    dlg.addEventListener("close", onClose);
    return () => dlg.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  const openConsole = () => {
    dialogRef.current?.showModal();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const r = dlg.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    ) {
      dlg.close();
    }
  };

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    const history = [...messages, { role: "user" as const, content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      // trailing slash avoids an extra 308 redirect hop (next.config sets
      // trailingSlash: true for the static-export build's routing)
      const res = await fetch("/api/chat/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-8) }),
      });

      if (!res.ok || !res.body) {
        // a real answer never comes back non-OK, so any short plain-text
        // body here is one of the endpoint's own friendly error messages
        // (rate limited, misconfigured); anything longer/HTML is some
        // other host's 404 page — e.g. this copy running where there's no
        // server for /api/chat at all — and falls through to the generic
        // FALLBACK_MESSAGE below instead. Tagged so the catch block never
        // confuses this for a generic fetch/JS exception message.
        const text = await res.text().catch(() => "");
        throw new ServerMessage(text);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      if (!acc.trim()) throw new Error("empty response");
    } catch (err) {
      const serverText = err instanceof ServerMessage ? err.message : "";
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = {
          role: "assistant",
          content: serverText && serverText.length < 300 ? serverText : FALLBACK_MESSAGE,
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className="chat-launcher"
        ref={launcherRef}
        onClick={openConsole}
        aria-haspopup="dialog"
      >
        <span className="chat-launcher__dot" aria-hidden="true" />
        <span className="mono">ASK ABOUT MY WORK</span>
      </button>

      <dialog
        className="sheet sheet--chat"
        ref={dialogRef}
        onClick={handleBackdrop}
        aria-label="Ask an assistant about Simon's work"
      >
        <form method="dialog">
          <button className="sheet__close" aria-label="Close" value="close">
            &times;
          </button>
        </form>

        <p className="sheet__tag mono">LIVE QUERY CONSOLE</p>
        <h2>Ask about my work</h2>
        <p className="chat__intro">
          Grounded on this site&rsquo;s content — a small demo of the AI/LLM work described above it.
        </p>

        <div className="chat__log" ref={logRef} role="log" aria-live="polite">
          {messages.length === 0 && (
            <div className="chat__suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} disabled={busy}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat__msg chat__msg--${m.role}`}>
              <span className="chat__role mono">{m.role === "user" ? "You" : "SL·AI"}</span>
              <p>
                {m.content || (
                  <span className="chat__typing" aria-label="Thinking">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        <form
          className="chat__form"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={inputRef}
            className="chat__input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. What's his strongest project?"
            maxLength={300}
            disabled={busy}
            aria-label="Your question"
          />
          <button className="chat__send" type="submit" disabled={busy || !input.trim()}>
            Send
          </button>
        </form>
        <p className="chat__note">
          Answers are AI-generated from this site&rsquo;s content — verify anything important with
          Simon directly.
        </p>
      </dialog>
    </>
  );
}
