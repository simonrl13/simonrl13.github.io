import { site } from "@/content/site";
import type { Bundle } from "@/content/i18n";

export default function Contact({ copy, ui }: { copy: Bundle["site"]; ui: Bundle["ui"] }) {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <header className="sec-head">
        <h2 id="contact-title">{ui.contact.title}</h2>
        <p>{copy.contactIntro}</p>
      </header>

      <p className="contact__rights">{copy.workRights}</p>

      <ul className="contact__list">
        <li>
          <span className="contact__k mono">EMAIL</span>
          <a href={`mailto:${site.links.email}`}>{site.links.email}</a>
        </li>
        <li>
          <span className="contact__k mono">GITHUB</span>
          <a href={site.links.github} target="_blank" rel="noopener noreferrer">
            {site.links.githubHandle}
          </a>
        </li>
        <li>
          <span className="contact__k mono">LINKEDIN</span>
          <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
            {site.links.linkedinHandle}
          </a>
        </li>
        <li>
          <span className="contact__k mono">CV</span>
          <span className="contact__cvs">
            {site.links.cvs.map((c) => (
              <a key={c.lang} href={c.href} download={c.file} hrefLang={c.lang}>
                {c.file}
              </a>
            ))}
          </span>
        </li>
      </ul>
    </section>
  );
}
