"use client";

import { motion } from "motion/react";
import {
  Server,
  Code2,
  Database,
  Cable,
  Wrench,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TechChipProps {
  tech: string;
  className?: string;
  showIcon?: boolean;
}

function TechIcon({ tech }: { tech: string }) {
  const className = "size-3 shrink-0 text-brand";
  const lower = tech.toLowerCase();

  if (
    lower.includes("java") ||
    lower.includes("spring") ||
    lower.includes("backend")
  ) {
    return <Server className={className} aria-hidden />;
  }
  if (
    lower.includes("react") ||
    lower.includes("typescript") ||
    lower.includes("javascript") ||
    lower.includes("frontend") ||
    lower.includes("html") ||
    lower.includes("css")
  ) {
    return <Code2 className={className} aria-hidden />;
  }
  if (
    lower.includes("postgres") ||
    lower.includes("mongo") ||
    lower.includes("database") ||
    lower.includes("sql")
  ) {
    return <Database className={className} aria-hidden />;
  }
  if (lower.includes("api") || lower.includes("rest")) {
    return <Cable className={className} aria-hidden />;
  }
  if (lower.includes("microservice")) {
    return <Layers className={className} aria-hidden />;
  }
  if (
    lower.includes("docker") ||
    lower.includes("git") ||
    lower.includes("linux")
  ) {
    return <Wrench className={className} aria-hidden />;
  }
  return null;
}

export function TechChip({ tech, className, showIcon = true }: TechChipProps) {
  const reduced = useReducedMotion();
  const Comp = reduced ? "span" : motion.span;

  return (
    <Comp
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground",
        "transition-colors hover:border-brand/50 hover:bg-brand-muted hover:text-foreground",
        className
      )}
      {...(!reduced
        ? {
            whileHover: { scale: 1.04 },
            transition: { type: "spring", stiffness: 400, damping: 22 },
          }
        : {})}
    >
      {showIcon ? <TechIcon tech={tech} /> : null}
      <span>{tech}</span>
    </Comp>
  );
}
