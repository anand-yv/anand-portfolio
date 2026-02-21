"use client";

import { Reveal } from "@/components/motion/reveal";
import { TypingText } from "@/components/ui/typing-text";

export function HeroTagline() {
  return (
    <Reveal delayMs={90} visibleByDefault>
      <p className="mt-4 text-lg sm:text-xl text-muted-foreground">
        <TypingText
          phrases={[
            "Full-Stack Engineer",
            "Backend Engineer",
            "Frontend Engineer",
          ]}
          typingSpeed={100}
          deletingSpeed={50}
          pauseDuration={2000}
        />
      </p>
    </Reveal>
  );
}
