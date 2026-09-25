"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/projects";
import IsoStack from "@/components/IsoStack";

/* ---------- per-project skin widgets ---------- */

function Skin({ skin }: { skin: Project["skin"] }) {
  switch (skin.kind) {
    case "clinical":
      return (
        <>
          <dl className="vitals">
            {skin.vitals.map((v) => {
              const numeric = !Number.isNaN(Number(v.value));
              return (
                <div
                  key={v.dt}
                  data-reveal
                  {...(numeric ? { "data-count": "" } : {})}
                >
                  <dt>{v.dt}</dt>
                  <dd>
                    <span className="vitals__n" data-count={v.value}>
                      {v.value}
                    </span>
                    <span>{v.unit ?? ""}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
          <svg
            className="ecg"
            viewBox="0 0 320 40"
            preserveAspectRatio="none"
            aria-hidden="true"
            data-reveal
          >
            <path d={skin.ecgPath} />
          </svg>
        </>
      );
    case "game":
      return (
        <>
          <div className="xp">
            <div className="xp__meta">
              <span>{skin.xpMeta}</span>
              <span className="mono">{skin.xpAmount}</span>
            </div>
            <div className="xp__bar" data-reveal>
              <span style={{ width: `${skin.xpPercent}%` }} />
            </div>
          </div>
          <ol className="board">
            {skin.board.map((row) => (
              <li key={row.pos} className={row.you ? "board__you" : undefined}>
                <span className="board__pos mono">{row.pos}</span>
                <span>{row.name}</span>
                <span className="board__pts mono">{row.pts}</span>
              </li>
            ))}
          </ol>
        </>
      );
    case "term":
      return (
        <pre className="termlog mono" aria-hidden="true">
          <code>{skin.log}</code>
        </pre>
      );
    case "lab":
      return null;
  }
}

function LabBody({ skin }: { skin: Extract<Project["skin"], { kind: "lab" }> }) {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  return (
    <>
      <div className="lang-switch" role="group" aria-label="Card language">
        <button
          type="button"
          aria-pressed={lang === "pt"}
          onClick={() => setLang("pt")}
        >
          PT
        </button>
        <button
          type="button"
          aria-pressed={lang === "en"}
          onClick={() => setLang("en")}
        >
          EN
        </button>
      </div>
      <p className="pcard__lead" lang={lang}>
        {lang === "pt" ? skin.leadPt : skin.leadEn}
      </p>
      <p className="pcard__note" lang={lang}>
        {lang === "pt" ? skin.notePt : skin.noteEn}
      </p>
    </>
  );
}

/* ---------- dialog ---------- */

function ProjectDialog({
  project,
  open,
  onClose,
}: {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dlg = ref.current;
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

  return (
    <dialog
      className="sheet"
      id="sheet"
      ref={ref}
      onClose={onClose}
      onClick={handleBackdrop}
    >
      <form method="dialog">
        <button className="sheet__close" aria-label="Close" value="close">
          &times;
        </button>
      </form>
      {project && (
        <>
          <p className="sheet__tag mono">{project.tag}</p>
          <h2>{project.dialogTitle ?? project.title}</h2>
          <div className="sheet__iso">
            <IsoStack layers={project.layers} className="iso--lg" />
          </div>
          <p className="sheet__body">{project.detail.body}</p>
          <dl className="sheet__meta">
            <div>
              <dt>Role</dt>
              <dd>{project.detail.role}</dd>
            </div>
            <div>
              <dt>Outcome</dt>
              <dd>{project.detail.outcome}</dd>
            </div>
          </dl>
          <p className="sheet__stack mono">{project.detail.stack}</p>
          {project.links && project.links.length > 0 && (
            <p className="sheet__links">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                >
                  {l.label} ↗
                </a>
              ))}
            </p>
          )}
        </>
      )}
    </dialog>
  );
}

/* ---------- carousel ---------- */

export default function WorkCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dotRefs = useRef<(HTMLLIElement | null)[]>([]);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLButtonElement | null>(null);

  // `active` outlives the dialog closing, so the sheet keeps its content
  // while it animates out; `open` alone drives showModal/close.
  const [active, setActive] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cardStep = useCallback(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLLIElement[];
    if (cards.length > 1) {
      return (
        cards[1].getBoundingClientRect().left -
        cards[0].getBoundingClientRect().left
      );
    }
    return cards[0]?.getBoundingClientRect().width ?? 0;
  }, []);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLLIElement[];
    const trackMid = track.getBoundingClientRect().left + track.clientWidth / 2;

    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const cardMid =
        card.getBoundingClientRect().left +
        card.getBoundingClientRect().width / 2;
      const d = Math.abs(cardMid - trackMid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });

    dotRefs.current.forEach((dot, di) =>
      dot?.classList.toggle("is-active", di === best),
    );

    const atStart = track.scrollLeft <= 2;
    const atEnd =
      track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    if (prevRef.current) prevRef.current.disabled = atStart;
    if (nextRef.current) nextRef.current.disabled = atEnd;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let ticking = false;
    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        sync();
        ticking = false;
      });
    };
    track.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    return () => {
      track.removeEventListener("scroll", handler);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollByDir = (dir: number) => {
    trackRef.current?.scrollBy({
      left: dir * cardStep(),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const openDialog = (project: Project, e: React.MouseEvent<HTMLButtonElement>) => {
    lastFocused.current = e.currentTarget;
    setActive(project);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    lastFocused.current?.focus();
  };

  return (
    <div className="carousel">
      <ul
        className="carousel__track"
        ref={trackRef}
        tabIndex={0}
        aria-label="Project carousel, scrollable"
      >
        {projects.map((p, i) => (
          <li
            key={p.id}
            className={`pcard ${p.skinClass}`}
            id={`proj-${p.id}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <div className="pcard__inner">
              <p className="pcard__tag mono">{p.tag}</p>
              <h3>{p.title}</h3>

              <div className="pcard__iso">
                <IsoStack layers={p.layers} />
              </div>

              {p.skin.kind === "lab" ? (
                <LabBody skin={p.skin} />
              ) : (
                <p className="pcard__lead">{p.lead}</p>
              )}

              <Skin skin={p.skin} />

              {p.links && p.links.length > 0 && (
                <p className="pcard__links">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </p>
              )}

              <div className="pcard__actions">
                <button
                  className="pcard__more"
                  onClick={(e) => openDialog(p, e)}
                >
                  Read the full drawing
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="carousel__ctrl">
        <button
          className="carousel__btn"
          ref={prevRef}
          onClick={() => scrollByDir(-1)}
          aria-label="Previous project"
        >
          &larr;
        </button>
        <ol className="carousel__dots" aria-hidden="true">
          {projects.map((p, i) => (
            <li
              key={p.id}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
            />
          ))}
        </ol>
        <button
          className="carousel__btn"
          ref={nextRef}
          onClick={() => scrollByDir(1)}
          aria-label="Next project"
        >
          &rarr;
        </button>
      </div>

      <ProjectDialog project={active} open={open} onClose={closeDialog} />
    </div>
  );
}
