import { site } from "@/content/site";
import type { Bundle } from "@/content/i18n";
import MapDraft from "@/components/MapDraft";
import { BEARING_TO_PARIS, KM_TO_PARIS, bearingLabel } from "@/content/geo";

export default function Origin({ copy, ui }: { copy: Bundle["site"]; ui: Bundle["ui"] }) {
  // the CV in the page's language on the button; the locale's others beside it
  const cv = site.links.cvs.find((c) => c.lang === ui.meta.htmlLang) ?? site.links.cvs[0];
  const otherCvs = site.links.cvs.filter((c) => ui.origin.cvOthers.includes(c.lang));
  return (
    <section id="origin" className="section origin" aria-labelledby="origin-name">
      <div className="origin__frame">
        <span
          className="origin__dim origin__dim--top"
          aria-hidden="true"
          data-label={ui.origin.dimLabel}
        />
        <span className="origin__dim origin__dim--left" aria-hidden="true" />

        <p className="origin__eyebrow">
          <span className="mono">{ui.origin.eyebrow}&nbsp;SL&#8209;2026</span>
          <span className="origin__stamp-role">{copy.role}</span>
        </p>

        <h1 id="origin-name">{site.name}</h1>

        <p className="origin__role" dangerouslySetInnerHTML={{ __html: copy.roleLine }} />

        <p className="origin__thesis" dangerouslySetInnerHTML={{ __html: copy.thesis }} />

        <p className="origin__status">
          <span className="mono origin__status-label">
            {ui.origin.statusKey} <span className="origin__status-dot" aria-hidden="true" /> {copy.status.label}
          </span>
          <span className="origin__status-detail" dangerouslySetInnerHTML={{ __html: copy.status.detail }} />
        </p>

        <p className="origin__rights">{copy.workRights}</p>

        <div className="origin__actions">
          <a className="btn btn--solid" href="#contact">
            {ui.origin.cta}
          </a>
          <a className="btn btn--ghost" href={cv.href} download={cv.file}>
            {ui.origin.cv} <span className="mono">{ui.origin.cvNote}</span>
          </a>
          {/* the other languages, each named in its own language */}
          <p className="origin__cv-others">
            {otherCvs.map((c) => (
              <a key={c.lang} href={c.href} download={c.file} lang={c.lang} hrefLang={c.lang}>
                {c.label}
              </a>
            ))}
          </p>
        </div>

        {/* the drafted map: a layer behind the hero on wide screens, a figure here on small ones */}
        <MapDraft
          km={`${new Intl.NumberFormat(ui.meta.htmlLang).format(KM_TO_PARIS)} km`}
          bearing={ui.origin.bearingLabel.replace("{deg}", bearingLabel(BEARING_TO_PARIS))}
        />

        <dl className="titleblock" aria-label={ui.origin.titleBlockLabel}>
          {copy.titleBlock.map((row) => (
            <div
              key={row.dt}
              className={row.stamp ? "titleblock__stamp-host" : undefined}
            >
              <dt>{row.dt}</dt>
              <dd className={row.sign ? "titleblock__sign" : row.mono ? "mono" : undefined}>{row.dd}</dd>
            </div>
          ))}
        </dl>

        <ul className="origin__legend" aria-label={ui.origin.languagesLabel}>
          {site.languages.map((lang) => (
            <li key={lang.code}>
              <span className="origin__lg-code mono">{lang.code}</span>{" "}
              {ui.languages.names[lang.code]} — {lang.level === "native" ? ui.languages.native : lang.level}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
