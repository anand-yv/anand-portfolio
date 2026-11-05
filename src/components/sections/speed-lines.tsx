import { cn } from "@/lib/utils";

const COUNT = 56;

/** Radiating manga speed lines. Deterministic (no randomness) so SSR and client match. */
export function SpeedLines({ className }: { className?: string }) {
  const lines = Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2 + (((i * 7919) % 13) / 13) * 0.05;
    const inner = 14 + ((i * 37) % 9);
    const outer = 33 + ((i * 53) % 16);
    return {
      x1: (Math.cos(angle) * inner).toFixed(2),
      y1: (Math.sin(angle) * inner).toFixed(2),
      x2: (Math.cos(angle) * outer).toFixed(2),
      y2: (Math.sin(angle) * outer).toFixed(2),
      w: (0.25 + ((i * 13) % 4) * 0.14).toFixed(2),
    };
  });

  return (
    <svg viewBox="-50 -50 100 100" className={cn("speed-lines", className)} aria-hidden>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="currentColor" strokeWidth={l.w} strokeLinecap="round" />
      ))}
    </svg>
  );
}
