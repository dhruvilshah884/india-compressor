'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

/**
 * Progress (0..1) of scrolling through a tall section whose inner stage is `position: sticky`.
 * Returns a ref (read every frame by Three.js scenes, no re-render) and a stepped state for the UI.
 */
export function useScrollProgress(steps = 1) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => {
        progress.current = s.progress;
        const i = Math.min(steps - 1, Math.floor(s.progress * steps * 0.9999));
        setStep((prev) => (prev === i ? prev : i));
      },
    });
    return () => st.kill();
  }, [steps]);
  return { sectionRef, progress, step };
}
