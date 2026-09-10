import { site } from "@/content/site";

export default function Contact() {
  return (
    <section
      id="contact"
      className="section contact"
      aria-labelledby="contact-title"
    >
      <header className="sec-head">
        <h2 id="contact-title">Contact</h2>
        <p>
          Open to master&rsquo;s program conversations, freelance, and contract
          work in Europe.
        </p>
      </header>

      <ul className="contact__list">
        <li>
          <span className="contact__k mono">EMAIL</span>
          <a href={`mailto:${site.links.email}`}>{site.links.email}</a>
        </li>
        <li>
          <span className="contact__k mono">GITHUB</span>
          <a href={site.links.github} target="_blank" rel="noopener">
            {site.links.githubHandle}
          </a>
        </li>
        <li>
          <span className="contact__k mono">LINKEDIN</span>
          <a href={site.links.linkedin} target="_blank" rel="noopener">
            {site.links.linkedinHandle}
          </a>
        </li>
        <li>
          <span className="contact__k mono">CV</span>
          <a href={site.links.cv} download>
            {site.links.cvName}
          </a>
        </li>
      </ul>
    </section>
  );
}
