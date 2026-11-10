"use client";

import * as React from "react";
import { MousePointer2 } from "lucide-react";

/** Footer switch for the custom cursor. Hidden on touch devices, where the cursor never appears. */
export function CursorToggle() {
  const [on, setOn] = React.useState(true);

  React.useEffect(() => {
    setOn(document.documentElement.dataset.cursorFx !== "off");
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    document.documentElement.dataset.cursorFx = next ? "on" : "off";
    try {
      localStorage.setItem("cursor-fx", next ? "on" : "off");
    } catch {
      // storage unavailable: the choice just won't persist
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className="sketch-chip hidden items-center gap-1.5 bg-card px-2.5 py-1 font-hand text-lg leading-none text-foreground transition-colors hover:bg-brand-muted [@media(hover:hover)_and_(pointer:fine)]:inline-flex"
    >
      <MousePointer2 className="size-3.5" aria-hidden />
      custom cursor: {on ? "on" : "off"}
    </button>
  );
}
