"use client";

import * as React from "react";
import { TypingText } from "@/components/ui/typing-text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export const HERO_ROLE_PHRASES = [
  "Full-Stack Engineer",
  "Backend Engineer",
  "Frontend Engineer",
] as const;

export const HERO_ROLE_FALLBACK = HERO_ROLE_PHRASES[0];

type HeroTaglineProps = {
  /** Server-rendered fallback for LCP / no-JS */
  fallback?: string;
};

export function HeroTagline({ fallback = HERO_ROLE_FALLBACK }: HeroTaglineProps) {
  const reduced = useReducedMotion();
  const [showTyping, setShowTyping] = React.useState(false);

  React.useEffect(() => {
    if (reduced) return;
    const useIdle = typeof requestIdleCallback !== "undefined";
    const id = useIdle
      ? requestIdleCallback(() => setShowTyping(true), { timeout: 400 })
      : window.setTimeout(() => setShowTyping(true), 120);
    return () => {
      if (useIdle) cancelIdleCallback(id as number);
      else clearTimeout(id);
    };
  }, [reduced]);

  return (
    <p className="mt-4 min-h-[2rem] font-hand text-2xl text-muted-foreground sm:text-3xl">
      {reduced || !showTyping ? (
        <span>{fallback}</span>
      ) : (
        <TypingText
          phrases={[...HERO_ROLE_PHRASES]}
          typingSpeed={90}
          deletingSpeed={45}
          pauseDuration={2200}
        />
      )}
    </p>
  );
}
