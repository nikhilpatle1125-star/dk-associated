'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const statusClass = { AVAILABLE: 'badge-available', SOLD: 'badge-sold', ON_HOLD: 'badge-hold', BOOKED: 'badge-booked' };
const statusLabel = { AVAILABLE: 'Available', SOLD: 'Sold', ON_HOLD: 'On Hold', BOOKED: 'Booked' };

export default function PropertyCarousel({ items }) {
  const scroller = useRef(null);
  const [paused, setPaused] = useState(false);

  const scrollByCard = useCallback((dir) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => scrollByCard(1), 4000);
    return () => clearInterval(t);
  }, [paused, items.length, scrollByCard]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured properties"
    >
      <div className="flex justify-end gap-2 mb-4">
        <button type="button" onClick={() => scrollByCard(-1)} aria-label="Previous properties"
          className="h-11 w-11 rounded-full border border-[var(--forest)] text-[var(--forest)] hover:bg-[var(--forest)] hover:text-white transition-colors focus-ring">‹</button>
        <button type="button" onClick={() => scrollByCard(1)} aria-label="Next properties"
          className="h-11 w-11 rounded-full border border-[var(--forest)] text-[var(--forest)] hover:bg-[var(--forest)] hover:text-white transition-colors focus-ring">›</button>
      </div>

      <div ref={scroller} className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2">
        {items.map((p) => (
          <Link
            key={p.id}
            data-card
            href={`/properties/${p.slug}`}
            className="group snap-start shrink-0 w-[86%] sm:w-[46%] lg:w-[31.6%] bg-white border border-[var(--line)] overflow-hidden card-lift focus-ring"
          >
            <div className="relative aspect-[4/3] bg-[var(--line)] overflow-hidden">
              {p.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo} alt={p.title} loading="lazy" className="zoom-img h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[var(--ink)]/40 text-sm">No photo yet</div>
              )}
              <span className={`badge absolute top-3 left-3 ${statusClass[p.status] || 'badge-available'}`}>
                {statusLabel[p.status] || p.status}
              </span>
              <span className="absolute top-3 right-3 bg-white/90 text-[var(--forest)] text-xs font-semibold px-2.5 py-1">
                {p.type === 'PLOT' ? 'Plot' : 'Flat'}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl text-[var(--forest)] leading-snug">{p.title}</h3>
              <p className="text-sm text-[var(--ink)]/70 mt-1 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--clay)]" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
                {p.city}
              </p>
              <div className="flex items-baseline justify-between mt-4 pt-4 border-t border-[var(--line)]">
                <span className="font-semibold text-[var(--forest)]">{p.price}</span>
                <span className="text-sm text-[var(--ink)]/65">{p.area}</span>
              </div>
              <span className="arrow-link mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--clay)]">
                View details <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
