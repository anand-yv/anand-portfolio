"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Skill, SkillLayerConfig } from "@/types";
import { SkillIcon } from "@/components/sections/skill-icon";

type Category = Skill["category"];

// One colour-pencil tint per layer (these are the --pop-1..4 tokens, so palettes recolour them).
const POP: Record<Category, 1 | 2 | 3 | 4> = { backend: 1, frontend: 4, database: 3, tools: 2, other: 4 };

// Fixed tilts so server and client render the same thing. Each sticker gets one by its position.
const TILT = [-3, 2, -1.5, 3.5, -2.5, 1.5, -1, 2.5, -3.5, 1];
const NUDGE = [0, 4, -3, 2, -4, 3, -2, 5, -1, 3];

const CARD_BG = "color-mix(in oklch, var(--pop) 42%, var(--card))";

/**
 * Skills as a sheet of die-cut stickers. The legend filters by layer: matching stickers stay lit and the
 * rest fade. There are no skill bars or ratings on purpose; it only shows what is used.
 */
export function SkillStickerSheet({ skills, layers }: { skills: Skill[]; layers: SkillLayerConfig[] }) {
  const reduced = useReducedMotion();
  const List = reduced ? "ul" : motion.ul;
  const Item = reduced ? "li" : motion.li;
  const [filter, setFilter] = React.useState<Category | "all">("all");

  // Emphasised layer (backend) first, then the rest in their configured order.
  const ordered = React.useMemo(() => {
    const layerOrder = [...layers].sort((a, b) => Number(!!b.emphasized) - Number(!!a.emphasized));
    return layerOrder.flatMap((layer) =>
      skills.filter((s) => s.category === layer.category).map((s) => ({ skill: s, layer }))
    );
  }, [skills, layers]);

  const legend = React.useMemo(
    () =>
      [...layers]
        .sort((a, b) => Number(!!b.emphasized) - Number(!!a.emphasized))
        .map((l) => ({ layer: l, count: skills.filter((s) => s.category === l.category).length })),
    [skills, layers]
  );

  return (
    <div>
      {/* legend / filter */}
      <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filter skills by layer">
        <button
          type="button"
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
          className={cn(
            "sketch-chip px-3 py-1 font-hand text-xl leading-tight transition-colors",
            filter === "all" ? "sketch-box--brand text-brand-foreground" : "bg-card text-foreground hover:bg-brand-muted"
          )}
        >
          all <span className="font-mono text-sm opacity-70">{skills.length}</span>
        </button>

        {legend.map(({ layer, count }) => {
          const on = filter === layer.category;
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(on ? "all" : layer.category)}
              className={cn(
                "sketch-chip inline-flex items-center gap-2 px-3 py-1 font-hand text-xl leading-tight text-foreground transition-colors",
                on ? "bg-brand-muted" : "bg-card hover:bg-brand-muted"
              )}
              style={on ? { boxShadow: "2px 2px 0 var(--pop)", ["--pop" as string]: `var(--pop-${POP[layer.category]})` } : undefined}
            >
              <span
                className="size-3 rounded-full border-2 border-ink"
                style={{ background: `var(--pop-${POP[layer.category]})` }}
                aria-hidden
              />
              {layer.title.toLowerCase()}
              <span className="font-mono text-sm text-muted-foreground">{count}</span>
              {layer.emphasized ? <span className="text-link">✎ home turf</span> : null}
            </button>
          );
        })}
      </div>

      {/* the sheet */}
      <div
        className="sketch-box relative mt-6 p-5 sm:p-8"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--ink) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--ink) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <span className="sketch-tape" aria-hidden />
        {/* With reduced motion these are plain elements (no hidden starting state to get stuck in). */}
        <List
          className="flex flex-wrap justify-center gap-x-3.5 gap-y-5 sm:gap-x-4"
          aria-label="Skills"
          {...(reduced
            ? {}
            : {
                initial: "hidden",
                whileInView: "show",
                viewport: { once: true, margin: "-12%" },
                variants: { hidden: {}, show: { transition: { staggerChildren: 0.04 } } },
              })}
        >
          {ordered.map(({ skill, layer }, i) => {
            const emphasized = !!layer.emphasized;
            const lit = filter === "all" || filter === skill.category;
            const tilt = TILT[i % TILT.length];
            return (
              <Item
                key={skill.name}
                className="relative"
                style={{
                  marginTop: NUDGE[i % NUDGE.length],
                  zIndex: lit ? 1 : 0,
                  ...(reduced ? { transform: `rotate(${tilt}deg)` } : {}),
                }}
                {...(reduced
                  ? {}
                  : {
                      variants: {
                        hidden: { opacity: 0, scale: 1.7, rotate: tilt * 4, y: -14 },
                        show: { opacity: 1, scale: 1, rotate: tilt, y: 0, transition: { type: "spring", stiffness: 420, damping: 17 } },
                      },
                      whileHover: { scale: 1.1, rotate: 0, y: -5, zIndex: 5 },
                    })}
              >
                {/* dimming lives on an inner element so it never fights the entrance / hover animation */}
                <span
                  className={cn(
                    "sketch-box sketch-box--sm inline-flex items-center gap-2 font-display font-semibold text-foreground transition-[opacity,filter,transform] duration-300",
                    emphasized ? "px-4 py-2.5 text-lg" : "px-3.5 py-2 text-base",
                    !lit && "scale-90 opacity-30 grayscale"
                  )}
                  style={{ background: CARD_BG, ["--pop" as string]: `var(--pop-${POP[skill.category]})` }}
                >
                  <SkillIcon name={skill.name} />
                  {skill.name}
                </span>
              </Item>
            );
          })}
        </List>
      </div>
    </div>
  );
}
