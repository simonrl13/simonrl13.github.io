import type { Bundle } from "@/content/i18n";

export default function Journey({ items, ui }: { items: Bundle["journey"]; ui: Bundle["ui"] }) {
  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <header className="sec-head">
        <h2 id="journey-title">{ui.journey.title}</h2>
        <p>{ui.journey.intro}</p>
      </header>

      <ol className="journey__list">
        {items.map((item) => (
          <li className="jitem" key={item.when + item.title}>
            <p className="jitem__when mono">{item.when}</p>
            <div className="jitem__body">
              <h3>{item.title}</h3>
              <p className="jitem__org">{item.org}</p>
              <p dangerouslySetInnerHTML={{ __html: item.body }} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
