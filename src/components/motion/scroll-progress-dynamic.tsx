"use client";

import dynamic from "next/dynamic";

const ScrollProgress = dynamic(
  () =>
    import("@/components/motion/scroll-progress").then((m) => ({
      default: m.ScrollProgress,
    })),
  { ssr: false }
);

export function ScrollProgressDynamic() {
  return <ScrollProgress />;
}
