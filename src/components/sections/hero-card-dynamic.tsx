"use client";

import dynamic from "next/dynamic";

const HeroCard = dynamic(
  () =>
    import("@/components/sections/hero-card").then((m) => ({
      default: m.HeroCard,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[280px] rounded-2xl border bg-card/50 animate-pulse"
        aria-hidden
      />
    ),
  }
);

export function HeroCardDynamic() {
  return <HeroCard />;
}
