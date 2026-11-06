'use client';

import { useEffect, useState } from 'react';

export default function PropertyGallery({ photos, title }) {
  const [active, setActive] = useState(0);
  const count = photos.length;
  const go = (d) => setActive((a) => (a + d + count) % count);

  useEffect(() => {
    function onKey(e) {
      if (count < 2) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className="grid gap-2">
      <div className="relative aspect-[16/10] bg-[var(--line)] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[active]} alt={`${title} photo ${active + 1}`} className="h-full w-full object-cover" />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/40 hover:bg-black/60 text-white text-xl focus-ring">‹</button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/40 hover:bg-black/60 text-white text-xl focus-ring">›</button>
            <span className="absolute bottom-3 right-3 bg-black/55 text-white text-xs px-2.5 py-1">{active + 1} / {count}</span>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {photos.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`aspect-square overflow-hidden focus-ring border-2 ${i === active ? 'border-[var(--forest)]' : 'border-transparent opacity-80 hover:opacity-100'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
