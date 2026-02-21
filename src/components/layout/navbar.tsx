"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

const navLinks = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export function Navbar() {
  const [mounted, setMounted] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-x-0 -bottom-12 h-12 bg-gradient-to-b from-background/50 via-background/20 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Anand Yadav
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1">
                {navLinks.map(({ id, label }) => (
                  <Button
                    key={id}
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(id)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <div className="sm:hidden relative flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-nav-menu"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                  {menuOpen ? (
                    <X className="size-5" aria-hidden />
                  ) : (
                    <Menu className="size-5" aria-hidden />
                  )}
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile: light glass overlay + full-width menu with side gap */}
      <div className="sm:hidden">
        {/* Light glass — subtle tint + minimal blur, not heavy */}
        <div
          role="presentation"
          aria-hidden
          className={`
            fixed inset-0 z-40
            bg-foreground/[0.08] dark:bg-foreground/[0.12] backdrop-blur-[6px]
            transition-[visibility,opacity] duration-200 ease-out
            ${menuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}
          `}
          onClick={() => setMenuOpen(false)}
        />
        {/* Menu card — light: soft off-white to match theme; dark: unchanged; wider; staggered slide */}
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-label="Navigation menu"
          className={`
            fixed left-2 right-2 top-[4.25rem] z-50
            rounded-lg border border-border
            bg-secondary/95 dark:bg-background/75 backdrop-blur-md
            shadow-lg shadow-black/5 dark:shadow-black/20
            py-2
            transition-[visibility,opacity,transform] duration-200 ease-out
            ${menuOpen ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-[0.98] pointer-events-none"}
          `}
        >
          <nav className="flex flex-col overflow-hidden">
            {navLinks.map(({ id, label }, i) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                style={menuOpen ? { animationDelay: `${i * 60}ms` } : undefined}
                className={`
                  mobile-nav-item w-full text-left py-2.5 px-4 text-sm font-medium text-foreground
                  hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-colors
                  first:pt-1 last:pb-1
                  opacity-0
                  ${menuOpen ? (i % 2 === 0 ? "slide-left" : "slide-right") : ""}
                `}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

