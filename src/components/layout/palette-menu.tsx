"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type PaletteId = "yellow" | "indigo" | "tomato" | "forest";

// Swatches mirror the light-mode colours defined in globals.css (brand, a second tint, a third tint).
const OPTIONS: { id: PaletteId; label: string; hint: string; swatch: [string, string, string] }[] = [
  { id: "yellow", label: "Highlighter", hint: "sunny yellow, coral, mint", swatch: ["oklch(0.88 0.17 95)", "oklch(0.72 0.17 15)", "oklch(0.78 0.14 165)"] },
  { id: "indigo", label: "Indigo", hint: "deep blue with a gold spark", swatch: ["oklch(0.48 0.2 270)", "oklch(0.8 0.12 275)", "oklch(0.86 0.16 95)"] },
  { id: "tomato", label: "Tomato", hint: "bold, warm and juicy", swatch: ["oklch(0.6 0.21 30)", "oklch(0.78 0.13 55)", "oklch(0.88 0.12 90)"] },
  { id: "forest", label: "Forest", hint: "earthy green and lime", swatch: ["oklch(0.45 0.11 160)", "oklch(0.72 0.14 150)", "oklch(0.87 0.15 115)"] },
];

function currentPalette(): PaletteId {
  const v = document.documentElement.dataset.palette;
  return OPTIONS.some((o) => o.id === v) ? (v as PaletteId) : "tomato";
}

/** Applies and saves a palette. Lives outside the component because it writes to the document. */
function applyPalette(id: PaletteId) {
  document.documentElement.dataset.palette = id;
  try {
    localStorage.setItem("palette", id);
  } catch {
    // storage unavailable: the choice just won't persist
  }
}

function Dots({ swatch, size = "size-4" }: { swatch: readonly string[]; size?: string }) {
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {swatch.map((c, i) => (
        <span key={i} className={cn("rounded-full border border-ink/70 shadow-[inset_0_-2px_0_rgb(0_0_0/0.12)]", size)} style={{ background: c }} />
      ))}
    </span>
  );
}

/** Navbar colour-palette picker. The choice is saved in localStorage and restored before first paint. */
export function PaletteMenu() {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<PaletteId>("tomato");
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => setActive(currentPalette()), []);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (id: PaletteId) => {
    setActive(id);
    applyPalette(id);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const current = OPTIONS.find((o) => o.id === active) ?? OPTIONS[0];

  return (
    <div ref={wrapRef} className="sm:relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Colour palette: ${current.label}. Open palette menu.`}
        className="sketch-chip flex h-11 min-w-11 items-center justify-center bg-card px-2.5 transition-colors hover:bg-brand-muted"
      >
        <Dots swatch={current.swatch} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="listbox"
            aria-label="Colour palette"
            className="sketch-box absolute inset-x-0 top-[calc(100%+0.75rem)] z-50 flex flex-col sm:inset-x-auto sm:right-0 sm:top-[calc(100%+1.1rem)] sm:w-[18rem] gap-2 p-3.5"
            initial={reduced ? false : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          >
            <p className="px-1 pb-0.5 font-hand text-2xl leading-none text-link">pick a colour mood</p>
            {OPTIONS.map((o) => {
              const selected = o.id === active;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => choose(o.id)}
                  className={cn(
                    // Selected = solid ink outline + tinted fill. Hover = a quieter neutral fill with a faint
                    // outline, so the two states can never look alike. Every row has the same 2px border so
                    // nothing shifts when the state changes.
                    "flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-colors",
                    selected
                      ? "border-ink bg-brand-muted"
                      : "border-transparent hover:border-ink/35 hover:bg-muted"
                  )}
                >
                  <Dots swatch={o.swatch} size="size-5" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-hand text-2xl leading-none text-foreground">{o.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{o.hint}</span>
                  </span>
                  {selected ? <Check className="size-4 shrink-0 text-link" aria-hidden /> : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
