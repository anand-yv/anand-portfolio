import * as React from "react";
import { Code2, Database, Server, Wrench } from "lucide-react";
import { TechChip } from "@/components/ui/tech-chip";
import { cn } from "@/lib/utils";
import type { Skill, SkillLayerIcon } from "@/types";

const layerIcons = {
  code: Code2,
  server: Server,
  database: Database,
  wrench: Wrench,
} as const;

interface SkillLayerCardProps {
  index: number;
  title: string;
  subtitle?: string;
  icon: SkillLayerIcon;
  skills: Skill[];
  emphasized?: boolean;
  /** Colored-pencil accent 1-4 for the shadow and icon chip. */
  accent?: 1 | 2 | 3 | 4;
  className?: string;
}

export function SkillLayerCard({
  index,
  title,
  subtitle,
  icon,
  skills,
  emphasized = false,
  accent = 1,
  className,
}: SkillLayerCardProps) {
  const Icon = layerIcons[icon];

  return (
    <article
      style={{ "--pop": `var(--pop-${accent})` } as React.CSSProperties}
      className={cn(
        "sketch-box sketch-box--pop group relative p-4 transition-transform duration-200 motion-safe:hover:-translate-y-1 sm:p-5",
        emphasized && "sketch-box--accent",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="sketch-box sketch-box--sm flex size-10 shrink-0 items-center justify-center text-ink"
            style={{ background: "var(--pop)" }}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
        <span className="font-mono text-xs text-muted-foreground">layer 0{index}</span>
      </div>

      {emphasized ? (
        <p className="mt-3 font-hand text-xl leading-none text-link">✎ my home turf</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <TechChip key={skill.name} tech={skill.name} showIcon />
        ))}
      </div>
    </article>
  );
}
