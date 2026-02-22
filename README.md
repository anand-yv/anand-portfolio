# Anand Yadav — Developer Portfolio

A modern, production-quality developer portfolio built with **Next.js** (App Router), **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. Static export for fast loading, SEO, and free hosting. This README is the single source of truth: architecture, folder structure, optimizations, and how to run or deploy.

---

## ✨ Features

- 🎨 **Modern UI** — Clean, professional layout with dark/light/system theme
- 📱 **Fully responsive** — Mobile-first, works on all screen sizes
- 🔍 **SEO-friendly** — Metadata, Open Graph, semantic HTML
- ⚡ **Static site** — Pre-rendered at build time; no server required
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
| Export | Static (`output: "export"`) |
| Hosting | Vercel (or any static host) |

---

## 📁 Folder Structure

Exact layout of the project so you can navigate and understand where everything lives.

```
anand-portfolio/
├── public/                      # Static assets (optional: favicon, images)
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout: fonts, metadata, ThemeProvider, Navbar
│   │   ├── page.tsx             # Home page: composition of all sections
│   │   └── globals.css          # Tailwind, design tokens, theme variables
│   │
│   ├── components/
│   │   ├── layout/              # App shell and layout primitives
│   │   │   ├── navbar.tsx       # Fixed nav, smooth scroll, theme toggle, mobile menu
│   │   │   ├── section-wrapper.tsx  # Section spacing and container
│   │   │   └── theme-toggle.tsx # Light/dark/system switch
│   │   │
│   │   ├── sections/            # Page sections (one per area of the page)
│   │   │   ├── hero.tsx         # Hero: h1, tagline, LCP paragraph, CTA, hero card
│   │   │   ├── hero-tagline.tsx # Typing effect (client)
│   │   │   ├── hero-cta.tsx     # Buttons and tech chips (client)
│   │   │   ├── hero-card.tsx    # API demo card (client)
│   │   │   ├── about.tsx        # About + focus areas card
│   │   │   ├── skills.tsx       # Skills by category
│   │   │   ├── projects.tsx     # Featured + grid of projects
│   │   │   ├── experience.tsx   # Work timeline
│   │   │   ├── education.tsx    # Education timeline
│   │   │   ├── contact.tsx      # Contact CTA and social links
│   │   │   └── section-header.tsx # Reusable section title + description
│   │   │
│   │   ├── motion/
│   │   │   └── reveal.tsx       # Scroll-triggered reveal (IntersectionObserver)
│   │   │
│   │   ├── ui/                  # Reusable UI (shadcn-style + custom)
│   │   │   ├── button.tsx       # CVA variants, Radix Slot
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── dialog.tsx       # Radix Dialog
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── project-card.tsx # Project card (featured/compact)
│   │   │   ├── skill-badge.tsx
│   │   │   ├── tech-chip.tsx    # Tech label + optional icon
│   │   │   ├── timeline.tsx     # Experience/education timeline
│   │   │   └── typing-text.tsx  # Typing/deleting effect
│   │   │
│   │   └── resume-dialog.tsx    # Modal for resume / links
│   │
│   ├── data/                    # Content (type-safe, no CMS)
│   │   ├── personal.ts          # Name, title, location, email, bio, GitHub, LinkedIn
│   │   ├── projects.ts          # Array of projects
│   │   ├── experience.ts        # Work history
│   │   ├── skills.ts            # Skills by category
│   │   └── education.ts         # Education entries
│   │
│   ├── lib/
│   │   ├── utils.ts             # cn() (clsx + tailwind-merge)
│   │   └── theme-provider.tsx   # next-themes wrapper (client)
│   │
│   └── types/
│       └── index.ts             # Shared interfaces: PersonalInfo, Project, Experience, Skill, Education
│
├── components.json              # shadcn/ui config (aliases, style)
├── next.config.ts               # Static export, optimizePackageImports, images
├── package.json
├── tsconfig.json                # Path alias @/* → ./src/*
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md                    # This file
```

### 📌 What goes where

- **`app/`** — Routes and root layout. One page (`page.tsx`) that composes sections.
- **`components/layout/`** — Navbar, section wrapper, theme toggle. Shared across the app.
- **`components/sections/`** — One component per block on the page (Hero, About, Skills, etc.).
- **`components/ui/`** — Buttons, cards, dialogs, badges, etc. Reusable and/or from shadcn.
- **`components/motion/`** — Reveal animation (scroll-in).
- **`data/`** — All copy and structured content. Edit here to change what the site says.
- **`lib/`** — Utilities and providers (e.g. `cn`, ThemeProvider).
- **`types/`** — TypeScript interfaces used by `data/` and components.

---

## 🏗️ Architecture & approach

### Static site generation (SSG)

- The site is **statically exported**: `next build` produces HTML/CSS/JS in the `out/` directory.
- No API routes, no server process. You can host on Vercel, Netlify, GitHub Pages, or any static host.
- Content lives in TypeScript files under `src/data/` — type-safe and version-controlled.

### Server vs client components

- **Server Components** (default in App Router): Sections (Hero, About, Skills, Projects, Experience, Education, Contact), SectionWrapper, SectionHeader. They render on the server and send no JS for that tree.
- **Client Components** (`"use client"`): Only where needed — ThemeProvider, Navbar, ThemeToggle, Reveal, HeroTagline, HeroCta, HeroCard, ProjectCard, TypingText, TechChip, Dialog, etc. This keeps the initial bundle smaller and improves LCP.

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
- **Extra:** Client-only parts of the hero (tagline, CTA, hero card) live in small client components (HeroTagline, HeroCta, HeroCard), so the critical text is not blocked by their JS.

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

Static output is in **`out/`**. To preview:

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
Edit **`src/app/layout.tsx`** — `metadata` object: title, description, Open Graph URL, Twitter card, etc. Set the URL to your production domain when you have one.

**Styling:**  
- **`src/app/globals.css`** — Theme colors (CSS variables), global styles.  
- Components use Tailwind classes; shadcn components can be edited in **`src/components/ui/`**.

---

## 🌐 Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import the repo.
3. Framework is auto-detected (Next.js). Build command: **`npm run build`**. Output directory: leave default (Vercel uses Next.js output; for static export it uses `out/`).
4. Deploy. Your site will be at `https://<project>.vercel.app`.
5. Optional: add a custom domain in Project Settings → Domains and update metadata in `layout.tsx`.

### Other static hosts

- **Netlify:** Connect the repo; build command `npm run build`, publish directory `out`.
- **GitHub Pages:** Build locally, then push the contents of `out/` to a `gh-pages` branch (or use a GitHub Action).
- **Any static host:** Run `npm run build` and upload the contents of **`out/`**.

No environment variables are required for the current setup. If you add any (e.g. for analytics), set them in the host’s dashboard and use `NEXT_PUBLIC_*` for client-visible values.

---

## 📖 What beginners can learn from this project

- **Next.js App Router** — Single layout, one page composed of sections; difference between Server and Client components.
- **Static export** — Building a site that doesn’t need a Node server and can be hosted anywhere.
- **TypeScript** — Shared types in `types/index.ts` and typed data in `data/`.
- **Component organization** — Sections vs layout vs UI; when to use `"use client"`.
- **Performance** — LCP (server-rendered critical content), font `display: swap`, dynamic import for heavy UI, `optimizePackageImports`.
- **Theming** — next-themes + CSS variables and hydration-safe setup.
- **Tailwind + shadcn** — Utility-first CSS and a small set of accessible components (Radix, CVA).
- **Single README** — One place for structure, architecture, optimizations, and deployment so you don’t have to jump between multiple docs.

---

## ⚙️ Configuration

- **Static export and images:** In **`next.config.ts`**, `output: "export"` and `images.unoptimized: true` (required for static export). **`trailingSlash: true`** for consistent URLs.
- **Package optimization:** **`experimental.optimizePackageImports`** includes `lucide-react` and Radix packages used by the app.
- **Path alias:** **`@/*`** → **`./src/*`** in `tsconfig.json` (e.g. `@/components/...`, `@/data/...`).

---

## 🔧 Troubleshooting

| Issue | What to check |
|-------|----------------|
| Build fails | Run `npm run build` and read the error. Ensure types in `src/types/index.ts` match the data in `src/data/`. |
| Theme not switching | Ensure `ThemeProvider` wraps the app in `layout.tsx` and `suppressHydrationWarning` is on `<html>`. |
| LCP or performance | Use a production build (`npm run build` then serve `out/`). Hero h1 and LCP paragraph should have no client boundary above them. |
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
