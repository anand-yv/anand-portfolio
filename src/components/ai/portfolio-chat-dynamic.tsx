"use client";

import dynamic from "next/dynamic";

const PortfolioChat = dynamic(
  () =>
    import("@/components/ai/portfolio-chat").then((m) => ({
      default: m.PortfolioChat,
    })),
  { ssr: false }
);

export function PortfolioChatDynamic() {
  return <PortfolioChat />;
}
