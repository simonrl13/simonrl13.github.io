# Design references

Inspiration research for simonlaborde.com. Techniques only: never copy a site's
layout, code, text, images or fonts, and never hotlink or download their assets.

## 2026-11-01 — Pushing the blueprint theme ("checked before they ship")

Goal: Awwwards-level polish without losing the drafting concept (navy / cream /
copper, Fraunces + JetBrains Mono, the drafted map, S. LABORDE / AS-BUILT stamps).
Constraints for any direction: copy, chat and the three locales unchanged; a calm,
complete reduced-motion version; Lighthouse mobile performance and accessibility
≥ 90; name, role and contact readable within 2 s; no new script origins; works at
375 px.

### References

| Reference | What makes it feel grand | Mapping onto the blueprint | Cost / watch-out |
| --- | --- | --- | --- |
| [Lando Norris](https://landonorris.com/) by OFF+BRAND ([Awwwards](https://www.awwwards.com/sites/lando-norris), SOTD 17 Nov 2025) | Strict two-colour palette, oversized type in motion, WebGL | Copper used only for the "verified" moment, so it means something | WebGL + GSAP; accessibility 7.0/10, its lowest dev score |
| [Messenger](https://messenger.abeto.co) by abeto ([Awwwards](https://www.awwwards.com/sites/messenger), SOTD 10 Nov 2025) | An explorable Three.js planet; motion 9.0, performance 8.8 | Benchmark only: our "world" is the map, which exists | Three.js; wrong scale for a 30-second skim |
| [Bruno Simon](https://bruno-simon.com) (SOTM Jan 2026) | A portfolio you drive through in 3D | Same lesson: content first | Heavy WebGL; not skimmable |
| [Mat Voyce](https://matvoyce.tv) (via a [juror's 2026 roundup](https://www.hontran.dev/blog/best-award-winning-websites-2026)) | Kinetic type, timed never to block reading | Headings that "measure themselves" with a dimension line | GSAP; headings only |
| [By-Kin](https://by-kin.com/) (same roundup) | Next.js + GSAP, one continuous surface | The page as one drawing sheet (Direction A) | Smooth-scroll fights native scroll and screen readers |
| [Uncommon Studio](https://uncommonstudio.com.au/) (same roundup) | Deliberate grid breaks, camera-move section changes | Reuse the map camera's grammar between sections | Needs a reduced-motion cut |
| [MERSI architecture](https://www.mersi-architecture.com) ([Awwwards](https://www.awwwards.com/sites/mersi), SOTD 10 Apr 2026) | Paper #EDE7DE + near-black, horizontal layout | Proof a paper/ink palette carries an award site | Accessibility 6.6/10 |
| [Lama Lama](https://lamalama.com/) ([Awwwards](https://www.awwwards.com/sites/lama-lama), SOTM Jul 2026) | Canvas drawing under the cursor, page transitions | Dimension lines drawing in on a card (Direction B) | Hover only; needs a touch trigger |
| [Iventions](https://iventions.com/) (same roundup) | Each project a spotlit installation | A drafting-lamp pool with a CSS mask | Theirs is Three.js |
| [Cross-document View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) | Native page transitions, no library | "Next sheet" between pages | Chrome 126+, Safari 18.2+; Firefox unconfirmed |
| [CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations/Timelines) | Drawing progress tied to scroll, off the main thread | Rail and section line work drawn as far as you've scrolled | Firefox stable still flagged mid-2026; enhancement only |

Pattern: on most award pages, accessibility is the lowest dev score — the gap this
site can win on.

### Directions considered

- **A, sheet set:** each section opens out of a drafter's detail callout. Grandest,
  but 2.5–3 days and adds friction to fast scrolling. Good follow-up.
- **B, inspection pass (chosen):** each Work card is checked like a drawing, then
  marked; opening a card unfolds it into the full sheet. 1.5–2 days, no dependency.
- **C, plotter hero:** the name drawn by a pen plotter. Risks LCP and the 2-second
  rule, and competes with the map.

Library sizes if ever needed (gzipped, jsDelivr builds, 2026-11-01): GSAP 27 KB,
ScrollTrigger 17 KB, SplitText 3 KB, DrawSVG 2 KB, Lenis 5 KB, Three.js 77 KB
(`three.module.min.js` 0.180). Direction B uses none of them.

### Decision (2026-11-01)

Direction B, with the mark tied to each project's real status: a copper check
once shipped; a dashed ring in dim ink for in-development work (`draft: true` in
`content/projects.ts`; `npm test` fails if it drifts from the status copy). No
word in the stamp, no pointer crosshair for now (possible later).
