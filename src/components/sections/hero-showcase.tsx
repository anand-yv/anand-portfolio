"use client";

import { motion } from "motion/react";
import {
  Code2,
  Database,
  MapPin,
  Server,
  type LucideIcon,
} from "lucide-react";
import { personalInfo } from "@/data/personal";
import { experience } from "@/data/experience";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const STACK_ITEMS: { label: string; icon: LucideIcon }[] = [
  { label: "Java", icon: Code2 },
  { label: "Spring Boot", icon: Server },
  { label: "React", icon: Code2 },
  { label: "TypeScript", icon: Code2 },
  { label: "PostgreSQL", icon: Database },
  { label: "MongoDB", icon: Database },
];

const currentRole = experience[0];

export function HeroShowcase() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "glass-panel group relative overflow-hidden rounded-sm p-6",
        "transition-shadow duration-300 hover:shadow-lg hover:shadow-brand/10",
        "border-brand/20 hover:border-brand/40"
      )}
      initial={reduced ? false : { opacity: 0, x: 24, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 22, delay: 0.35 }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      <p className="text-xs font-semibold uppercase tracking-wider text-brand">
        Core stack
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {STACK_ITEMS.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-sm border border-border/60 bg-background/50 px-3 py-2.5 transition-colors hover:border-brand/30 hover:bg-brand-muted/50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-brand-muted text-brand">
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-border/60 pt-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
          <span>{personalInfo.location}</span>
        </div>
        {currentRole ? (
          <p className="leading-relaxed">
            <span className="text-foreground">{currentRole.position}</span>
            {" @ "}
            {currentRole.company.replace(" Private Limited", "")}
          </p>
        ) : (
          <p className="leading-relaxed">
            <span className="text-foreground">{personalInfo.title}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
