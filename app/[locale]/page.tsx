import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import SheetFrame from "@/components/SheetFrame";
import RevealController from "@/components/RevealController";
import ChatConsole from "@/components/ChatConsole";
import Origin from "@/components/sections/Origin";
import Journey from "@/components/sections/Journey";
import Arsenal from "@/components/sections/Arsenal";
import Work from "@/components/sections/Work";
import Pipeline from "@/components/sections/Pipeline";
import Languages from "@/components/sections/Languages";
import Contact from "@/components/sections/Contact";
import { alternatesFor, fill, getBundle, languageAlternates, localizedProjects } from "@/content/i18n";
import { pathFor } from "@/content/i18n/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { alternates: languageAlternates((await params).locale) };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const b = getBundle(locale);
  const { ui } = b;

  return (
    <>
      <SiteChrome ui={ui} locale={locale} alternates={alternatesFor()} />
      <SheetFrame />
      <RevealController />
      <ChatConsole
        copy={b.site}
        ui={{ ...ui.chat, fallback: fill(ui.chat.fallback) }}
        locale={locale}
        securityHref={pathFor(locale, "security")}
      />

      <main>
        <Origin copy={b.site} ui={ui} />
        <Journey items={b.journey} ui={ui} />
        <Arsenal arsenal={b.arsenal} ui={ui} />
        <Work projects={localizedProjects(b)} ui={ui} />
        <Pipeline pipeline={b.pipeline} ui={ui} />
        <Languages ui={ui} />
        <Contact copy={b.site} ui={ui} />
      </main>

      <footer className="foot">
        <p>
          <span className="mono">SL&#8209;2026 · rev. 2026.5</span> — {ui.footer.builtWith}{" "}
          <a href={pathFor(locale, "security")}>{ui.footer.security}</a>.
        </p>
      </footer>
    </>
  );
}
