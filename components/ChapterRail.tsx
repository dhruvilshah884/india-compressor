'use client';

import { useEffect, useState } from 'react';
import { CHAPTERS } from '@/lib/site';

/** Right-side chapter list on the home page: current chapter = red bar, passed chapters = cyan dots. */
export default function ChapterRail() {
  const [on, setOn] = useState(0);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const mid = window.innerHeight * 0.15;
      let idx = 0;
      CHAPTERS.forEach((c, i) => { const el = document.getElementById(c.id); if (el && el.getBoundingClientRect().top <= mid) idx = i; });
      setOn((p) => (p === idx ? p : idx));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);
  const go = (id: string) => {
    const el = document.getElementById(id); if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.4 }); else el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav aria-label="Chapters" className={`fixed right-[30px] top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-[9px] transition-opacity duration-300 xl:flex ${on === CHAPTERS.length - 1 ? 'pointer-events-none opacity-0' : ''}`}>
      {CHAPTERS.map((c, i) => (
        <button key={c.id} onClick={() => go(c.id)}
          className={`group flex items-center gap-2.5 text-[11.5px] transition-colors ${i === on ? 'font-semibold text-ink' : 'font-medium text-ink/40 hover:text-ink/80'}`}>
          {c.label}
          <i className={`block h-1.5 rounded-full transition-all duration-300 ${i === on ? 'w-[22px] bg-red' : i < on ? 'w-1.5 bg-cyan/70' : 'w-1.5 bg-ink/25'}`} />
        </button>
      ))}
    </nav>
  );
}
