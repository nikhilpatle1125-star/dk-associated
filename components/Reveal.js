'use client';

import { useEffect, useRef } from 'react';

const VARIANT = { up: '', left: 'rv-left', right: 'rv-right', zoom: 'rv-zoom' };

// Fades and slides content in when it scrolls into view.
// Content stays fully visible if JavaScript is off or the person prefers reduced motion.
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div', variant = 'up' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return; // already on screen

    el.classList.add('reveal-pre');
    if (VARIANT[variant]) el.classList.add(VARIANT[variant]);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variant]);

  return (
    <Tag ref={ref} className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
