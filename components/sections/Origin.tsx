import { site } from "@/content/site";

export default function Origin() {
  return (
    <section id="origin" className="section origin" aria-labelledby="origin-name">
      <div className="origin__frame">
        <p className="origin__eyebrow">
          <span className="mono">DRAWING&nbsp;SL&#8209;2026</span>
          <span className="origin__stamp-role">{site.role}</span>
        </p>

        <h1 id="origin-name">{site.name}</h1>

        <p
          className="origin__role"
          dangerouslySetInnerHTML={{ __html: site.roleLine }}
        />

        <p
          className="origin__thesis"
          dangerouslySetInnerHTML={{ __html: site.thesis }}
        />

        <p className="origin__status">
          <span className="origin__status-label">{site.status.label}</span>
          <span
            className="mono origin__status-detail"
            dangerouslySetInnerHTML={{ __html: site.status.detail }}
          />
        </p>

        <div className="origin__actions">
          <a className="btn btn--solid" href="#contact">
            Start a conversation
          </a>
          <a className="btn btn--ghost" href={site.links.cv} download>
            Download CV <span className="mono">(PDF)</span>
          </a>
        </div>

        <dl className="titleblock" aria-label="Drawing title block">
          {site.titleBlock.map((row) => (
            <div key={row.dt}>
              <dt>{row.dt}</dt>
              <dd className={row.mono ? "mono" : undefined}>{row.dd}</dd>
            </div>
          ))}
        </dl>

        <ul className="origin__legend" aria-label="Spoken languages">
          {site.languages.map((lang) => (
            <li key={lang.code}>
              <span className="origin__lg-code mono">{lang.code}</span>{" "}
              {lang.name} — {lang.level}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
