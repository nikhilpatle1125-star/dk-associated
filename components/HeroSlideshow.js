'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const INTERVAL = 5500;

export default function HeroSlideshow({ slides, children }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef(null);
  const count = slides.length;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused || reduced) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, count, paused, reduced, go]);

  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  }

  const current = slides[index];
  const hasCaption = current && (current.title || current.subtitle);

  return (
    <section
      className="relative border-b border-[var(--line)] overflow-hidden bg-[var(--forest)]"
      aria-roledescription="carousel"
      aria-label="Featured photos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.imageUrl}
            alt={s.title || ''}
            className="h-full w-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(18,53,36,0.70), rgba(18,53,36,0.85))' }}
        aria-hidden="true"
      />

      <div className="relative">{children}</div>

      {hasCaption && (
        <div className="relative container-page pb-14 -mt-8 text-white/90 text-sm" aria-live="polite">
          {current.title && <span className="font-semibold">{current.title}</span>}
          {current.title && current.subtitle && <span className="mx-2">·</span>}
          {current.subtitle && <span>{current.subtitle}</span>}
          {current.linkUrl && (
            current.linkUrl.startsWith('/') ? (
              <Link href={current.linkUrl} className="ml-3 underline underline-offset-4 focus-ring">Learn more</Link>
            ) : (
              <a href={current.linkUrl} target="_blank" rel="noopener noreferrer" className="ml-3 underline underline-offset-4 focus-ring">Learn more</a>
            )
          )}
        </div>
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center bg-black/35 hover:bg-black/55 text-white text-xl focus-ring"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center bg-black/35 hover:bg-black/55 text-white text-xl focus-ring"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all focus-ring ${i === index ? 'w-7 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
