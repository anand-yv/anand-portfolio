import { SpeedLines } from "@/components/sections/speed-lines";

/** Full-bleed hero background: faint graph-paper grid plus a few floating doodles. */
export function HeroAtmosphere() {
  return (
    <div className="hero-atmosphere pointer-events-none absolute inset-0 z-0" aria-hidden>
      <div className="hero-atmosphere__grid" />
      <SpeedLines className="absolute -left-[12%] top-[2%] hidden h-[620px] w-[620px] sm:block" />
      <div className="halftone absolute -right-6 bottom-0 hidden h-60 w-96 text-link/30 lg:block" />

      <svg
        className="doodle-spin absolute left-[44%] top-[12%] hidden size-10 text-link/70 lg:block"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M20 4 V36 M4 20 H36 M9 9 L31 31 M31 9 L9 31" />
      </svg>

    </div>
  );
}
