import { site } from "@/content/site";
import type { Bundle } from "@/content/i18n";
import { BEARING_TO_PARIS, bearingLabel } from "@/content/geo";

/* The survey construction drawn on first load: a survey mark at the origin,
   a north reference, a compass arc swung from north to the bearing, then the
   bearing line itself at the computed initial great-circle bearing to Paris.
   Decorative (aria-hidden): the title block already states Origin and
   Bearing as text. Wide screens get the full construction in the hero's
   empty right side; below that, the Bearing cell shows the survey mark and
   the label only (no room for the arc and line). */
function SurveyMark() {
  return (
    <svg className="survey__mark" viewBox="-12 -12 24 24">
      <circle r="5" />
      <path d="M -10 0 H 10 M 0 -10 V 10" />
    </svg>
  );
}

function Survey({ label }: { label: string }) {
  return (
    <span className="survey" aria-hidden="true" style={{ ["--brg" as string]: `${BEARING_TO_PARIS}deg` }}>
      <span className="survey__north" />
      <svg className="survey__arc" viewBox="-60 -60 120 120">
        {/* r = 48, from north (0°) clockwise to the bearing */}
        <path
          d={`M 0 -48 A 48 48 0 0 1 ${(48 * Math.sin((BEARING_TO_PARIS * Math.PI) / 180)).toFixed(2)} ${(-48 * Math.cos((BEARING_TO_PARIS * Math.PI) / 180)).toFixed(2)}`}
          pathLength={1}
        />
      </svg>
      <span className="survey__line" />
      <SurveyMark />
      <span className="survey__label mono">{label}</span>
    </span>
  );
}

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

        {/* wide screens: the full construction, above the title block */}
        <div className="survey-plot">
          <Survey label={ui.origin.bearingLabel.replace("{deg}", bearingLabel(BEARING_TO_PARIS))} />
        </div>

        <dl className="titleblock" aria-label={ui.origin.titleBlockLabel}>
          {copy.titleBlock.map((row) => (
            <div
              key={row.dt}
              className={row.stamp ? "titleblock__stamp-host" : undefined}
            >
              <dt>{row.dt}</dt>
              <dd className={row.mono ? "mono" : undefined}>
                {row.dd}
                {row.survey && (
                  <span className="survey__brg mono" aria-hidden="true">
                    <SurveyMark />
                    {ui.origin.bearingLabel.replace("{deg}", bearingLabel(BEARING_TO_PARIS))}
                  </span>
                )}
              </dd>
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
