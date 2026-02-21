"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  phrases: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypingText({
  phrases,
  className,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypingTextProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = React.useState(0);
  const [displayedText, setDisplayedText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing
      if (displayedText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing, pause then start deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [displayedText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  // Find longest phrase for fixed width
  const longestPhrase = React.useMemo(
    () => phrases.reduce((a, b) => (a.length > b.length ? a : b)),
    [phrases]
  );

  return (
    <span className={cn("inline-block", className)} style={{ minWidth: `${longestPhrase.length}ch` }}>
      <span className="typing-text">{displayedText}</span>
      <span className="typing-cursor">|</span>
    </span>
  );
}

