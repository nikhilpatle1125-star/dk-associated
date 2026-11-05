'use client';

import { useState } from 'react';

export default function PropertyGallery({ photos, title }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-2">
      <div className="aspect-[16/10] bg-[var(--line)] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[active]} alt={`${title} photo ${active + 1}`} className="h-full w-full object-cover" />
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
