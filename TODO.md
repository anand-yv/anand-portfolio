# Portfolio TODO

Improvements from the review of https://helloanand.vercel.app. Items are ordered by priority.

## Done

- [x] Sketch-notebook redesign: typography (Bricolage + Geist + Geist Mono + Caveat), floating scroll-spy navbar, hero, marquee, About, Skills, Projects, scroll-drawn timelines, Contact, footer, chat widget.
- [x] Chat upgrade: streaming, project cards, action buttons, follow-ups, persistence, retry/copy, Ctrl/Cmd+K, honest system prompt.
- [x] Availability pill driven by `personalInfo.availability`.
- [x] Restrained anime/manga layer: speed lines, SFX stickers, halftone.
- [x] Theme toggle needed 2 clicks from system-dark (compared against the setting, not the resolved theme).
- [x] New palette (highlighter yellow / acid yellow on near-black + 4 pencil accents), greeting intro, merged Experience+Education, interactive diagram, filterable 3D-tilt projects.
- [x] Global UI scale-down (html font-size 14px desktop / 15px mobile) and projects redesigned as a fanned playing-card hand with a draggable ruler.
- [x] Round 5: UI scaled down again (13px desktop / 14px mobile), fan starts on a middle card (centred), sticker-style navbar with in-bar progress line, diagram arrows are request/response pairs, fixed invisible-text bug on lit layers in dark mode.
- [x] Round 6: flip-card projects, ruler moved above the cards, live finger-follow swipe with momentum, postcard-style Get in touch with working mailto form.
- [x] Round 7: ruler redesigned as a slim scrubber (filled rail, knob, name tag). About: sticky-notes and compact-card versions were tried and reverted; the original statement + quick-facts layout is back. Resume modal restyled and widened. Project images no longer draggable. Pointer trail / custom cursor tried (pencil, arrow, comet / pencil / dots trails) and fully removed; custom cursor images were tried (pencil, then arrow) and removed.
- [x] Palette alternatives added (indigo / tomato / forest, footer switcher) after friends said the multi-colour look clashed; the yellow palette stays the default. Navbar: sliding-marker design kept and made roomier (taller bar, larger lettering) because it was too compact.
- [x] Text inside containers was too small (xs/sm were ~9.8px/11.4px at the 13px root): small type scale raised; project cards made taller so the back face still fits; nav kept from wrapping.
- [x] Diagram and contact postcard text raised one more step (they used the smallest sizes); postcard widened, lined paper re-spaced.
- [x] Palette picker moved from the footer into the navbar (swatch button + menu with 4 palettes). The glowing green "open to opportunities" pill (an AI-template cliche) replaced by a handwritten sticky note beside the hero buttons and a highlighter line on the postcard.
- [x] Cursor rebuilt (dot + lagging ring + context labels + comet trail, footer switch). Earlier image-cursor and trail-only attempts were removed.
- [x] Round: slim ink scrollbar (replaced the chunky yellow pill); diagram shows Third-party services (payments, AWS S3, AI/ML, all from project data) instead of MongoDB; postcard copy button only swaps its icon; cursor trail redrawn (smoother, softer, fades along its length).
- [x] Chat hardening: natural-language profile instead of JSON, input/output guards, honesty + edge-case prompt, friendly "busy" message; stream parser no longer drops the last event; two-finger trackpad swipe now moves the project cards and blocks the browser back/forward gesture.
- [x] Skills revamped as a filterable sticker sheet (no proficiency labels shown), with brand/line icons on every sticker.
- [x] Flipped project card: mouse wheel now scrolls its content (Chrome ignored it inside the 3D flip), and its scrollbar uses the same style as the page. Wheel over a scrollable card never scrolls the page behind it (no hand-off at the ends); cards that fit still let the page scroll.
- [x] Fixed Geist never loading (font variables were on `<body>` instead of `<html>`).

## High priority: content


- [ ] **Rewrite project entries** (`src/data/projects.ts`)
  - For each project: the problem, your specific contribution, the hard part, and an outcome or number.
  - Avoid claims you can't back up (for example "payment gateway integration" and "recommendation engine"; confirm or soften).
- [ ] **Add proof to projects**
  - Add a `liveUrl` for at least two projects (the field is currently commented out).
  - Add an `imageUrl` screenshot for at least two projects.
- [ ] **Sharpen experience bullets** (`src/data/experience.ts`)
  - Replace generic lines ("Build backend services and APIs") with concrete results: what you owned at Tiny Command, and any measurable impact.
- [ ] **Add this portfolio as a project**
  - Highlight the Gemini chat widget, the serverless API route, and the LCP/performance work.

## Medium priority

- [ ] **Rework skills labels** (`src/data/skills.ts`)
  - Drop or soften the "advanced / intermediate" proficiency labels.
  - Consider grouping by "shipped with" instead.
- [ ] **Clarify education** (`src/data/education.ts`)
  - Replace "Information Technology / Engineering" with the exact degree and field.
- [ ] **Browser QA (partly done)**
  - Done: desktop and mobile, light and dark, open chat panel.
  - Still to check: tablet widths, the resume dialog (restyled, not viewed), the mobile nav menu open, and real-device performance.

## Chat: needs a decision

- [ ] **Gemini free tier = ~20 requests/day per model** (about 40 messages/day total). Enable billing on the key, or add an answer cache for the starter questions, or accept that the assistant goes quiet on busy days.
- [ ] Re-run the live chat checks once the daily quota resets (the last prompt tweaks, and the cut-off fix, were not re-verified live).

## Low priority / optional

- [ ] Shared rate limiting for the chat endpoint (for example Upstash Redis), since the current limiter is per serverless instance.
- [ ] Add a custom domain and update `SITE_URL` in `src/app/layout.tsx`.
- [ ] Commit the earlier changes (URL update, nested `<main>`, rate limiting, error logging, README refresh).

## Notes

- The chat answers come from `src/data/*`, so better content also means better chat answers.
- Don't add details you can't verify; both the site and the chat present them as fact.
