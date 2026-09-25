"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

type Theme = "dark" | "light";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  // keep the phone's status bar / browser chrome on the sheet's colour
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", site.themeColor[next]);
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private mode — the choice just won't persist */
  }
  listeners.forEach((l) => l());
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "dark");

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={
        theme === "dark"
          ? "Switch to whiteprint (light)"
          : "Switch to blueprint (dark)"
      }
      title={theme === "dark" ? "Whiteprint" : "Blueprint"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M12 3v18" />
        <path className="theme-toggle__fill" d="M12 3 21 3 21 21 12 21z" />
      </svg>
    </button>
  );
}
