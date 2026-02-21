"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg",
        "animate-in slide-in-from-bottom-2 fade-in-0"
      )}
    >
      <p className="text-sm text-foreground">{message}</p>
      <button
        onClick={onClose}
        className="rounded-xs opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Close"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

