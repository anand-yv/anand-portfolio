const ITEMS = [
  "Java",
  "Spring Boot",
  "React",
  "TypeScript",
  "PostgreSQL",
  "MongoDB",
  "REST APIs",
  "Microservices",
  "Docker",
  "JWT Auth",
];

/** Rotated ink strip with a slowly scrolling stack list. Decorative. */
export function Marquee() {
  const track = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden py-6 sm:py-8" aria-hidden>
      <div className="marquee -mx-4 -rotate-1 scale-x-[1.03] overflow-hidden border-y-2 border-ink bg-ink py-2 text-background">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap font-mono text-xs uppercase tracking-[0.18em] sm:text-sm">
          {track.map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              {item}
              <span className="font-hand text-2xl normal-case leading-none text-link">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
