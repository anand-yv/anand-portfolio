/** Full-bleed hero background — fades at edges, no hard box. */
export function HeroAtmosphere() {
  return (
    <div className="hero-atmosphere pointer-events-none absolute inset-0 z-0" aria-hidden>
      <div className="hero-atmosphere__glow hero-atmosphere__glow--primary" />
      <div className="hero-atmosphere__glow hero-atmosphere__glow--secondary" />
      <div className="hero-atmosphere__dots" />
      <div className="hero-atmosphere__noise" />
    </div>
  );
}
