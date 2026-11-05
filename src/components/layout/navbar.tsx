"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { ThemeToggle } from "./theme-toggle";
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
        <div className="sketch-box pointer-events-auto relative mx-auto flex h-[3.25rem] max-w-4xl -rotate-[0.3deg] items-center justify-between gap-3 pl-2.5 pr-2">
          <Link
            href="/"
            className="group flex items-center gap-2"
            aria-label="Back to top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="sketch-box sketch-box--sm sketch-box--brand flex size-8 items-center justify-center font-display text-sm font-extrabold transition-transform group-hover:-rotate-6">
              AY
            </span>
            <span className="hidden font-display text-base font-bold tracking-tight text-foreground sm:inline">
              Anand Yadav
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navLinks.map(({ id, label }, i) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    "group relative px-2.5 py-1 font-hand text-2xl leading-none transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-marker"
                      className="absolute inset-x-0.5 bottom-0.5 top-1.5 -z-0 -rotate-1"
                      style={{ background: "var(--marker)", borderRadius: "6px 3px 7px 3px / 3px 7px 3px 6px" }}
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative z-10">
                    <sup className="mr-0.5 font-mono text-[0.55rem] font-bold not-italic opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </sup>
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="sketch-btn sketch-box--brand hidden px-3 py-1 font-hand text-2xl leading-none lg:inline-flex"
            >
              hire me
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="sketch-chip flex size-9 items-center justify-center bg-card text-foreground md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            </button>
          </div>

          {/* reading-progress line, drawn along the bottom edge of the bar */}
          {!reduced ? (
            <motion.span
              className="absolute inset-x-4 bottom-[3px] h-[3px] origin-left rounded-full bg-link"
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
              className="sketch-box fixed left-4 right-4 top-[4.75rem] z-50 p-2 md:hidden"
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
                    "flex w-full items-baseline gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-brand-muted",
                    active === id && "bg-brand-muted"
                  )}
                >
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-hand text-2xl leading-none">{label}</span>
                </button>
              ))}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
