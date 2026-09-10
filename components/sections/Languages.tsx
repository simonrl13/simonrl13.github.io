import { site } from "@/content/site";

export default function Languages() {
  return (
    <section
      id="languages"
      className="section languages"
      aria-labelledby="lang-title"
    >
      <header className="sec-head">
        <h2 id="lang-title">Languages</h2>
        <p>
          Multilingual and Europe-bound — measured on the CEFR scale, read like a
          signal meter.
        </p>
      </header>

      <ul className="meter">
        {site.languages.map((lang) => (
          <li key={lang.code}>
            <p className="meter__name">
              {lang.name} <span className="mono">{lang.level}</span>
            </p>
            <span
              className="meter__bar"
              data-level={lang.bars}
              aria-hidden="true"
            >
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
