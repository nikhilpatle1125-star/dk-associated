// Endless scrolling strip. Pauses on hover.
export function TextTicker({ items }) {
  const row = [...items, ...items];
  return (
    <div className="marquee overflow-hidden bg-[var(--forest-light)] text-white" aria-hidden="true">
      <div className="marquee-track fast py-3">
        {row.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap text-sm tracking-wide">
            <span className="px-8">{t}</span>
            <span className="text-[var(--clay-light)]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function PhotoStrip({ photos }) {
  const row = [...photos, ...photos];
  return (
    <div className="marquee overflow-hidden" aria-label="Photo gallery">
      <div className="marquee-track gap-4 py-2">
        {row.map((src, i) => (
          <div key={i} className="group h-52 w-72 shrink-0 overflow-hidden bg-[var(--line)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="zoom-img h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
