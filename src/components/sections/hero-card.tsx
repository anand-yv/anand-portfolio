"use client";

import * as React from "react";
import { Play, Loader2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function HeroCard() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [showResponse, setShowResponse] = React.useState(true);
  const [showProcessing, setShowProcessing] = React.useState(false);
  const [latency, setLatency] = React.useState(84);
  const [highlightRequest, setHighlightRequest] = React.useState(false);
  const [animateCheckmark, setAnimateCheckmark] = React.useState(false);
  const [pulseTrace, setPulseTrace] = React.useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setShowProcessing(false);
    setHighlightRequest(false);
    setAnimateCheckmark(false);
    setPulseTrace(false);

    setHighlightRequest(true);
    setTimeout(() => setHighlightRequest(false), 400);

    setShowResponse(false);

    setTimeout(() => {
      setShowProcessing(true);
    }, 200);

    setTimeout(() => {
      setShowProcessing(false);
      const newLatency = Math.floor(70 + Math.random() * 50);
      setLatency(newLatency);
      setShowResponse(true);
      setAnimateCheckmark(true);

      setTimeout(() => {
        setPulseTrace(true);
        setTimeout(() => setPulseTrace(false), 400);
      }, 200);
    }, 600);

    setTimeout(() => {
      setIsRunning(false);
      setAnimateCheckmark(false);
    }, 1500);
  };

  return (
    <Reveal delayMs={180}>
      <div className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/15 via-transparent to-transparent blur-2xl opacity-60 dark:opacity-35" />
        <Card className="rounded-3xl border bg-card/40 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500/70" />
                <span className="size-2.5 rounded-full bg-yellow-500/70" />
                <span className="size-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                system.log
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-floaty motion-reduce:animate-none">
              <div className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleRun}
                    disabled={isRunning}
                    className="h-7 px-3 rounded-md text-xs font-medium shadow-sm"
                    aria-label="Run API demo"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                        <span className="hidden sm:inline">Running</span>
                        <span className="sm:hidden">Run</span>
                      </>
                    ) : (
                      <>
                        <Play className="size-3.5 mr-1.5" />
                        <span>Run</span>
                      </>
                    )}
                  </Button>
                </div>

                <pre className="overflow-x-auto rounded-2xl border bg-background/60 p-4 pr-24 sm:pr-20 pb-4 text-[12px] leading-5 text-muted-foreground cursor-text">
                  <code className="whitespace-pre">
                    <span className={highlightRequest ? "api-request-highlight" : ""}>
                      {`$ curl -X POST /api/bookings \\
  -H "Authorization: Bearer <token>" \\
  -d '{ "flightId": "AI-203", "seats": 2 }'
`}
                    </span>
                    <span className="api-output">
                      {showProcessing ? (
                        <span className="api-loading">
                          <div className="flex items-center gap-2 text-muted-foreground/60">
                            <Loader2 className="size-3 animate-spin" />
                            <span>processing…</span>
                          </div>
                          <div className="api-loading-placeholder" aria-hidden="true">
                            {`✓ 201 Created
{
  "bookingId": "BK-7F3A",
  "status": "CONFIRMED",
  "payment": "CAPTURED",
  "latencyMs": 84
}

trace: gateway → auth → booking → payments → notifications`}
                          </div>
                        </span>
                      ) : showResponse ? (
                        <span className="api-response transition-opacity duration-200">
                          <span className={animateCheckmark ? "api-checkmark" : ""}>✓</span>
                          {` 201 Created
{
  "bookingId": "BK-7F3A",
  "status": "CONFIRMED",
  "payment": "CAPTURED",
  "latencyMs": ${latency}
}

`}
                          <span className={pulseTrace ? "api-trace-pulse" : ""}>
                            trace: gateway → auth → booking → payments → notifications
                          </span>
                        </span>
                      ) : (
                        <span className="api-loading-placeholder opacity-0" aria-hidden="true">
                          {`✓ 201 Created
{
  "bookingId": "BK-7F3A",
  "status": "CONFIRMED",
  "payment": "CAPTURED",
  "latencyMs": 84
}

trace: gateway → auth → booking → payments → notifications`}
                        </span>
                      )}
                    </span>
                  </code>
                </pre>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Clean contracts, resilient services, and predictable performance.
            </p>
          </CardContent>
        </Card>
      </div>
    </Reveal>
  );
}
