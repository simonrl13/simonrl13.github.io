import { site } from "@/content/site";
import type { Bundle } from "@/content/i18n";

export default function Origin({ copy, ui }: { copy: Bundle["site"]; ui: Bundle["ui"] }) {
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
          <span className="origin__status-label">{copy.status.label}</span>
          <span
            className="mono origin__status-detail"
            dangerouslySetInnerHTML={{ __html: copy.status.detail }}
          />
        </p>

        <p className="origin__rights">{copy.workRights}</p>

        <div className="origin__actions">
          <a className="btn btn--solid" href="#contact">
            {ui.origin.cta}
          </a>
          <a className="btn btn--ghost" href={site.links.cv} download>
            {ui.origin.cv} <span className="mono">{ui.origin.cvNote}</span>
          </a>
        </div>

        <dl className="titleblock" aria-label={ui.origin.titleBlockLabel}>
          {copy.titleBlock.map((row) => (
            <div key={row.dt} className={row.stamp ? "titleblock__stamp-host" : undefined}>
              <dt>{row.dt}</dt>
              <dd className={row.mono ? "mono" : undefined}>{row.dd}</dd>
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
