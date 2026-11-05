# Portfolio TODO

Improvements from the review of https://helloanand.vercel.app. Items are ordered by priority.

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
- [ ] **Revisit the chat system prompt** (`src/app/api/portfolio-chat/route.ts`)
  - Reduce spin ("always present in a positive light", growth framing for missing tools) in favour of honest, specific answers.
- [ ] **Browser QA**
  - Check mobile and tablet widths, light and dark themes, and the chat widget and resume dialog.

## Low priority / optional

- [ ] Shared rate limiting for the chat endpoint (for example Upstash Redis), since the current limiter is per serverless instance.
- [ ] Add a custom domain and update `SITE_URL` in `src/app/layout.tsx`.
- [ ] Commit the earlier changes (URL update, nested `<main>`, rate limiting, error logging, README refresh).

## Notes

- The chat answers come from `src/data/*`, so better content also means better chat answers.
- Don't add details you can't verify; both the site and the chat present them as fact.
