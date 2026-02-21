# Performance optimization guide (TBT & LCP)

Prioritized, code-level changes to improve Lighthouse Performance (~60 → target 80+), Total Blocking Time (~4.8s), and LCP (~3.3s) **without removing features or changing behavior**.

---

## Prioritized list of issues (most impact first)

| # | Issue | Impact | Files |
|---|--------|--------|-------|
| 1 | **LCP element hidden until JS runs** — Hero h1 and first lines wrapped in `Reveal` with `opacity-0` until IntersectionObserver fires | **LCP** | `hero.tsx`, `reveal.tsx` |
| 2 | **Heavy hero client bundle** — Hero is one big client component; Radix Dialog and ResumeDialog load with hero | **TBT, bundle** | `hero.tsx` |
| 3 | **Many Reveal observers** — 25+ Reveal instances each with own IO + setState; hero alone has 8 | **TBT** | `reveal.tsx`, all sections |
| 4 | **TypingText effect runs every frame** — setState every 50–100ms during typing/deleting; in hero above the fold | **TBT** | `typing-text.tsx`, `hero.tsx` |
| 5 | **TechChip (and Lucide) in critical path** — Hero uses 6 TechChips; each pulls icon logic and Lucide; Skills uses SkillBadge → TechChip | **Bundle, TBT** | `tech-chip.tsx`, `hero.tsx`, `skills.tsx` |
| 6 | **Layout always client** — ThemeProvider + Navbar wrap entire app; Navbar has mounted + menu state | **TBT** | `layout.tsx`, `navbar.tsx`, `theme-provider.tsx` |
| 7 | **ProjectCard is client** — Used in Projects (many cards); pulls Button, Badge, TechChip, Card; no interactivity beyond links | **Bundle** | `project-card.tsx`, `projects.tsx` |

---

## Implemented changes (already done)

### 1. LCP: Hero content visible without waiting for JS

**Files:** `src/components/motion/reveal.tsx`, `src/components/sections/hero.tsx`

- **Reveal** now supports `visibleByDefault`. When `true`, `inView` is `true` from the start and the effect does not run an IntersectionObserver for that instance.
- **Hero** uses `visibleByDefault` on the first three Reveals: h1, typing line, and “I design scalable…” paragraph.

**Why it works:** The LCP element (the hero heading) is no longer hidden with `opacity-0` until after hydration and IO. It’s visible from the first paint, so LCP can be the server-rendered heading.

**Before (conceptual):**
```tsx
<Reveal delayMs={0}>
  <h1>Anand Yadav</h1>
</Reveal>
// Reveal renders opacity-0 → IO in useEffect → setInView(true) → then visible
```

**After:**
```tsx
<Reveal delayMs={0} visibleByDefault>
  <h1>Anand Yadav</h1>
</Reveal>
// inView = true immediately, no IO for this instance → visible on first paint
```

---

### 2. Hero bundle: ResumeDialog loaded on demand

**File:** `src/components/sections/hero.tsx`

- **ResumeDialog** is loaded with `next/dynamic(..., { ssr: false })` so the Radix Dialog (and its tree) are not in the initial hero chunk.

**Why it works:** Radix Dialog and ResumeDialog code run only when the chunk loads (e.g. when the user scrolls or the component is about to render). Less JS in the critical path → less parse/compile and less main-thread blocking during initial load.

---

## Recommended next steps (file-level)

### 3. Reduce Reveal observers (TBT)

**Option A – Single shared observer (high impact, more refactor)**  
**File:** `src/components/motion/reveal.tsx`

- Implement a module-level single `IntersectionObserver` and register each Reveal node with a `Map` (node → callback). On intersect, call the right callbacks. One observer for all Reveals reduces main-thread work.

**Option B – Keep current API, use `visibleByDefault` everywhere above the fold (quick win)**  
**Files:** `src/components/sections/hero.tsx` (already done), optionally the first Reveal in each section if it’s in view on load.

- For hero we already use `visibleByDefault` on the first three blocks. You can add it to the hero tech chips and CTA block if they’re above the fold on large screens.

**Why it works:** Fewer observers and fewer `setState` calls mean less work on the main thread and lower TBT.

---

### 4. Defer TypingText cost (TBT)

**File:** `src/components/sections/hero.tsx` (and optionally `src/components/ui/typing-text.tsx`)

- **Option A (recommended):** Render a static phrase first (e.g. `"Full-Stack Engineer"`) in the hero so the first paint and LCP don’t depend on TypingText. After mount, render `<TypingText />` (e.g. in a `useEffect` + state “mounted” or after `requestIdleCallback`). Same UX, but the typing effect and timers don’t run until after first paint.
- **Option B:** Lazy-load the TypingText component with `dynamic(..., { ssr: false })` and show the same static phrase until the chunk loads.

**Why it works:** TypingText’s effect runs every 50–100ms; deferring it keeps that work off the critical path so TBT and LCP improve.

**Before (conceptual):**
```tsx
<p>
  <TypingText phrases={[...]} typingSpeed={100} ... />
</p>
// Hydration runs TypingText effect → many setState calls during typing
```

**After (Option A):**
```tsx
const [showTyping, setShowTyping] = React.useState(false);
React.useEffect(() => {
  const id = requestIdleCallback(() => setShowTyping(true), { timeout: 500 });
  return () => cancelIdleCallback(id);
}, []);
<p>
  {showTyping ? (
    <TypingText phrases={[...]} ... />
  ) : (
    <>Full-Stack Engineer</>
  )}
</p>
```

---

### 5. Reduce TechChip/Lucide in hero (bundle + TBT)

**Files:** `src/components/sections/hero.tsx`, `src/components/ui/tech-chip.tsx`

- **Option A:** In the hero only, render a simple list of badges (e.g. reuse `Badge` or a small inline component) **without** TechChip, so you don’t pull TechChip + Lucide icon mapping into the hero. Keep TechChip for Projects and elsewhere.
- **Option B:** Lazy-load TechChip in the hero: `const TechChip = dynamic(() => import('@/components/ui/tech-chip').then(m => ({ default: m.TechChip })), { ssr: false });` and show plain text or simple badges until the chunk loads.

**Why it works:** TechChip imports several Lucide icons and the category logic. Moving that out of the hero (or loading it lazily) shrinks the hero chunk and defers non-critical JS.

---

### 6. Layout: keep ThemeProvider, optional Navbar tweaks

- **ThemeProvider** is required for theme; keep it. It’s relatively small (next-themes).
- **Navbar:** The `mounted` effect is for avoiding hydration mismatch (e.g. theme toggle). You could avoid forcing a re-render by using CSS that doesn’t depend on a “mounted” state if possible, but this is low impact compared to hero/Reveal.

---

### 7. Projects: Server-friendly project list (bundle)

**Files:** `src/components/sections/projects.tsx`, `src/components/ui/project-card.tsx`

- **Option A:** Split `ProjectCard` into a **server** shell (title, description, links, static badges as text) and a **client** part only for hover or other interactivity. If there’s no real client behavior, consider a server-only card that uses `<Link>` and static markup so ProjectCard (and TechChip/Button in it) aren’t required in the main client bundle for initial paint.
- **Option B:** Dynamic-import `ProjectCard`: `const ProjectCard = dynamic(() => import('@/components/ui/project-card').then(m => ({ default: m.ProjectCard })));` so it loads when the Projects section is near view (e.g. with a wrapper that uses IntersectionObserver to load the chunk when “projects” is in view). This keeps the initial bundle smaller.

**Why it works:** Fewer client components in the critical path means less JS to parse and execute, which helps TBT and FCP/LCP.

---

## Summary

| Done | Action |
|------|--------|
| Yes | LCP: `visibleByDefault` on Reveal for hero h1 + first lines |
| Yes | Hero: Dynamic import ResumeDialog |
| No  | Reveal: Single shared IO (or more `visibleByDefault` where above fold) |
| No  | TypingText: Static phrase first, hydrate after idle |
| No  | Hero tech chips: Simple badges or lazy TechChip |
| No  | Projects: Server-friendly cards or dynamic ProjectCard |

Re-run Lighthouse (ideally on a **production** build: `next build && next start`) to measure. Focus on TBT and LCP; the changes above target those metrics with minimal behavior change.
