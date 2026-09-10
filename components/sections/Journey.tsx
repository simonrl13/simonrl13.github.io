import { journey } from "@/content/site";

export default function Journey() {
  return (
    <section
      id="journey"
      className="section journey"
      aria-labelledby="journey-title"
    >
      <header className="sec-head">
        <h2 id="journey-title">Journey</h2>
        <p>
          One throughline: learning how systems behave, then making them serve
          real needs — from physics engines to research infrastructure.
        </p>
      </header>

      <ol className="journey__list">
        {journey.map((item) => (
          <li className="jitem" key={item.title}>
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
