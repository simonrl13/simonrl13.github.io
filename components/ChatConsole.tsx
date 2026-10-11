"use client";

import { useEffect, useRef, useState } from "react";
import type { Bundle } from "@/content/i18n";

type ChatMsg = { role: "user" | "assistant"; content: string };

/** A short plain-text error body actually read from our own /api/chat
 * response (rate limited, misconfigured, etc.) — distinct from a generic
 * fetch/JS exception, so the catch block never shows a raw "Failed to
 * fetch" or similar to the visitor. */
class ServerMessage extends Error {}

/** `ui.fallback` arrives with {email} already filled in by the server. */
export default function ChatConsole({
  copy,
  ui,
  locale,
  securityHref,
}: {
  copy: Bundle["site"];
  ui: Bundle["ui"]["chat"];
  locale: string;
  securityHref: string;
}) {
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
    // only jump to the input with a mouse — on a phone that pops the keyboard
    // over the suggested questions; showModal already focuses the close button
    if (window.matchMedia("(pointer: fine)").matches) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
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
      // trailingSlash: true so existing URLs keep their shape)
      const res = await fetch("/api/chat/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-8), locale }),
      });

      if (!res.ok || !res.body) {
        // a real answer never comes back non-OK, so any short plain-text
        // body here is one of the endpoint's own friendly error messages
        // (rate limited, misconfigured); anything longer/HTML is some
        // other host's 404 page — e.g. this copy running where there's no
        // server for /api/chat at all — and falls through to the generic
        // ui.fallback below instead. Tagged so the catch block never
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
          const next = m.slice();
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }
      if (!acc.trim()) throw new Error("empty response");
    } catch (err) {
      const serverText = err instanceof ServerMessage ? err.message : "";
      setMessages((m) => {
        const next = m.slice();
        next[next.length - 1] = {
          role: "assistant",
          content: serverText && serverText.length < 300 ? serverText : ui.fallback,
        };
        return next;
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
        aria-label={copy.chatLauncher.full.toLowerCase()}
      >
        <span className="chat-launcher__dot" aria-hidden="true" />
        <span className="mono chat-launcher__full">{copy.chatLauncher.full}</span>
        <span className="mono chat-launcher__short" aria-hidden="true">
          {copy.chatLauncher.short}
        </span>
      </button>

      <dialog
        className="sheet sheet--chat"
        ref={dialogRef}
        onClick={handleBackdrop}
        aria-label={ui.dialogLabel}
      >
        <form method="dialog">
          <button className="sheet__close" aria-label={ui.close} value="close">
            &times;
          </button>
        </form>

        <p className="sheet__tag mono">{ui.tag}</p>
        <h2>{ui.title}</h2>
        <p className="chat__intro">{ui.intro}</p>

        <div className="chat__log" ref={logRef} role="log" aria-live="polite">
          {messages.length === 0 && (
            <div className="chat__suggestions">
              {copy.chatSuggestions.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} disabled={busy}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat__msg chat__msg--${m.role}`}>
              <span className="chat__role mono">{m.role === "user" ? ui.you : "SL·AI"}</span>
              <p>
                {m.content || (
                  <span className="chat__typing" aria-label={ui.thinking}>
                    <i />
                    <i />
                    <i />
                  </span>
                )}
                {/* terminal cursor while the answer is still streaming in */}
                {busy && m.content && i === messages.length - 1 && (
                  <span className="chat__cursor" aria-hidden="true" />
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
            placeholder={ui.placeholder}
            maxLength={300}
            enterKeyHint="send"
            autoComplete="off"
            disabled={busy}
            aria-label={ui.inputLabel}
          />
          <button className="chat__send" type="submit" disabled={busy || !input.trim()}>
            {ui.send}
          </button>
        </form>
        <p className="chat__note">{copy.chatNotice.accuracy}</p>
        <p className="chat__note chat__note--privacy">{copy.chatNotice.privacy}</p>
        <p className="chat__note">
          <a href={securityHref}>{copy.chatNotice.securityLink} →</a>
        </p>
      </dialog>
    </>
  );
}
