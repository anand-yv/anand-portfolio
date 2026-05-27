"use client";

import Link from "next/link";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export type ContactChannelIcon = "github" | "linkedin";

const channelIcons = {
  github: Github,
  linkedin: Linkedin,
} as const;

interface ContactChannelCardProps {
  href: string;
  label: string;
  description: string;
  icon: ContactChannelIcon;
  external?: boolean;
  className?: string;
}

export function ContactChannelCard({
  href,
  label,
  description,
  icon,
  external = true,
  className,
}: ContactChannelCardProps) {
  const Icon = channelIcons[icon];
  const reduced = useReducedMotion();
  const Comp = reduced ? "div" : motion.div;

  return (
    <Comp
      className={cn("h-full", className)}
      {...(!reduced
        ? {
            whileHover: { y: -2 },
            transition: { type: "spring", stiffness: 300, damping: 24 },
          }
        : {})}
    >
      <Link
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={cn(
          "group glass-panel flex h-full items-center gap-2 rounded-sm p-3 transition-shadow duration-300 sm:p-3.5",
          "hover:border-brand/30 hover:shadow-md hover:shadow-brand/10"
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/80 bg-brand-muted text-brand">
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
            {label}
            <ArrowUpRight
              className="size-3 shrink-0 text-brand opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {description}
          </span>
        </span>
      </Link>
    </Comp>
  );
}
