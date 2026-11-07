"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { ThemeToggle } from "./theme-toggle";
import { PaletteMenu } from "./palette-menu";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const navLinks = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "contact" },
] as const;

// Sections that should highlight a given nav item.
const SPY_MAP: Record<string, (typeof navLinks)[number]["id"]> = {
  about: "about",
  skills: "skills",
  projects: "projects",
  experience: "experience",
  education: "experience",
  contact: "contact",
};

export function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [active, setActive] = React.useState<string | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Scroll-spy: highlight the nav item for the section crossing the upper-middle of the viewport.
  React.useEffect(() => {
    const els = Object.keys(SPY_MAP)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const hero = document.getElementById("hero");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(SPY_MAP[entry.target.id] ?? null);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    const heroObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setActive(null),
      { rootMargin: "-35% 0px -55% 0px" }
    );
    if (hero) heroObserver.observe(hero);
    return () => {
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  const scrollToSection = React.useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 sm:px-4">
        {/* roomy on purpose: tall bar, generous gaps, large lettering */}
        <div className="sketch-box pointer-events-auto relative mx-auto flex h-[4.25rem] max-w-6xl -rotate-[0.3deg] items-center justify-between gap-5 bg-background/95 pl-3.5 pr-3 backdrop-blur-md">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
            aria-label="Back to top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="sketch-box sketch-box--sm sketch-box--brand flex size-11 items-center justify-center font-display text-base font-extrabold transition-transform group-hover:-rotate-6">
              AY
            </span>
            <span className="hidden whitespace-nowrap font-display text-[1.05rem] font-bold tracking-tight text-foreground xl:inline">
              Anand Yadav
            </span>
          </Link>

          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main">
            {navLinks.map(({ id, label }, i) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    "group relative whitespace-nowrap px-3 py-2 font-hand text-[1.75rem] leading-none transition-colors lg:px-4",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-marker"
                      className="absolute inset-x-1 bottom-1 top-2.5 -z-0 -rotate-1"
                      style={{ background: "var(--marker)", borderRadius: "7px 3px 8px 3px / 3px 8px 3px 7px" }}
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative z-10">
                    <sup className="mr-1 font-mono text-[0.78rem] font-bold not-italic opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </sup>
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="sketch-btn sketch-box--brand hidden shrink-0 whitespace-nowrap px-5 py-2 font-hand text-[1.75rem] leading-none lg:inline-flex"
            >
              hire me
            </button>
            <PaletteMenu />
            <ThemeToggle />
            <button
              type="button"
              className="sketch-chip flex size-11 items-center justify-center bg-card text-foreground md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>

          {/* reading-progress line along the bottom edge of the bar */}
          {!reduced ? (
            <motion.span
              className="absolute inset-x-5 bottom-[4px] h-[3px] origin-left rounded-full bg-link"
              style={{ scaleX: progress }}
              aria-hidden
            />
          ) : null}
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              role="presentation"
              className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              id="mobile-nav-menu"
              aria-label="Mobile"
              className="sketch-box fixed left-4 right-4 top-[5.75rem] z-50 p-2.5 md:hidden"
              initial={{ opacity: 0, y: -8, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {navLinks.map(({ id, label }, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    "flex w-full items-baseline gap-3.5 rounded-md px-3.5 py-3 text-left transition-colors hover:bg-brand-muted",
                    active === id && "bg-brand-muted"
                  )}
                >
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-hand text-[2rem] leading-none">{label}</span>
                </button>
              ))}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
