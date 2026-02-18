"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Server,
  Code2,
  Database,
  Cable,
  Wrench,
  Layers,
  type LucideIcon,
} from "lucide-react";

interface TechChipProps {
  tech: string;
  className?: string;
  showIcon?: boolean;
}

// Map tech keywords to icon categories
function getTechCategory(tech: string): {
  category: "backend" | "frontend" | "database" | "api" | "tools" | "microservices" | null;
  icon: LucideIcon | null;
} {
  const lower = tech.toLowerCase();

  // Backend
  if (
    lower.includes("java") ||
    lower.includes("spring") ||
    lower.includes("backend") ||
    lower.includes("server")
  ) {
    return { category: "backend", icon: Server };
  }

  // Frontend
  if (
    lower.includes("react") ||
    lower.includes("typescript") ||
    lower.includes("javascript") ||
    lower.includes("frontend") ||
    lower.includes("html") ||
    lower.includes("css")
  ) {
    return { category: "frontend", icon: Code2 };
  }

  // Database
  if (
    lower.includes("postgres") ||
    lower.includes("mongo") ||
    lower.includes("database") ||
    lower.includes("sql") ||
    lower.includes("db")
  ) {
    return { category: "database", icon: Database };
  }

  // API
  if (
    lower.includes("api") ||
    lower.includes("rest") ||
    lower.includes("graphql") ||
    lower.includes("endpoint")
  ) {
    return { category: "api", icon: Cable };
  }

  // Microservices
  if (
    lower.includes("microservice") ||
    lower.includes("micro-service") ||
    lower.includes("service mesh")
  ) {
    return { category: "microservices", icon: Layers };
  }

  // Tools
  if (
    lower.includes("docker") ||
    lower.includes("git") ||
    lower.includes("linux") ||
    lower.includes("devops") ||
    lower.includes("tool")
  ) {
    return { category: "tools", icon: Wrench };
  }

  return { category: null, icon: null };
}

export function TechChip({ tech, className, showIcon = true }: TechChipProps) {
  const { icon: Icon } = getTechCategory(tech);
  const shouldShowIcon = showIcon && Icon !== null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full bg-card/40 px-3 py-1 text-sm",
        "transition-all duration-200 ease-out",
        "hover:bg-card/60 hover:border-primary/40 hover:shadow-sm hover:shadow-primary/10",
        "inline-flex items-center gap-1.5",
        className
      )}
    >
      {shouldShowIcon && (
        <Icon className="size-3 text-primary/80 shrink-0" aria-hidden="true" />
      )}
      <span>{tech}</span>
    </Badge>
  );
}

