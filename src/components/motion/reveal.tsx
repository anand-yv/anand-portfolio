"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  once?: boolean;
  /** Above-the-fold content: skip IO and show immediately for better LCP. */
  visibleByDefault?: boolean;
};

export function Reveal({
  children,
  className,
  delayMs = 0,
  once = true,
  visibleByDefault = false,
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(visibleByDefault);

  React.useEffect(() => {
    if (visibleByDefault) return;
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root: null, threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, visibleByDefault]);

  return (
    <div
      ref={ref}
      data-inview={inView}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        "will-change-transform will-change-opacity",
        "transition-[opacity,transform] duration-200 ease-out",
        "opacity-0 translate-y-3",
        "data-[inview=true]:opacity-100 data-[inview=true]:translate-y-0",
        className
      )}
    >
      {children}
    </div>
  );
}


