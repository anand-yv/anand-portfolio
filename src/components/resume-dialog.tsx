"use client";

import * as React from "react";
import Link from "next/link";
import { Download, ExternalLink, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { personalInfo } from "@/data/personal";

interface ResumeDialogProps {
  children: React.ReactNode;
}

const PDF_LOAD_TIMEOUT_MS = 8000;
const RESUME_URL = personalInfo.resumeUrl ?? "/resume.pdf";

const btn =
  "sketch-btn inline-flex items-center justify-center gap-2 px-3 py-1.5 font-hand text-xl leading-none text-foreground";

function Actions({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className={stacked ? "flex flex-col gap-3" : "flex items-center gap-2.5"}>
      <Link href={RESUME_URL} download className={`${btn} sketch-box--brand ${stacked ? "py-2.5" : ""}`}>
        <Download className="size-4" aria-hidden />
        {stacked ? "Download resume" : "Download"}
      </Link>
      <Link
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} bg-card ${stacked ? "py-2.5" : ""}`}
      >
        <ExternalLink className="size-4" aria-hidden />
        {stacked ? "Open in new tab" : "Open"}
      </Link>
    </div>
  );
}

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
          setPdfLoaded(true);
        }, PDF_LOAD_TIMEOUT_MS);
      } else {
        clearTimeoutRef();
        setPdfLoaded(false);
        setPdfError(false);
      }
    },
    [clearTimeoutRef]
  );

  React.useEffect(() => () => clearTimeoutRef(), [clearTimeoutRef]);

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        // sm:max-w-* is needed: DialogContent sets sm:max-w-lg, which beats a plain max-w-*.
        className="sketch-box flex max-h-[90vh] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-visible p-0 sm:max-w-4xl"
      >
        <span className="sketch-tape" aria-hidden />

        {/* header */}
        <DialogHeader className="shrink-0 border-b-2 border-dashed border-ink/25 px-5 py-3.5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3 text-left">
              <span className="sketch-box sketch-box--sm sketch-box--brand flex size-9 shrink-0 items-center justify-center font-display text-sm font-extrabold">
                AY
              </span>
              <div className="min-w-0">
                <DialogTitle className="font-display text-xl font-bold leading-none tracking-tight">Resume</DialogTitle>
                <DialogDescription className="mt-1 truncate font-hand text-lg leading-none text-link">
                  {personalInfo.name} · {personalInfo.title}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="hidden md:block">
                <Actions />
              </div>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="sketch-chip flex size-9 items-center justify-center bg-card text-foreground transition-colors hover:bg-brand-muted"
                >
                  <X className="size-4" />
                </button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        {/* body: graph-paper desk with the resume as a taped sheet */}
        <div
          className="resume-modal-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-8"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklch, var(--ink) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--ink) 7%, transparent) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div className="relative mx-auto w-full max-w-3xl">
            <span className="sketch-tape" aria-hidden />

            <div className="sketch-box relative aspect-[8.5/11] w-full overflow-hidden bg-white dark:bg-[oklch(0.94_0.008_95)]">
              {/* loading: hand-drawn placeholder lines */}
              {!pdfLoaded && !pdfError && (
                <div className="absolute inset-0 z-10 flex flex-col gap-3 bg-card p-6 sm:p-8" aria-hidden>
                  <div className="h-6 w-2/3 animate-pulse rounded bg-ink/15" />
                  <div className="h-3 w-1/4 animate-pulse rounded bg-ink/10" />
                  <div className="flex flex-1 flex-col gap-2.5 pt-4">
                    {[0.95, 0.88, 0.7, 0.92, 0.65, 0.8, 0.75, 0.9, 0.6, 0.85].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 animate-pulse rounded bg-ink/10"
                        style={{ width: `${w * 100}%`, animationDelay: `${i * 80}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-center font-hand text-xl text-muted-foreground">unrolling the resume…</p>
                </div>
              )}

              {/* error */}
              {pdfError && (
                <div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-card p-8 text-center"
                  role="alert"
                >
                  <p className="font-hand text-4xl leading-none text-link">oops!</p>
                  <div className="space-y-1">
                    <p className="font-display text-lg font-bold text-foreground">Resume couldn&apos;t be loaded</p>
                    <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                      The preview may be unavailable because of your connection or browser. You can still open or
                      download it.
                    </p>
                  </div>
                  <Actions />
                </div>
              )}

              <object
                data={`${RESUME_URL}#toolbar=0&navpanes=0`}
                type="application/pdf"
                className="size-full"
                style={pdfLoaded && !pdfError ? undefined : { visibility: "hidden" }}
                onLoad={() => {
                  timeoutRef.current = setTimeout(handlePdfLoad, 100);
                }}
                onError={handlePdfError}
              >
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="font-hand text-2xl text-muted-foreground">preview not available on this device</p>
                  <Link
                    href={RESUME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-hand text-xl text-foreground underline decoration-brand decoration-[3px] underline-offset-4"
                  >
                    open the resume
                  </Link>
                </div>
              </object>
            </div>
          </div>

          {/* mobile actions below the sheet */}
          <div className="mx-auto mt-6 max-w-3xl md:hidden">
            <Actions stacked />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
