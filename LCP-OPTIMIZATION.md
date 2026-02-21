# LCP optimization: causes and fixes

**LCP element:** `p.mt-3.text-xl...` — “I design scalable APIs, robust systems, and clean user experiences.”

**Goal:** Reduce LCP render delay (currently ~3.2s, mostly render delay) without changing UI, layout, or features.

---

## 1. File- and component-level causes (why each affects LCP)

| Priority | Cause | File(s) / component | Why it affects LCP |
|----------|--------|---------------------|---------------------|
| **P0** | LCP text lived under a **client boundary** | `hero.tsx` (was full client) | The paragraph was inside `Hero` (“use client”). The browser gets HTML from RSC, but **LCP is marked when the element is “painted” after layout is stable**. Hydration runs for the whole tree (ThemeProvider → Navbar → main → Hero). Until the client bundle runs and React hydrates the Hero subtree, the main thread is busy; **paint of the LCP node can be delayed** by that JS work. So “render delay” = time to parse/execute JS and complete hydration before the LCP element is considered stable. |
| **P0** | **Cascading updates** after first render | `layout.tsx` (ThemeProvider), `navbar.tsx` (setMounted) | ThemeProvider (next-themes) and Navbar’s `useEffect(() => setMounted(true))` cause extra commits after the first paint. Those **cascading updates** keep the main thread busy and can push the “final” paint of the LCP element later, so LCP timestamp increases. |
| **P1** | **Render-blocking CSS and fonts** | `layout.tsx` (fonts), `globals.css` | `globals.css` is imported in the root layout and pulls in Tailwind + tw-animate + shadcn. The browser treats it as **render-blocking** until it’s parsed. Fonts (Geist, Geist_Mono) without `display: 'swap'` can block first paint while the font loads. Both delay when the LCP text can be painted. |
| **P2** | **Reveal wrapper** around LCP (even with visibleByDefault) | `hero.tsx` → `reveal.tsx` | The LCP paragraph was wrapped in `<Reveal visibleByDefault>`. That’s a **client component** (ref, state, effect). So the LCP node was still inside a client subtree; hydration of Reveal and its parent Hero had to run. Removing the wrapper and rendering the LCP paragraph as **server-only** removes it from the client tree entirely. |
| **P2** | **Heavy JS before/after LCP** | Hero (pre-split): TypingText, TechChip, Card, ResumeDialog, etc. | More client components and state in the same tree as the LCP node → **more JS to parse and run before the LCP subtree is hydrated**. That increases main-thread work (~1.8s) and pushes LCP later. |
| **P3** | **Forced reflow** | Likely from next-themes or Radix (layout reads) | Lighthouse reported “Forced reflow detected.” Common causes: reading `offsetHeight` / `getBoundingClientRect` then doing DOM writes. Your app code doesn’t do this; **next-themes** or **Radix** (e.g. focus management) might. Hard to fix without changing libs; reducing client boundaries and JS reduces the window where reflows hurt. |

---

## 2. Concrete fixes (implemented and recommended)

### P0 – Implemented: Move LCP (and h1) out of the client boundary

**Files:** `src/components/sections/hero.tsx`, new `hero-tagline.tsx`, `hero-cta.tsx`, `hero-card.tsx`

**What changed**

- **Hero is now a Server Component.** It renders:
  - **On the server (no client boundary above them):** the hero shell, **h1**, and the **LCP paragraph** (`p.mt-3.text-xl...`) as plain server output.
  - **Client islands:** `HeroTagline` (TypingText), `HeroCta` (chips + buttons), `HeroCard` (API demo card).
- The LCP paragraph is **no longer wrapped in Reveal** and is **not inside any “use client”** component. It’s in the initial HTML stream and doesn’t wait on hydration.

**Why it works**

- The LCP node is **not** part of any client subtree. The browser can **paint it as soon as HTML + CSS are ready**, without waiting for the Hero client bundle or hydration. That directly reduces **render delay** and should improve LCP.

**Before (conceptual)**

```tsx
// hero.tsx ("use client")
export function Hero() {
  return (
    <SectionWrapper>
      <Reveal visibleByDefault><h1>...</h1></Reveal>
      <Reveal visibleByDefault><p><TypingText /></p></Reveal>
      <Reveal visibleByDefault>
        <p className="mt-3 text-xl...">I design scalable...</p>  // LCP
      </Reveal>
      ...
    </SectionWrapper>
  );
}
// LCP element is inside client Hero → paint delayed until hydration.
```

**After**

```tsx
// hero.tsx (Server Component)
export function Hero() {
  return (
    <SectionWrapper>
      <h1>...</h1>
      <HeroTagline />   {/* client */}
      <p className="mt-3 text-xl...">I design scalable...</p>   {/* server – LCP */}
      <HeroCta />       {/* client */}
      <HeroCard />     {/* client */}
    </SectionWrapper>
  );
}
// LCP paragraph has no client boundary above it → paints with first paint.
```

---

### P0 – Implemented: Reduce render-blocking fonts

**File:** `src/app/layout.tsx`

**Change:** Added `display: "swap"` to both Geist and Geist_Mono.

**Why it works**

- With `display: "swap"`, the browser shows text in the fallback font immediately and swaps to the custom font when it loads. It **doesn’t block first paint** waiting for the font, which can cut render delay and help LCP.

---

### P0 – Recommended: Reduce cascading updates (Navbar “mounted”)

**File:** `src/components/layout/navbar.tsx`

**Issue:** `const [mounted, setMounted] = React.useState(false)` plus `useEffect(() => setMounted(true))` forces a second commit after hydration. That can contribute to “cascading updates after initial render” and slightly delay when the page (and LCP) is considered stable.

**Fix (optional):** Only use `mounted` where strictly needed (e.g. theme toggle to avoid hydration mismatch). If the Navbar doesn’t actually render different content before/after mount, you can remove the state and the effect. If it does (e.g. “show theme toggle only when mounted”), keep it but be aware it adds one extra update.

**Example (only if you can do it without changing behavior):**

```tsx
// If nothing in Navbar depends on mounted, remove:
// const [mounted, setMounted] = React.useState(false);
// React.useEffect(() => setMounted(true), []);
// and any conditional rendering that used mounted.
```

---

### P1 – Render-blocking CSS (above-the-fold)

**File:** `src/app/globals.css` (and layout that imports it)

**Issue:** One large CSS bundle (Tailwind + tw-animate + shadcn) is render-blocking. Until it’s parsed, first paint (and thus LCP) can be delayed.

**Possible fixes (without changing UI):**

1. **Critical CSS:** Inline the minimal CSS needed for the hero (e.g. layout, typography, colors for h1 and LCP paragraph) in `<head>` and load the rest of `globals.css` asynchronously (e.g. `media="print" onload="this.media='all'"` or a similar pattern). Requires build-time or runtime extraction of “critical” rules.
2. **Audit imports:** Ensure `tw-animate-css` and `shadcn/tailwind.css` don’t pull in unused rules for above-the-fold. Reducing size of the blocking CSS helps.

---

### P2 – Components that can become Server Components

These are **not** on the LCP path anymore (after the Hero split) but reduce overall JS and can help main-thread time:

| Component | File | Reason it can be server |
|-----------|------|--------------------------|
| **SectionWrapper** | `section-wrapper.tsx` | Already a Server Component (no “use client”). No change needed. |
| **About, Skills, Projects, Experience, Education, Contact** | `sections/*.tsx` | They don’t use hooks or browser APIs; they only use Reveal (client) and other UI. They could stay server and keep importing client Reveal as today. No change required for LCP. |
| **Card** (primitives) | `ui/card.tsx` | Pure presentational divs; no “use client”. Already server. |

So the main win was **making Hero (and specifically the LCP block) server-rendered**; the rest of the sections are already server except for the client islands they use.

---

### P3 – Forced reflow

**Finding:** No `getBoundingClientRect` / `offsetHeight` / etc. in your app code. Reflows likely come from **next-themes** or **Radix** (e.g. Dialog, ThemeToggle).

**Options:**  
- Keep dependencies as-is and rely on less JS and fewer client boundaries (already done for LCP).  
- If you need to chase reflows later: profile with Chrome Performance, find the “Layout” events, and see which component’s code runs before them; then consider replacing or wrapping the offending dependency.

---

## 3. Priority order (highest impact first)

1. **Done: LCP paragraph (and h1) server-rendered** – Removes the main cause of LCP render delay (no client boundary above LCP).
2. **Done: Font `display: "swap"`** – Reduces risk of font load blocking first paint.
3. **Optional: Navbar `mounted`** – One fewer cascading update; small gain.
4. **Optional: Critical CSS / smaller blocking CSS** – Reduces time until first paint; medium effort.
5. **Optional: Reflow investigation** – Only if LCP is still high after the above; low priority.

---

## 4. Summary

- **LCP element** is now rendered by a **Server Component** with **no client boundary** above it, so it can paint with the first meaningful paint.
- **Fonts** use `display: "swap"` to avoid blocking that paint.
- **Cascading updates** (ThemeProvider, Navbar mounted) are documented; optional Navbar change can trim one update.
- **Render-blocking CSS** and **forced reflow** are documented with concrete next steps; no UI or feature changes required.

Re-run Lighthouse (production build) and compare LCP and “Time to first contentful paint” to confirm improvement.
