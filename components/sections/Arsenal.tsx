import { arsenal, site, type ArsenalRow } from "@/content/site";

const ICONS: Record<ArsenalRow["icon"], React.ReactNode> = {
  code: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M8 12h8M12 8v8" />
    </>
  ),
  ai: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 7l3 3m4 0l3-3M7 17l3-3m4 0l3 3" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </>
  ),
  frontend: (
    <>
      <rect x="2" y="4" width="20" height="14" rx="1" />
      <path d="M2 9h20M6 22h12" />
    </>
  ),
  infra: (
    <>
      <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" />
      <path d="M12 2v18M4 6.5l8 4.5 8-4.5" />
    </>
  ),
  test: <path d="M4 12l5 5L20 6" />,
};

export default function Arsenal() {
  return (
    <section
      id="arsenal"
      className="section arsenal"
      aria-labelledby="arsenal-title"
    >
      <header className="sec-head">
        <h2 id="arsenal-title">Technical arsenal</h2>
        <p>
          Read as a legend, not a tag cloud — grouped by the layer of the system
          each part touches.
        </p>
      </header>

      <div className="legend">
        {arsenal.map((row) => (
          <div className="legend__row" key={row.title}>
            <span className="legend__key" aria-hidden="true">
              <svg viewBox="0 0 24 24">{ICONS[row.icon]}</svg>
            </span>
            <div className="legend__def">
              <h3>{row.title}</h3>
              <p>{row.items}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="legend legend--credentials">
        <div className="legend__row">
          <span className="legend__key" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.3 7.2 16.7l.9-5.4L4.2 7.7l5.4-.8z" />
            </svg>
          </span>
          <div className="legend__def">
            <h3>Credentials</h3>
            <p>{site.credentials.join(" · ")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
