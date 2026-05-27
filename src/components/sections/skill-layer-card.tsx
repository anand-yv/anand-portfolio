"use client";

import { Code2, Database, Server, Wrench } from "lucide-react";
import { motion } from "motion/react";
import { TechChip } from "@/components/ui/tech-chip";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Skill, SkillLayerIcon } from "@/types";

const layerIcons = {
  code: Code2,
  server: Server,
  database: Database,
  wrench: Wrench,
} as const;

interface SkillLayerCardProps {
  title: string;
  subtitle?: string;
  icon: SkillLayerIcon;
  skills: Skill[];
  emphasized?: boolean;
  className?: string;
}

function chipClassName(proficiency?: Skill["proficiency"]) {
  if (proficiency === "advanced" || proficiency === "expert") {
    return "border-brand/35 bg-brand-muted/40";
  }
  return undefined;
}

export function SkillLayerCard({
  title,
  subtitle,
  icon,
  skills,
  emphasized = false,
  className,
}: SkillLayerCardProps) {
  const Icon = layerIcons[icon];
  const reduced = useReducedMotion();
  const Comp = reduced ? "article" : motion.article;

  return (
    <Comp
      className={cn(
        "group glass-panel relative overflow-hidden rounded-xl p-5 sm:p-6",
        "transition-shadow duration-300 hover:border-brand/30 hover:shadow-md hover:shadow-brand/10",
        emphasized && "border-brand/25 bg-gradient-to-br from-card/80 via-card/60 to-brand-muted/20",
        !reduced && "hover:-translate-y-0.5",
        className
      )}
      {...(!reduced
        ? {
            whileHover: { y: -2 },
            transition: { type: "spring", stiffness: 300, damping: 24 },
          }
        : {})}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent",
          emphasized ? "opacity-100" : "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        )}
        aria-hidden
      />
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-brand-muted text-brand">
          <Icon className="size-[1.125rem]" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <TechChip
            key={skill.name}
            tech={skill.name}
            showIcon
            className={chipClassName(skill.proficiency)}
          />
        ))}
      </div>
    </Comp>
  );
}
