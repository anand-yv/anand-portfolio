"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/lib/chat-context";

export function ContactChatCta() {
  const { openChat } = useChat();

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={openChat}
      className="w-full gap-2 border-border hover:border-brand/50 hover:bg-brand-muted sm:w-auto"
    >
      <MessageCircle className="size-4" aria-hidden />
      Ask the portfolio assistant
    </Button>
  );
}
