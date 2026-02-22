"use client";

import * as React from "react";
import Link from "next/link";
import { Download, ExternalLink, X, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ResumeDialogProps {
  children: React.ReactNode;
}

const PDF_LOAD_TIMEOUT_MS = 8000;

export function ResumeDialog({ children }: ResumeDialogProps) {
  const [pdfLoaded, setPdfLoaded] = React.useState(false);
  const [pdfError, setPdfError] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeoutRef = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handlePdfLoad = React.useCallback(() => {
    clearTimeoutRef();
    setPdfError(false);
    setPdfLoaded(true);
  }, [clearTimeoutRef]);

  const handlePdfError = React.useCallback(() => {
    clearTimeoutRef();
    setPdfError(true);
    setPdfLoaded(false);
  }, [clearTimeoutRef]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) {
        setPdfLoaded(false);
        setPdfError(false);
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          setPdfError(true);
        }, PDF_LOAD_TIMEOUT_MS);
      } else {
        clearTimeoutRef();
        setPdfLoaded(false);
        setPdfError(false);
      }
    },
    [clearTimeoutRef]
  );

  React.useEffect(() => {
    return () => clearTimeoutRef();
  }, [clearTimeoutRef]);

  return (
    <Dialog onOpenChange={handleOpenChange}>
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
          <div className="w-full max-w-4xl mx-auto overflow-hidden relative">
            {/* Skeleton loader - document-style lines until PDF loads */}
            {!pdfLoaded && !pdfError && (
              <div
                className="absolute inset-0 w-full aspect-[8.5/11] rounded-lg border bg-card shadow-sm p-6 flex flex-col gap-3"
                aria-hidden
              >
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-2/3 rounded" />
                  <Skeleton className="h-3 w-1/4 rounded" />
                </div>
                <div className="flex-1 flex flex-col gap-2 pt-4">
                  {[0.95, 0.88, 0.7, 0.92, 0.65, 0.8, 0.75, 0.9, 0.6, 0.85].map(
                    (w, i) => (
                      <Skeleton
                        key={i}
                        className="h-3 rounded"
                        style={{ width: `${w * 100}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Error state - network/unavailable or timeout */}
            {pdfError && (
              <div
                className="absolute inset-0 w-full min-h-[280px] rounded-lg border border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-4 p-8 text-center"
                role="alert"
              >
                <AlertCircle className="size-12 text-destructive shrink-0" aria-hidden />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    Resume couldn’t be loaded
                  </p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    The preview may be unavailable due to connection issues or
                    your browser. You can open or download the resume instead.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button variant="default" size="sm" asChild className="rounded-lg">
                    <Link href="/resume.pdf" download>
                      <Download className="size-4 mr-2" />
                      Download
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="rounded-lg">
                    <Link
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4 mr-2" />
                      Open in new tab
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* PDF preview - responsive aspect ratio scaling */}
            <object
              data="/resume.pdf#toolbar=0&navpanes=0"
              type="application/pdf"
              className="w-full aspect-[8.5/11] rounded-lg border shadow-sm bg-white dark:bg-muted"
              style={
                pdfLoaded && !pdfError ? undefined : { visibility: "hidden" }
              }
              onLoad={() => {
                timeoutRef.current = setTimeout(handlePdfLoad, 100);
              }}
              onError={handlePdfError}
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
