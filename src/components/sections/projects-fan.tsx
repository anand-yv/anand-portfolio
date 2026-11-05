"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, RotateCw } from "lucide-react";
import { TechChip } from "@/components/ui/tech-chip";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const SUITS = ["♦", "♥", "♣", "♠"] as const;
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

function shortTitle(title: string) {
  return title.split(" ").slice(0, 2).join(" ");
}

/* ------------------------------------------------------------------ card */

function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-0.5 font-hand text-xl text-foreground underline decoration-brand decoration-[3px] underline-offset-4 transition-colors hover:text-link"
    >
      {children}
      <ArrowUpRight className="size-4" aria-hidden />
    </Link>
  );
}

function Corner({ index, suit, className }: { index: number; suit: string; className?: string }) {
  return (
    <div className={cn("text-center font-mono text-xs font-bold leading-tight text-foreground/70", className)} aria-hidden>
      <div>{String(index + 1).padStart(2, "0")}</div>
      <div className="text-base">{suit}</div>
    </div>
  );
}

const faceStyle: React.CSSProperties = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };

function FlipButton({ onClick, label, flipped }: { onClick: () => void; label: string; flipped?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className="sketch-chip inline-flex items-center gap-1 bg-card px-2 py-0.5 font-hand text-lg leading-tight text-foreground transition-colors hover:bg-brand-muted"
    >
      <RotateCw className={cn("size-3 transition-transform duration-300", flipped && "-scale-x-100")} aria-hidden />
      {flipped ? "back" : "flip"}
    </button>
  );
}

/* ----------------------------------------------------------------- ruler */

/**
 * A slim scrubber styled like a ruler: the rail fills as you move through the projects, a round
 * knob follows your finger, and a name tag above it says which project you are on.
 */
function Ruler({
  projects,
  active,
  onSelect,
}: {
  projects: Project[];
  active: number;
  onSelect: (i: number) => void;
}) {
  const reduced = useReducedMotion();
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = React.useState<number | null>(null);

  const n = projects.length;
  const perSegment = 10;
  const total = Math.max(1, (n - 1) * perSegment);
  const frac = drag ?? (n > 1 ? active / (n - 1) : 0);
  const pct = `${frac * 100}%`;
  const spring = reduced || drag !== null ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 28 };

  const fromPointer = (e: React.PointerEvent) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const f = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    setDrag(f);
    onSelect(Math.round(f * (n - 1)));
  };

  return (
    <div className="sketch-box sketch-box--sm px-6 pb-2 pt-11 sm:px-9">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Project ruler"
        aria-valuemin={1}
        aria-valuemax={n}
        aria-valuenow={active + 1}
        aria-valuetext={projects[active]?.title}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onSelect(clamp(active + 1, 0, n - 1));
          if (e.key === "ArrowLeft") onSelect(clamp(active - 1, 0, n - 1));
        }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons) fromPointer(e);
        }}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
        className="relative h-[3.25rem] cursor-ew-resize touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-link/60"
      >
        {/* rail + filled progress */}
        <div className="absolute inset-x-0 top-0 h-2.5 rounded-full border-2 border-ink bg-muted" aria-hidden />
        <motion.div
          className="absolute left-0 top-0 h-2.5 rounded-full border-2 border-ink bg-brand"
          animate={{ width: pct }}
          transition={spring}
          aria-hidden
        />

        {/* ruler ticks hang below the rail */}
        {Array.from({ length: total + 1 }, (_, i) => {
          const major = i % perSegment === 0;
          const mid = i % 5 === 0;
          return (
            <span
              key={i}
              className="absolute top-[18px] w-0 border-l-2 border-ink/70"
              style={{ left: `${(i / total) * 100}%`, height: major ? 14 : mid ? 9 : 5 }}
              aria-hidden
            />
          );
        })}

        {/* project numbers under the major ticks */}
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            tabIndex={-1}
            aria-label={`Go to ${p.title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onSelect(i)}
            className={cn(
              "absolute top-[36px] -translate-x-1/2 font-mono text-xs font-bold leading-none transition-colors",
              i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            style={{ left: `${n > 1 ? (i / (n - 1)) * 100 : 0}%` }}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}

        {/* name tag: shifts with the knob but stays inside the strip at both ends */}
        <motion.div
          className="pointer-events-none absolute bottom-full mb-3 whitespace-nowrap"
          animate={{ left: pct, x: `-${frac * 100}%` }}
          transition={spring}
          aria-hidden
        >
          <span className="sketch-box sketch-box--sm sketch-box--brand block px-2.5 py-0.5 font-hand text-xl leading-tight">
            {projects[active] ? shortTitle(projects[active].title) : ""}
          </span>
        </motion.div>

        {/* knob */}
        <motion.div
          className="pointer-events-none absolute z-10 size-6 rounded-full border-2 border-ink bg-brand shadow-[2px_2px_0_var(--ink)]"
          style={{ top: 5, marginLeft: -12, marginTop: -12 }}
          animate={{ left: pct }}
          transition={spring}
          aria-hidden
        >
          <span className="absolute inset-[5px] rounded-full bg-ink/80" />
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- fan */

export function ProjectsFan({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  const n = projects.length;
  // Start on a middle card so the hand is balanced around the centre.
  const [active, setActive] = React.useState(Math.floor((n - 1) / 2));
  const [flipped, setFlipped] = React.useState(false);
  const [interacted, setInteracted] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [dragDx, setDragDx] = React.useState(0);
  const [dims, setDims] = React.useState({ vw: 1280, card: 247 });

  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const justDragged = React.useRef(false);
  const inView = useInView(wrapRef, { once: true, margin: "-15%" });
  const dealt = inView || reduced;

  React.useEffect(() => {
    const measure = () => setDims({ vw: window.innerWidth, card: cardRef.current?.offsetWidth ?? 247 });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const select = React.useCallback(
    (i: number) => {
      setInteracted(true);
      setActive((prev) => {
        const next = clamp(i, 0, n - 1);
        if (next !== prev) setFlipped(false);
        return next;
      });
    },
    [n]
  );

  // Spacing shrinks when the fan would run off-screen (e.g. an end card is active).
  const farthest = Math.max(active, n - 1 - active, 1);
  const spacing = Math.max(14, Math.min(dims.card * 0.62, (dims.vw / 2 - dims.card / 2 - 12) / farthest));
  const tilt = dims.vw < 640 ? 4 : 5.5;

  // While a finger/mouse drags, the hand follows it continuously (fractional position).
  const pos = clamp(active - dragDx / spacing, -0.35, n - 0.65);

  return (
    <div>
      <div className="mx-auto mb-6 max-w-2xl space-y-1.5">
        <Ruler projects={projects} active={active} onSelect={select} />
        <p className="text-center font-hand text-xl text-muted-foreground">
          <span className="sm:hidden">swipe the cards · tap one to flip it</span>
          <span className="hidden sm:inline">← drag the ruler or swipe the cards · tap a card to flip it →</span>
        </p>
      </div>

      <motion.div
        ref={wrapRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") select(active + 1);
          if (e.key === "ArrowLeft") select(active - 1);
        }}
        onPanStart={() => {
          justDragged.current = true;
          setDragging(true);
        }}
        onPan={(_, info) => setDragDx(info.offset.x)}
        onPanEnd={(_, info) => {
          // Momentum: a quick flick travels further than a slow drag.
          const projected = active - (info.offset.x + info.velocity.x * 0.18) / spacing;
          setDragging(false);
          setDragDx(0);
          select(Math.round(projected));
          setTimeout(() => (justDragged.current = false), 60);
        }}
        className="relative h-[28rem] touch-pan-y select-none outline-none [-webkit-user-drag:none]"
      >
        {projects.map((project, i) => {
          const off = i - pos;
          const isActive = i === active;
          const isFlipped = isActive && flipped;
          const suit = SUITS[(project.accent ?? 1) - 1] ?? SUITS[0];
          const abs = Math.abs(off);

          const state = dealt
            ? {
                x: off * spacing,
                y: abs ** 2 * 7 + (isActive ? 0 : 10),
                rotate: off * tilt,
                scale: 1 - Math.min(abs, 3) * 0.045,
                opacity: 1,
              }
            : { x: 0, y: 40, rotate: 0, scale: 0.9, opacity: 0 };

          return (
            <motion.div
              key={project.id}
              ref={i === 0 ? cardRef : undefined}
              role={isActive ? undefined : "button"}
              tabIndex={isActive ? -1 : 0}
              aria-label={isActive ? undefined : `Show ${project.title}`}
              onClick={isActive ? undefined : () => !justDragged.current && select(i)}
              onKeyDown={
                isActive
                  ? undefined
                  : (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select(i);
                      }
                    }
              }
              initial={false}
              animate={state}
              whileHover={!isActive && dealt && !reduced && !dragging ? { y: state.y - 14 } : undefined}
              transition={
                reduced || dragging
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 210, damping: 24, delay: interacted ? 0 : i * 0.08 }
              }
              style={
                {
                  zIndex: 10 - Math.round(abs),
                  marginLeft: `${-dims.card / 2}px`,
                  transformOrigin: "50% 100%",
                  perspective: 1200,
                  "--pop": `var(--pop-${project.accent ?? 1})`,
                } as React.CSSProperties
              }
              className={cn(
                "absolute left-1/2 top-0 h-[23.5rem] w-[19rem] max-w-[calc(100vw-4rem)]",
                isActive ? "cursor-default" : "cursor-pointer"
              )}
            >
              {/* the flipper: rotates 180deg to reveal the back face */}
              <motion.div
                className="relative size-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 22 }}
              >
                {/* FRONT: image, name, code / live */}
                <div
                  className="sketch-box sketch-box--pop absolute inset-0 flex flex-col p-3"
                  style={faceStyle}
                  onClick={isActive && !isFlipped ? () => !justDragged.current && setFlipped(true) : undefined}
                >
                  <div inert={!isActive || isFlipped} className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Corner index={i} suit={suit} />
                      <span className="sketch-chip bg-card px-2 py-0.5 font-hand text-lg capitalize leading-tight text-link">
                        {project.category}
                      </span>
                    </div>

                    <div
                      className="relative mt-2 aspect-[16/10] w-full overflow-hidden border-2 border-ink/80 [border-radius:6px_3px_7px_3px/3px_7px_3px_6px]"
                      style={{ background: "var(--pop)" }}
                    >
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={`${project.title} screenshot`}
                          fill
                          sizes="320px"
                          draggable={false}
                          className="pointer-events-none select-none object-cover [-webkit-user-drag:none]"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center font-hand text-xl text-ink/70">
                          screenshot coming soon
                        </div>
                      )}
                      <div className="halftone pointer-events-none absolute bottom-0 right-0 size-16 text-ink/25" aria-hidden />
                    </div>

                    <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-foreground">
                      {project.title}
                    </h3>

                    <div className="mt-auto flex items-center justify-between gap-3 pb-1 pt-3">
                      <div className="flex items-center gap-4">
                        {project.githubUrl ? <CardLink href={project.githubUrl}>Code</CardLink> : null}
                        {project.liveUrl ? <CardLink href={project.liveUrl}>Live</CardLink> : null}
                      </div>
                      <FlipButton onClick={() => setFlipped(true)} label={`Flip ${project.title} to read details`} />
                    </div>
                  </div>
                </div>

                {/* BACK: description, highlights, technologies */}
                <div
                  className="sketch-box sketch-box--pop absolute inset-0 flex flex-col p-3"
                  style={{ ...faceStyle, transform: "rotateY(180deg)" }}
                  onClick={isFlipped ? () => !justDragged.current && setFlipped(false) : undefined}
                >
                  <div inert={!isFlipped} className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Corner index={i} suit={suit} />
                      <FlipButton onClick={() => setFlipped(false)} label="Flip back to the front" flipped />
                    </div>

                    <h3 className="mt-1 text-lg font-bold leading-tight tracking-tight text-foreground">
                      {project.title}
                    </h3>

                    <div className="resume-modal-scroll mt-2 min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
                      <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>

                      {project.highlights.length > 0 ? (
                        <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground">
                          {project.highlights.slice(0, 3).map((h, k) => (
                            <li key={k} className="flex gap-1.5">
                              <span className="font-hand text-base leading-none text-link" aria-hidden>
                                ✓
                              </span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <div>
                        <p className="mb-1 font-hand text-lg leading-none text-link">built with</p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech) => (
                            <TechChip key={tech} tech={tech} showIcon={false} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <p className="sr-only" aria-live="polite">
        Showing project {active + 1} of {n}: {projects[active]?.title}
      </p>
    </div>
  );
}
