import SiteChrome from "@/components/SiteChrome";
import SheetFrame from "@/components/SheetFrame";
import RevealController from "@/components/RevealController";
import Origin from "@/components/sections/Origin";
import Journey from "@/components/sections/Journey";
import Arsenal from "@/components/sections/Arsenal";
import Work from "@/components/sections/Work";
import Pipeline from "@/components/sections/Pipeline";
import Languages from "@/components/sections/Languages";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <SiteChrome />
      <SheetFrame />
      <RevealController />

      <main>
        <Origin />
        <Journey />
        <Arsenal />
        <Work />
        <Pipeline />
        <Languages />
        <Contact />
      </main>

      <footer className="foot">
        <p>
          <span className="mono">SL&#8209;2026 · rev. 2026.5</span> — built by
          hand with Next.js, TypeScript &amp; plain CSS, on the schematic identity
          from the vanilla original.
        </p>
      </footer>
    </>
  );
}
