# Anand Yadav — Developer Portfolio

A modern, production-quality developer portfolio built with **Next.js** (App Router), **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. Live at **https://helloanand.vercel.app**. Pre-rendered page plus a small serverless API route for the AI chat. This README is the single source of truth: architecture, folder structure, optimizations, and how to run or deploy.

---

## ✨ Features

- 🎨 **Modern UI** — Clean, professional layout with dark/light/system theme
- 📱 **Fully responsive** — Mobile-first, works on all screen sizes
- 🔍 **SEO-friendly** — Metadata, Open Graph, semantic HTML
- ⚡ **Pre-rendered page** — Fast loads; only the chat endpoint runs server-side
- 🤖 **AI chat** — Gemini-powered assistant that answers questions about the portfolio
- 📘 **Type-safe** — Full TypeScript and shared types for content
- ♿ **Accessible** — WCAG-oriented components (Radix-based)
- 🚀 **Performance-focused** — LCP and bundle optimizations applied

---

## 🛠️ Tech Stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui (Radix primitives, CVA, Lucide icons) |
| Theme | next-themes |
| AI | Gemini API via a server-side route (`/api/portfolio-chat`) |
| Motion | `motion` (Framer Motion) with reduced-motion support |
| Hosting | Vercel — https://helloanand.vercel.app |

---

## 📁 Folder Structure

Exact layout of the project so you can navigate and understand where everything lives.

```
anand-portfolio/
├── public/                      # resume.pdf and static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Fonts, metadata, providers, Navbar, chat
│   │   ├── page.tsx             # Home page: composes all sections
│   │   ├── globals.css          # Tailwind, design tokens, theme variables
│   │   ├── icon.png             # Favicon
│   │   └── api/portfolio-chat/route.ts  # Gemini chat endpoint (server)
│   │
│   ├── components/
│   │   ├── ai/                  # Floating portfolio chat (client)
│   │   │   ├── portfolio-chat.tsx
│   │   │   ├── portfolio-chat-dynamic.tsx   # next/dynamic loader
│   │   │   ├── chat-message-list.tsx
│   │   │   └── use-portfolio-chat.ts        # State, history, API calls
│   │   ├── layout/              # navbar, section-wrapper, theme-toggle
│   │   ├── motion/              # reveal, motion-reveal, stagger, scroll-progress(+dynamic)
│   │   ├── sections/            # hero (+ atmosphere, motion, showcase, tagline, cta),
│   │   │                        # about, skills (+ skill-layer-card), projects,
│   │   │                        # experience, education, contact
│   │   │                        # (+ contact-channel-card, contact-chat-cta), section-header
│   │   ├── ui/                  # badge, button, card, dialog, project-card,
│   │   │                        # separator, skeleton, tech-chip, timeline, toast, typing-text
│   │   └── resume-dialog.tsx    # Resume PDF modal
│   │
│   ├── data/                    # Content: personal, about, projects, experience, skills, education
│   ├── hooks/use-reduced-motion.ts
│   ├── lib/                     # utils (cn), theme-provider, chat-context
│   └── types/index.ts           # Shared interfaces
│
├── .env.sample                  # GEMINI_API_KEY placeholder
├── components.json              # shadcn/ui config
├── next.config.ts               # React Compiler, optimizePackageImports, images
├── tsconfig.json                # Path alias @/* → ./src/*
└── README.md
```

### 📌 What goes where

- **`app/`** — Routes and root layout. One page (`page.tsx`) that composes sections.
- **`components/layout/`** — Navbar, section wrapper, theme toggle. Shared across the app.
- **`components/sections/`** — One component per block on the page (Hero, About, Skills, etc.).
- **`components/ui/`** — Buttons, cards, dialogs, badges, etc. Reusable and/or from shadcn.
- **`components/motion/`** — Scroll reveal, stagger and scroll-progress animations.
- **`components/ai/`** — Floating chat widget.
- **`data/`** — All copy and structured content. Edit here to change what the site says.
- **`lib/`** — Utilities and providers (e.g. `cn`, ThemeProvider).
- **`types/`** — TypeScript interfaces used by `data/` and components.

---

## 🏗️ Architecture & approach

### Pre-rendered page with one API route

- The main portfolio page is still **fully pre-rendered** for fast loads.
- For the floating portfolio chat, we use a **small Next.js API route** on Vercel to securely call Gemini (your API key stays on the server).
- Content lives in TypeScript files under `src/data/` — type-safe and version-controlled.

### Server vs client components

- **Server Components** (default in App Router): Sections (Hero, About, Skills, Projects, Experience, Education, Contact), SectionWrapper, SectionHeader. They render on the server and send no JS for that tree.
- **Client Components** (`"use client"`): Only where needed — ThemeProvider, Navbar, ThemeToggle, Reveal, HeroTagline, HeroCta, PortfolioChat, ProjectCard, TypingText, TechChip, Dialog, etc. This keeps the initial bundle smaller and improves LCP.

### Data flow

- **Content** → `src/data/*.ts` (typed with `src/types/index.ts`).
- **Sections** → Import from `@/data/...` and render. No fetch at runtime.
- **Theme** → `next-themes` + CSS variables in `globals.css`; ThemeProvider wraps the app.

### Why this structure

- **Sections vs UI** — Sections are page-specific; UI components are reusable. Clear separation.
- **Data in TS files** — No database or CMS; simple to edit and refactor with type safety.
- **Single types file** — One place for shared interfaces; sufficient for this project size.

---

## ⚡ Optimizations (what we did and why)

These are the main performance and UX decisions. Useful for learning how a production Next.js + React app is tuned.

### 1. 🎯 LCP (Largest Contentful Paint)

- **Goal:** The main hero heading and the line “I design scalable APIs…” paint as soon as possible.
- **Approach:** Hero is a **Server Component**. The **h1** and the **LCP paragraph** are rendered on the server with **no client boundary** above them — they are not inside any `"use client"` component. So the browser can paint them with the first HTML/CSS, without waiting for React hydration.
- **Extra:** Client-only parts of the hero (tagline, CTA) live in small client components (HeroTagline, HeroCta). The floating chat loads via `next/dynamic` from the root layout, so the critical text is not blocked by chat JS.

### 2. 🔤 Fonts not blocking paint

- In `layout.tsx`, Geist and Geist Mono use **`display: "swap"`**. Text shows immediately with a fallback font and swaps to Geist when loaded, instead of blocking first paint.

### 3. 📦 Resume dialog loaded on demand

- **ResumeDialog** is loaded with **`next/dynamic(..., { ssr: false })`** from the Hero. The Radix Dialog and its tree are not in the initial hero chunk; they load when needed. This reduces the main bundle and helps TBT (Total Blocking Time).

### 4. 👁️ Reveal and above-the-fold content

- **Reveal** supports **`visibleByDefault`**. For the first hero blocks (e.g. h1, tagline, LCP paragraph), we either don’t wrap them in Reveal or use `visibleByDefault` so they are visible on first paint and don’t wait for IntersectionObserver. Other sections use Reveal for scroll-in effect without blocking LCP.

### 5. 🌓 Theme and hydration

- **`suppressHydrationWarning`** on `<html>` and `<body>` avoids React hydration warnings when the theme is applied on the client (e.g. next-themes reading from localStorage). Theme is applied in a way that doesn’t block the initial paint of the LCP element.

### 6. 📚 Bundle: package imports

- **`next.config.ts`** uses **`experimental.optimizePackageImports`** for `lucide-react` and Radix packages. Only the icons and components you use are bundled, not the whole library. Keeps the client bundle smaller.

---

## 🚀 Quick start

**Prerequisites:** Node.js 18+, npm (or yarn/pnpm).

```bash
git clone <your-repo-url>
cd anand-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Production build:**

```bash
npm run build
```

This is a regular Next.js build (not a static export), because the chat API route needs a server. To preview:

```bash
npm start
```

---

## ✏️ Editing content

All copy and structured data live under **`src/data/`**. Update these files and rebuild.

| File | What to edit |
|------|----------------|
| **`personal.ts`** | Name, title, location, email, bio, GitHub, LinkedIn, resume path |
| **`projects.ts`** | Add/remove/edit projects (title, description, tech, links, highlights) |
| **`experience.ts`** | Work history (company, role, dates, bullets, tech) |
| **`skills.ts`** | Skills and categories (backend, frontend, database, tools, other) |
| **`education.ts`** | Education (institution, degree, field, dates) |

**Metadata (SEO/social):**  
Edit **`src/app/layout.tsx`** — `metadata` object and `SITE_URL` (currently `https://helloanand.vercel.app`).

**Styling:**  
- **`src/app/globals.css`** — Theme colors (CSS variables), global styles.  
- Components use Tailwind classes; shadcn components can be edited in **`src/components/ui/`**.

---

## 🌐 Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import the repo.
3. Framework is auto-detected (Next.js). Build command: **`npm run build`**. Output directory: leave default.
4. Deploy. Your site will be at `https://<project>.vercel.app`.
5. Optional: add a custom domain in Project Settings → Domains and update `SITE_URL` in `layout.tsx`.

### Other hosts

- **Netlify / Render / etc.:** Use their Next.js support so that the `/api/portfolio-chat` route runs as a serverless function.

If you add environment variables (for example, `GEMINI_API_KEY` for the floating chat), set them in the host’s dashboard and **do not** prefix them with `NEXT_PUBLIC_` so they stay server-side only.

---

## 🎨 Design notes

- **Colours:** tokens live in `src/app/globals.css`: `--brand` is the accent *fill*, `--link` is the accent for *coloured text*, `--marker` is the highlighter, and `--pop-1..4` are the colored-pencil tints used for cards and artwork. The default palette is **yellow**. `indigo`, `tomato` and `forest` (one accent instead of several colours) are optional overrides at the bottom of the file, switchable by visitors with the palette picker in the navbar (`src/components/layout/palette-menu.tsx`, saved in `localStorage`). To drop the alternatives, delete those override blocks and the picker.
- **Intro:** `src/components/layout/intro.tsx` (multi-language greeting, once per tab session, skipped for reduced motion; an inline script in `layout.tsx` sets `data-intro="skip"` before paint).
- **Interactive diagram:** `src/components/sections/hero-showcase.tsx` (click a layer for details, or "send request" to animate a request through the stack).
- **Projects:** `src/components/sections/projects-fan.tsx` is a fanned hand of playing cards. The cards follow your finger/mouse live while dragging and snap on release (with momentum); a ruler above the cards also scrubs through them. Tap the front card to flip it: the front shows image, name, Code and Live; the back shows description, highlights and tech. Placeholder artwork is `src/components/ui/project-art.tsx` (follows the palette); set `imageUrl` to a real screenshot to replace it, plus `liveUrl` and `accent` (1-4), in `src/data/projects.ts`.
- **Type scale:** the small Tailwind sizes are overridden at the top of `src/app/globals.css` (`--text-xs` … `--text-xl`) because the defaults are too small at a 13px root (xs was about 9.8px, sm about 11.4px). Raise or lower those five values to resize text inside cards, chips and timelines without touching spacing or headings.
- **UI scale:** the whole site is sized in `rem`, so the two `html { font-size }` values in `globals.css` (14px mobile, 13px desktop) scale everything at once.
- **About:** `src/components/sections/about.tsx`: a highlighted statement beside a "quick facts" card, built from `src/data/about.ts` and your experience/education data.
- **Contact:** `src/components/sections/postcard.tsx` is a postcard with a compose form. There is no backend: "send it" opens a pre-filled draft in the visitor's email app (`mailto:`), and the email address can be copied.
- **Section order:** About, Experience & Education (`journey.tsx`), Projects, Skills, Contact.

## 🤖 Floating portfolio chat (Gemini)

A chat widget (bottom-right, or `Ctrl/Cmd + K`) that answers questions about this portfolio.

- **Frontend:** `src/components/ai/*`. Streams the reply as it arrives, renders Markdown, and keeps the conversation in `sessionStorage` for the tab session. It has retry-on-error, a copy button, starter questions, and follow-up suggestions.
- **Rich answers:** the model can end a reply with directive lines (`[[project:<id>]]`, `[[goto:<section>]]`, `[[email]]`, `[[resume]]`, `[[ask: a | b]]`). `src/lib/chat-directives.ts` parses and **validates** them against `src/data/*`, so the UI can show a project card, scroll buttons, an email button or follow-up chips. Unknown directives are ignored.
- **Backend:** `src/app/api/portfolio-chat/route.ts` is a serverless route that:
  - Loads portfolio data from `src/data/*` (including `personalInfo.availability`) and uses a system prompt that only allows facts from that data.
  - Streams from Gemini (`gemini-3.5-flash`, falling back to `gemini-2.5-flash-lite`) with thinking disabled for fast first tokens, and passes the key in a header.
  - Validates input (800 chars per message, last 6 turns) and rate-limits to 8 requests/minute per IP (best-effort, per serverless instance).
  - Logs server-side errors (missing key, upstream failures) to the function logs; users only see a friendly retry message.

**Availability:** the hero pill reads `personalInfo.availability` in `src/data/personal.ts` (`open` + `text`). Set `open: false` to hide it.

### Configuring Gemini (free tier)

1. Go to Google AI Studio and create an API key for the Gemini API (free tier is enough for this use case).
2. In your Vercel project, add an environment variable:

   - **Name:** `GEMINI_API_KEY`  
   - **Value:** (paste the key from Google AI Studio)

3. Redeploy or re-run your project so the function can read `process.env.GEMINI_API_KEY`.

The key is **never exposed to the browser**; all Gemini calls go through the serverless route.

---

## 📖 What beginners can learn from this project

- **Next.js App Router** — Single layout, one page composed of sections; difference between Server and Client components.
- **API routes** — Keeping a secret key server-side while the page stays pre-rendered.
- **TypeScript** — Shared types in `types/index.ts` and typed data in `data/`.
- **Component organization** — Sections vs layout vs UI; when to use `"use client"`.
- **Performance** — LCP (server-rendered critical content), font `display: swap`, dynamic import for heavy UI, `optimizePackageImports`.
- **Theming** — next-themes + CSS variables and hydration-safe setup.
- **Tailwind + shadcn** — Utility-first CSS and a small set of accessible components (Radix, CVA).
- **Single README** — One place for structure, architecture, optimizations, and deployment so you don’t have to jump between multiple docs.

---

## ⚙️ Configuration

- **Images and URLs:** In **`next.config.ts`**, `images.unoptimized: true` and `trailingSlash: true`. **`reactCompiler: true`** enables the React Compiler.
- **Package optimization:** **`experimental.optimizePackageImports`** includes `lucide-react` and Radix packages used by the app.
- **Path alias:** **`@/*`** → **`./src/*`** in `tsconfig.json` (e.g. `@/components/...`, `@/data/...`).

---

## 🔧 Troubleshooting

| Issue | What to check |
|-------|----------------|
| Build fails | Run `npm run build` and read the error. Ensure types in `src/types/index.ts` match the data in `src/data/`. |
| Theme not switching | Ensure `ThemeProvider` wraps the app in `layout.tsx` and `suppressHydrationWarning` is on `<html>`. |
| LCP or performance | Use a production build (`npm run build` then `npm start`). Hero h1 and LCP paragraph should have no client boundary above them. |
| Styles missing | Confirm `globals.css` is imported in `layout.tsx` and Tailwind/PostCSS are set up (`postcss.config.mjs`). |

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org)
- [Vercel Deployment](https://vercel.com/docs)

---

## 📄 License

MIT.

## 👤 Author

**Anand Yadav** — [GitHub](https://github.com/anand-yv) · [LinkedIn](https://www.linkedin.com/in/anandyv/)

---

*This README is the single source of truth: architecture, folder structure, optimizations, and deployment — all in one place.*
