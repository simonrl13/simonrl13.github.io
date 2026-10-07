import WorkCarousel from "@/components/WorkCarousel";

export default function Work() {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <header className="sec-head">
        <h2 id="work-title">Selected work</h2>
        <p>
          Six projects, six problems. Each drawing is styled after what the
          thing actually is. <span className="work__hint mono">scroll →</span>
        </p>
      </header>

      <WorkCarousel />
    </section>
  );
}
