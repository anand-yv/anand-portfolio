import * as React from "react";

/**
 * Placeholder artwork for projects without a real screenshot. Drawn with CSS variables, so it follows
 * the active colour palette (the old standalone SVG files had fixed pastel colours).
 * Replace by setting `imageUrl` on a project to a real screenshot.
 */
export type ProjectArtKind = "flight" | "video" | "trend" | "health";

const INK = "#1c1b2e";
const PAPER = "#fffdf6";
const pop: React.CSSProperties = { fill: "var(--pop)" };

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 640 400"
      className="size-full"
      fill="none"
      stroke={INK}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="640" height="400" style={pop} stroke="none" />
      <rect x="24" y="24" width="592" height="352" rx="12" fill={PAPER} />
      <path d="M24 66 H616" />
      <circle cx="52" cy="45" r="6" style={pop} />
      <circle cx="74" cy="45" r="6" style={pop} />
      <circle cx="96" cy="45" r="6" style={pop} />
      <rect x="130" y="35" width="300" height="20" rx="8" strokeDasharray="6 6" />
      {children}
    </svg>
  );
}

const ART: Record<ProjectArtKind, () => React.ReactElement> = {
  flight: () => (
    <Frame>
      <rect x="52" y="92" width="360" height="148" rx="10" style={pop} />
      <path d="M72 120 H220 M72 146 H170" strokeWidth="4" />
      <path d="M250 190 C 300 120, 360 120, 392 160" strokeDasharray="7 8" />
      <path d="M376 146 L394 160 L372 168 Z" fill={PAPER} />
      <circle cx="82" cy="206" r="8" />
      <circle cx="388" cy="206" r="8" fill={PAPER} />
      <path d="M82 206 H160" strokeDasharray="3 6" />
      <rect x="440" y="92" width="152" height="248" rx="10" />
      <g fill={PAPER}>
        {[112, 150, 188].flatMap((y, r) =>
          [458, 494, 530].map((x, c) => (
            <rect key={`${r}-${c}`} x={x} y={y} width="26" height="26" rx="5" style={(r + c) % 4 === 1 ? pop : undefined} />
          ))
        )}
      </g>
      <rect x="458" y="296" width="116" height="30" rx="8" style={pop} />
      <path d="M52 262 H412 M52 292 H350 M52 322 H300" />
    </Frame>
  ),
  video: () => (
    <Frame>
      <rect x="52" y="92" width="360" height="216" rx="10" style={pop} />
      <circle cx="232" cy="200" r="42" fill={PAPER} />
      <path d="M220 178 L254 200 L220 222 Z" fill={INK} />
      <path d="M72 286 H392" strokeWidth="4" />
      <path d="M72 286 H220" strokeWidth="6" />
      <circle cx="220" cy="286" r="7" fill={PAPER} />
      <rect x="440" y="92" width="152" height="64" rx="8" />
      <rect x="440" y="170" width="152" height="64" rx="8" style={pop} />
      <rect x="440" y="248" width="152" height="64" rx="8" />
      <path d="M52 330 H300 M52 354 H220" />
    </Frame>
  ),
  trend: () => (
    <Frame>
      <rect x="52" y="92" width="330" height="248" rx="10" />
      <g style={pop}>
        <rect x="84" y="250" width="34" height="70" />
        <rect x="134" y="210" width="34" height="110" />
        <rect x="184" y="236" width="34" height="84" />
        <rect x="234" y="170" width="34" height="150" />
        <rect x="284" y="196" width="34" height="124" />
      </g>
      <path d="M84 230 L152 190 L202 214 L252 150 L318 176" strokeWidth="4" />
      <circle cx="252" cy="150" r="7" fill={PAPER} />
      <rect x="410" y="92" width="182" height="40" rx="8" style={pop} />
      <path d="M426 112 H520" />
      <rect x="410" y="146" width="182" height="40" rx="8" />
      <path d="M426 166 H500" />
      <rect x="410" y="200" width="182" height="40" rx="8" />
      <path d="M426 220 H540" />
      <rect x="410" y="254" width="182" height="40" rx="8" />
      <path d="M426 274 H480" />
      <rect x="410" y="308" width="182" height="32" rx="8" style={pop} />
    </Frame>
  ),
  health: () => (
    <Frame>
      <path d="M232 262 C 140 200, 168 118, 232 150 C 296 118, 324 200, 232 262 Z" style={pop} />
      <path d="M120 200 H188 L206 168 L230 238 L252 190 L268 200 H344" strokeWidth="4" />
      <rect x="404" y="92" width="188" height="48" rx="12" style={pop} />
      <path d="M424 116 H540" />
      <rect x="430" y="156" width="162" height="48" rx="12" />
      <path d="M450 180 H560" />
      <rect x="404" y="220" width="188" height="48" rx="12" style={pop} />
      <path d="M424 244 H520" />
      <rect x="52" y="300" width="360" height="40" rx="10" />
      <path d="M72 320 H260" />
      <circle cx="384" cy="320" r="10" style={pop} />
    </Frame>
  ),
};

export function ProjectArt({ kind }: { kind: ProjectArtKind }) {
  return ART[kind]();
}
