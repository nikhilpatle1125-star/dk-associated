'use client';

import { useEffect, useRef, useState } from 'react';

// Counts up numbers like "1,200+" or "15+" when scrolled into view. Text like "24/7 Guidance" is shown as is.
export default function CountUp({ value }) {
  const text = String(value || '');
  const match = text.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const ref = useRef(null);
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!match) return;
    if (/\d\s*\/\s*\d/.test(text)) return; // e.g. 24/7
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr.replace(/,/g, ''), 10);
    if (!Number.isFinite(target) || target === 0) return;
    const useCommas = numStr.includes(',');
    const format = (n) => (useCommas ? n.toLocaleString('en-IN') : String(n));

    setShown(`${prefix}0${suffix}`);
    let raf;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(`${prefix}${format(Math.round(target * eased))}${suffix}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span ref={ref}>{shown}</span>;
}
