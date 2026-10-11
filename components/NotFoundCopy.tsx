"use client";

import { useSyncExternalStore } from "react";

type Copy = { title: string; body: string; home: string; lang: string; href: string };

const noSubscribe = () => () => {};

export default function NotFoundCopy({ copy }: { copy: Record<string, Copy> }) {
  // the 404 is prerendered once, so the server snapshot is the default
  // locale; the URL's language takes over right after hydration
  const first = useSyncExternalStore(noSubscribe, () => location.pathname.split("/")[1], () => "");
  // English URLs carry no prefix, so anything unmatched falls back to the first (default) locale
  const t = Object.hasOwn(copy, first) ? copy[first] : Object.values(copy)[0];
  return (
    <header className="sec-head" lang={t.lang}>
      <div>
        <p className="sec-head__eyebrow mono">404</p>
        <h1>{t.title}</h1>
      </div>
      <p>
        {t.body} <a href={t.href}>{t.home} →</a>
      </p>
    </header>
  );
}
