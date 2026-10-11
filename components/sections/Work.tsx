import WorkCarousel from "@/components/WorkCarousel";
import type { Bundle } from "@/content/i18n";
import type { Project } from "@/content/projects";

export default function Work({ projects, ui }: { projects: Project[]; ui: Bundle["ui"] }) {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <header className="sec-head">
        <h2 id="work-title">{ui.work.title}</h2>
        <p>
          {ui.work.intro} <span className="work__hint mono">{ui.work.hint}</span>
        </p>
      </header>

      <WorkCarousel projects={projects} ui={ui.carousel} />
    </section>
  );
}
