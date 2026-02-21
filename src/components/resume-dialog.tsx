"use client";

import * as React from "react";
import Link from "next/link";
import { Download, ExternalLink, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResumeDialogProps {
  children: React.ReactNode;
}

export function ResumeDialog({ children }: ResumeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-5xl max-h-[90vh] flex flex-col p-0 rounded-2xl border bg-card shadow-lg overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-semibold">Resume</DialogTitle>
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-lg cursor-pointer"
              >
                <Link href="/resume.pdf" download>
                  <Download className="size-4 mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-lg cursor-pointer"
              >
                <Link
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4 mr-2" />
                  <span className="hidden sm:inline">Open</span>
                </Link>
              </Button>
              <DialogClose asChild>
                <button
                  className="rounded-xs opacity-70 hover:opacity-100 transition-opacity p-2 hover:bg-accent cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </DialogClose>
            </div>
            {/* Mobile: Close button only in header */}
            <div className="md:hidden">
              <DialogClose asChild>
                <button
                  className="rounded-xs opacity-70 hover:opacity-100 transition-opacity p-2 hover:bg-accent cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        {/* Modal body - single scrollbar with custom styling, no horizontal scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-4 md:px-6 py-4 resume-modal-scroll">
          {/* PDF wrapper - centered with max width, responsive scaling */}
          <div className="w-full max-w-4xl mx-auto overflow-hidden">
            {/* PDF preview - responsive aspect ratio scaling */}
            <object
              data="/resume.pdf#toolbar=0&navpanes=0"
              type="application/pdf"
              className="w-full aspect-[8.5/11] rounded-lg border shadow-sm bg-white dark:bg-muted"
            >
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 p-6">
                <p className="text-sm text-muted-foreground">
                  Preview not available on this device
                </p>
                <Link
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline cursor-pointer hover:text-primary/80"
                >
                  Open Resume
                </Link>
              </div>
            </object>
          </div>

          {/* Mobile: Action buttons below preview */}
          <div className="md:hidden flex flex-col gap-3 mt-4">
            <Button
              variant="default"
              size="lg"
              asChild
              className="w-full rounded-lg cursor-pointer"
            >
              <Link href="/resume.pdf" download>
                <Download className="size-4 mr-2" />
                Download Resume
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full rounded-lg cursor-pointer"
            >
              <Link
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4 mr-2" />
                Open in New Tab
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
