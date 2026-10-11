import { site } from "@/content/site";
import type { Bundle } from "@/content/i18n";

export default function Languages({ ui }: { ui: Bundle["ui"] }) {
  return (
    <section id="languages" className="section languages" aria-labelledby="lang-title">
      <header className="sec-head">
        <h2 id="lang-title">{ui.languages.title}</h2>
        <p>{ui.languages.intro}</p>
      </header>

      <ul className="meter">
        {site.languages.map((lang) => (
          <li key={lang.code}>
            <p className="meter__name">
              {ui.languages.names[lang.code]}{" "}
              <span className="mono">{lang.level === "native" ? ui.languages.native : lang.level}</span>
            </p>
            <span className="meter__bar" data-level={lang.bars} data-reveal aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
