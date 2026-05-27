"use client";

import { TechChip } from "@/components/ui/tech-chip";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
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

function getDescriptionPoints(
  description: string | string[],
  maxPoints: number
): string[] {
  if (typeof description === "string") {
    return description ? [description] : [];
  }
  return description.slice(0, maxPoints);
}

export function Timeline({
  items,
  className,
  maxPoints = 4,
  variant = "experience",
}: TimelineProps) {
  return (
    <StaggerContainer className={cn("relative space-y-6 sm:space-y-8", className)}>
      {items.map((item, index) => {
        const points = getDescriptionPoints(item.description, maxPoints);
        const isFirst = index === 0;
        const isCurrent =
          variant === "experience" &&
          (item.period.includes("Present") || item.period.endsWith("– Present"));

        return (
          <StaggerItem key={item.id}>
            <article className="relative pl-8 sm:pl-10">
              <span
                className={cn(
                  "absolute left-0 top-6 z-[1] size-3 rounded-sm border-2 bg-background",
                  isFirst || isCurrent
                    ? "border-brand bg-brand-muted shadow-[0_0_0_3px_var(--brand-muted)]"
                    : "border-brand/60"
                )}
                aria-hidden
              />
              {index < items.length - 1 ? (
                <span
                  className="absolute left-[5px] top-8 -bottom-6 w-px bg-brand/25 sm:-bottom-8"
                  aria-hidden
                />
              ) : null}

              <div
                className={cn(
                  "group glass-panel relative overflow-hidden rounded-sm p-5 transition-shadow duration-300 sm:p-6",
                  "hover:border-brand/30 hover:shadow-md hover:shadow-brand/10",
                  (isFirst || isCurrent) &&
                    "border-brand/20 bg-gradient-to-br from-card/80 via-card/60 to-brand-muted/15"
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent",
                    isFirst || isCurrent
                      ? "opacity-100"
                      : "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  )}
                  aria-hidden
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <span className="inline-flex w-fit shrink-0 rounded-sm border border-border/80 bg-muted/30 px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                    {item.period}
                  </span>
                </div>

                {points.length > 0 ? (
                  <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                    {points.map((desc, idx) => (
                      <li
                        key={idx}
                        className="flex gap-2.5 before:mt-2 before:size-1 before:shrink-0 before:rounded-full before:bg-brand/70 before:content-['']"
                      >
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {item.technologies && item.technologies.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-border/60 pt-4">
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
  );
}
