'use client';

import { useEffect, useState } from 'react';

export default function ClientThoughts({ quotes }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || quotes.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % quotes.length), 5000);
    return () => clearInterval(t);
  }, [paused, quotes.length]);

  return (
    <section
      className="bg-[var(--forest)] text-white relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Our thoughts"
    >
      <div className="absolute -top-10 left-6 font-display text-[200px] leading-none text-white/5 select-none" aria-hidden="true">
        “
      </div>
      <div className="container-page py-16 md:py-24 text-center relative">
        <p className="uppercase tracking-wide text-xs text-[var(--clay-light)] font-semibold mb-6">Our belief</p>
        <div className="min-h-[9rem] md:min-h-[7rem] flex items-center justify-center" aria-live="polite">
          <p key={i} className="font-display text-2xl md:text-4xl leading-snug max-w-3xl fade-up">
            {quotes[i]}
          </p>
        </div>
        {quotes.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Show thought ${idx + 1}`}
                aria-current={idx === i}
                className={`h-2 rounded-full transition-all focus-ring ${idx === i ? 'w-7 bg-[var(--clay-light)]' : 'w-2 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
