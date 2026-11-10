"use client";

import * as React from "react";

type Point = { x: number; y: number; t: number };

const TRAIL_LIFE_MS = 480;
const INTERACTIVE =
  '[data-cursor], a[href], button, [role="button"], [role="slider"], summary, label, [role="option"]';
const NATIVE = "input, textarea, select, object, iframe, embed";

/** Marks the page so CSS hides the native cursor. Module-level because it writes to the document. */
function setFx(value: "on" | "off" | "paused" | null) {
  const el = document.documentElement;
  if (value) el.dataset.cursorFx = value;
  else delete el.dataset.cursorFx;
}

/**
 * Cursor: a dot on the pointer, a ring that follows with a soft lag and reacts to what is under it
 * (grows over links, becomes a labelled sticker over [data-cursor] areas), and a tapered comet trail.
 *
 * Fine pointers only, skipped for reduced motion, and off when `data-cursor-fx="off"` (footer switch).
 * Text fields keep the native cursor, and so does everything while the resume dialog is open. All motion is done with direct DOM writes in
 * one requestAnimationFrame loop, so React never re-renders while the mouse moves.
 */
export function CursorFx() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const dotRef = React.useRef<HTMLDivElement | null>(null);
  const ringRef = React.useRef<HTMLDivElement | null>(null);
  const bodyRef = React.useRef<HTMLDivElement | null>(null);
  const labelRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const body = bodyRef.current;
    const label = labelRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !root || !dot || !ring || !body || !label || !ctx) return;

    const html = document.documentElement;
    if (html.dataset.cursorFx !== "off") setFx("on");

    let dpr = 1;
    let raf = 0;
    let visible = false;
    let nativeOver = false;
    let mode: "idle" | "link" | "label" = "idle";
    let pressed = false;
    let tx = -100;
    let ty = -100; // target (the real pointer)
    let rx = -100;
    let ry = -100; // ring position (lags behind)
    let points: Point[] = [];
    let ink = "#1c1b2e";
    let pop = "#f7dd3a";

    const enabled = () => html.dataset.cursorFx === "on";

    // While a modal with an embedded document (the resume PDF) is open, hand the cursor back to the
    // browser: the PDF viewer swallows mouse events, so the page cannot tell where the pointer is.
    const syncDialog = () => {
      const open = !!document.querySelector('[data-slot="dialog-content"]');
      if (open && html.dataset.cursorFx === "on") {
        setFx("paused");
        kick();
      } else if (!open && html.dataset.cursorFx === "paused") {
        setFx("on");
      }
    };
    const dialogObserver = new MutationObserver(syncDialog);
    dialogObserver.observe(document.body, { childList: true, subtree: true });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const readColors = () => {
      const cs = getComputedStyle(html);
      ink = cs.getPropertyValue("--ink").trim() || ink;
      pop = cs.getPropertyValue("--brand").trim() || pop;
    };

    /** Catmull-Rom resample: turns the raw, unevenly spaced mouse samples into an evenly spaced smooth curve. */
    const resample = (src: Point[]): Point[] => {
      const out: Point[] = [];
      const n = src.length;
      for (let i = 0; i < n - 1; i++) {
        const p0 = src[Math.max(0, i - 1)];
        const p1 = src[i];
        const p2 = src[i + 1];
        const p3 = src[Math.min(n - 1, i + 2)];
        const steps = Math.max(1, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 4));
        for (let k = 0; k < steps; k++) {
          const t = k / steps;
          const t2 = t * t;
          const t3 = t2 * t;
          const c = (a: number, b: number, c2: number, d: number) =>
            0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
          out.push({ x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y), t: p1.t + (p2.t - p1.t) * t });
        }
      }
      out.push(src[n - 1]);
      return out;
    };

    /**
     * Tapered ribbon: one smooth filled shape that is thin at the tail and fades to nothing along its
     * length (so there is no hard end), with a faint hairline edge. The canvas only ever holds the trail,
     * so the fade can be applied with a destination-in gradient mask.
     */
    const drawComet = (now: number) => {
      if (points.length < 3) return;
      const s = resample(points);
      const m = s.length;
      if (m < 4) return;

      const left: { x: number; y: number }[] = [];
      const right: { x: number; y: number }[] = [];
      for (let i = 0; i < m; i++) {
        const prev = s[Math.max(0, i - 2)];
        const next = s[Math.min(m - 1, i + 2)];
        const theta = Math.atan2(next.y - prev.y, next.x - prev.x);
        const progress = i / (m - 1);
        const age = Math.min(1, (now - s[i].t) / TRAIL_LIFE_MS);
        const half = (0.3 + 3.6 * Math.pow(progress, 1.1)) * Math.pow(1 - age, 0.6);
        left.push({ x: s[i].x + Math.sin(theta) * half, y: s[i].y - Math.cos(theta) * half });
        right.push({ x: s[i].x - Math.sin(theta) * half, y: s[i].y + Math.cos(theta) * half });
      }

      const head = s[m - 1];
      const tail = s[0];
      const headTheta = Math.atan2(head.y - s[m - 2].y, head.x - s[m - 2].x);
      const headR = Math.hypot(left[m - 1].x - right[m - 1].x, left[m - 1].y - right[m - 1].y) / 2;

      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (let i = 1; i < m; i++) ctx.lineTo(left[i].x, left[i].y);
      ctx.arc(head.x, head.y, Math.max(0.1, headR), headTheta - Math.PI / 2, headTheta + Math.PI / 2, false);
      for (let i = m - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
      ctx.closePath();

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = pop;
      ctx.fill();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // fade: transparent at the tail, mostly opaque at the head
      if (Math.hypot(head.x - tail.x, head.y - tail.y) > 1) {
        const g = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(0.55, "rgba(0,0,0,0.55)");
        g.addColorStop(1, "rgba(0,0,0,0.95)");
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.globalCompositeOperation = "source-over";
      }
    };

    const applyMode = () => {
      const size = mode === "label" ? 74 : mode === "link" ? 54 : 34;
      const scale = pressed ? 0.82 : 1;
      ring.style.width = ring.style.height = `${size}px`;
      ring.style.marginLeft = ring.style.marginTop = `${-size / 2}px`;
      body.style.transform = `scale(${scale})`;
      body.dataset.mode = mode;
      dot.style.opacity = mode === "label" ? "0" : "1";
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${mode === "link" ? 0.5 : 1})`;
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      points = points.filter((p) => now - p.t < TRAIL_LIFE_MS);
      const show = enabled() && visible && !nativeOver;
      root.style.opacity = show ? "1" : "0";

      // the ring eases toward the pointer; the dot is exactly on it
      rx += (tx - rx) * 0.2;
      ry += (ty - ry) * 0.2;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${mode === "link" ? 0.5 : 1})`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

      if (show) drawComet(now);

      const settled = Math.abs(tx - rx) < 0.3 && Math.abs(ty - ry) < 0.3;
      raf = points.length || !settled ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      const first = !visible;
      visible = true;
      tx = e.clientX;
      ty = e.clientY;
      if (first) {
        rx = tx;
        ry = ty;
      }

      const target = e.target as Element | null;
      nativeOver = !!target?.closest?.(NATIVE);
      const hit = target?.closest?.(INTERACTIVE) as HTMLElement | null;
      const text = hit?.dataset.cursor ?? "";
      const nextMode: typeof mode = text ? "label" : hit ? "link" : "idle";
      if (nextMode !== mode || (text && label.textContent !== text)) {
        mode = nextMode;
        label.textContent = text;
        applyMode();
      }

      const last = points[points.length - 1];
      if (!last || now - last.t > TRAIL_LIFE_MS) readColors(); // palette or theme may have changed
      if (!last || Math.hypot(tx - last.x, ty - last.y) >= 3) {
        if (enabled() && !nativeOver) points.push({ x: tx, y: ty, t: now });
        if (points.length > 64) points.shift();
      }
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pressed = true;
      applyMode();
    };
    const onUp = () => {
      pressed = false;
      applyMode();
    };
    const onLeave = () => {
      visible = false;
      kick();
    };

    resize();
    readColors();
    applyMode();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      dialogObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (html.dataset.cursorFx === "on" || html.dataset.cursorFx === "paused") setFx(null);
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[300] opacity-0 transition-opacity duration-150" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* ring (position is written by JS; size and look change with data-mode) */}
      <div ref={ringRef} className="absolute left-0 top-0 will-change-transform" style={{ width: 34, height: 34, marginLeft: -17, marginTop: -17 }}>
        <div
          ref={bodyRef}
          data-mode="idle"
          className="group flex size-full items-center justify-center rounded-full border-2 border-ink transition-[transform,background-color,border-color] duration-200 ease-out data-[mode=label]:border-ink data-[mode=label]:bg-brand data-[mode=link]:bg-brand-muted"
        >
          <span ref={labelRef} className="font-hand text-[1.45rem] leading-none text-brand-foreground" />
        </div>
      </div>
      {/* dot: exactly on the pointer */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-1 -mt-1 size-2 rounded-full border border-ink bg-brand will-change-transform"
      />
    </div>
  );
}
