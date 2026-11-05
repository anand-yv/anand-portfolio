import { cn } from "@/lib/utils";

const STAR =
  "50.0,2.0 59.3,15.2 74.0,8.4 75.5,24.5 91.6,26.0 84.8,40.7 98.0,50.0 84.8,59.3 91.6,74.0 75.5,75.5 74.0,91.6 59.3,84.8 50.0,98.0 40.7,84.8 26.0,91.6 24.5,75.5 8.4,74.0 15.2,59.3 2.0,50.0 15.2,40.7 8.4,26.0 24.5,24.5 26.0,8.4 40.7,15.2";

/**
 * Comic "sound effect" sticker (starburst + lettering). Decorative.
 * `on="load"` pops in once; `on="hover"` pops when the nearest `.group` is hovered.
 */
export function Sfx({
  children,
  on = "load",
  delay = 1.4,
  className,
}: {
  children: React.ReactNode;
  on?: "load" | "hover";
  delay?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      style={on === "load" ? { animationDelay: `${delay}s` } : undefined}
      className={cn(
        "pointer-events-none absolute z-10 flex items-center justify-center",
        on === "load"
          ? "sfx-pop"
          : "scale-50 -rotate-[24deg] opacity-0 transition-all duration-200 ease-out group-hover:rotate-[8deg] group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none",
        className
      )}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full text-brand">
        <polygon points={STAR} fill="currentColor" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className="relative -rotate-6 font-hand text-base font-bold leading-none text-brand-foreground">
        {children}
      </span>
    </span>
  );
}
