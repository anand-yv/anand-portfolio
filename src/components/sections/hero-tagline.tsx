"use client";

import * as React from "react";
import { Reveal } from "@/components/motion/reveal";
import { TypingText } from "@/components/ui/typing-text";

const FIRST_PHRASE = "Full-Stack Engineer";
const PHRASES = [
  "Full-Stack Engineer",
  "Backend Engineer",
  "Frontend Engineer",
];

export function HeroTagline() {
  const [showTyping, setShowTyping] = React.useState(false);

  React.useEffect(() => {
    const useIdle = typeof requestIdleCallback !== "undefined";
    const id = useIdle
      ? requestIdleCallback(() => setShowTyping(true), { timeout: 400 })
      : setTimeout(() => setShowTyping(true), 100);
    return () => {
      if (useIdle) cancelIdleCallback(id as number);
      else clearTimeout(id);
    };
  }, []);

  return (
    <Reveal delayMs={90} visibleByDefault>
      <p className="mt-4 text-lg sm:text-xl text-muted-foreground">
        {showTyping ? (
          <TypingText
            phrases={PHRASES}
            typingSpeed={100}
            deletingSpeed={50}
            pauseDuration={2000}
          />
        ) : (
          <span style={{ minWidth: `${FIRST_PHRASE.length}ch` }}>
            {FIRST_PHRASE}
          </span>
        )}
      </p>
    </Reveal>
  );
}
