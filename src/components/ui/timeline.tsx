"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { TechChip } from "@/components/ui/tech-chip";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description: string | string[];
  technologies?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  maxPoints?: number;
  variant?: "experience" | "education";
}

function getDescriptionPoints(description: string | string[], maxPoints: number): string[] {
  if (typeof description === "string") return description ? [description] : [];
  return description.slice(0, maxPoints);
}

export function Timeline({ items, className, maxPoints = 4, variant = "experience" }: TimelineProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* dashed track + ink line that draws as you scroll */}
      <span className="absolute bottom-2 left-[7px] top-3 w-0 border-l-2 border-dashed border-ink/25" aria-hidden />
      <motion.span
        className="absolute bottom-2 left-[6px] top-3 w-[3px] origin-top rounded-full bg-brand"
        style={reduced ? undefined : { scaleY }}
        aria-hidden
      />

      <StaggerContainer className="space-y-6">
        {items.map((item, index) => {
          const points = getDescriptionPoints(item.description, maxPoints);
          const isCurrent =
            variant === "experience" && (index === 0 || item.period.includes("Present"));

          return (
            <StaggerItem key={item.id}>
              <article className="relative pl-10 sm:pl-12">
                <span
                  className={cn(
                    "absolute left-0 top-5 z-[1] size-4 rounded-full border-2 border-ink bg-background",
                    isCurrent && "bg-brand shadow-[0_0_0_4px_var(--brand-muted)]"
                  )}
                  aria-hidden
                />

                <div className="sketch-box group relative p-4 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <span
                      className={cn(
                        "sketch-box sketch-box--sm inline-flex w-fit shrink-0 px-3 py-1 font-mono text-xs tabular-nums",
                        isCurrent ? "sketch-box--brand" : "text-muted-foreground"
                      )}
                    >
                      {item.period}
                    </span>
                  </div>

                  {points.length > 0 ? (
                    <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                      {points.map((desc, idx) => (
                        <li key={idx} className="flex gap-2.5">
                          <span className="font-hand text-xl leading-[1.2] text-link" aria-hidden>
                            ✓
                          </span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {item.technologies && item.technologies.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2 border-t-2 border-dashed border-ink/20 pt-4">
                      {item.technologies.map((tech) => (
                        <TechChip key={tech} tech={tech} showIcon />
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}
