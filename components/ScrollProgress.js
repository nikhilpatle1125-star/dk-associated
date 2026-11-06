'use client';

import { useEffect, useState } from 'react';

// Thin gold progress bar at the top and a back-to-top button.
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
      setShowTop(h.scrollTop > 700);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none" aria-hidden="true">
        <div className="h-full bg-[var(--clay)]" style={{ width: `${pct}%` }} />
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-5 left-5 z-40 h-11 w-11 rounded-full bg-white text-[var(--forest)] border border-[var(--line)] shadow-md flex items-center justify-center transition-all duration-300 hover:bg-[var(--forest)] hover:text-white focus-ring ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        ↑
      </button>
    </>
  );
}
