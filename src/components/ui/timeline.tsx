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
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <StaggerContainer className={cn("space-y-10", className)}>
      {items.map((item, index) => (
        <StaggerItem key={item.id}>
          <article className="relative pl-6 sm:pl-7">
            <span
              className="absolute left-0 top-2 size-2.5 rounded-full border-2 border-brand bg-background"
              aria-hidden
            />
            {index < items.length - 1 ? (
              <span
                className="absolute left-[4px] top-4 -bottom-10 w-px bg-brand/30"
                aria-hidden
              />
            ) : null}

            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
              <p className="text-sm tabular-nums text-muted-foreground">{item.period}</p>
            </div>

            {typeof item.description === "string" ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {item.description.map((desc, idx) => (
                  <li key={idx}>{desc}</li>
                ))}
              </ul>
            )}

            {item.technologies && item.technologies.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.technologies.map((tech) => (
                  <TechChip key={tech} tech={tech} />
                ))}
              </div>
            ) : null}
          </article>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
