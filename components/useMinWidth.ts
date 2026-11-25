'use client';

import { useEffect, useState } from 'react';

/** true when the screen is at least `px` wide; null until the browser has been asked (server render, first paint) */
export function useMinWidth(px: number) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setOk(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [px]);
  return ok;
}
