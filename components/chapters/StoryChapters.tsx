'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InsideChapter from './InsideChapter';
import PlantChapter from './PlantChapter';
import ProductChapters from './ProductChapters';
import MobileChapters from './MobileChapters';
import { useMinWidth } from '../useMinWidth';

/**
 * The 3D scroll story (inside → plant floor → product turntable) on tablets and computers;
 * simple scrolling sections on phones. The phone version is also what the server renders,
 * so search engines always get the content.
 */
export default function StoryChapters() {
  const desktop = useMinWidth(768);

  // the pinned chapters change the page height after first paint: re-measure every scroll trigger below them
  useEffect(() => {
    if (desktop === null) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [desktop]);

  if (desktop) {
    return (
      <>
        <InsideChapter />
        <PlantChapter />
        <ProductChapters />
      </>
    );
  }
  return (
    <div className={desktop === null ? 'md:hidden' : undefined}>
      <MobileChapters />
    </div>
  );
}
