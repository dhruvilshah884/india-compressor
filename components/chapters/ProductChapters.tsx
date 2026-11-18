'use client';

import { useEffect, useRef } from 'react';
import { useScrollProgress } from '../useScrollProgress';
import { Turntable, ProductCard, UsedIn, DragHint, Counter, MobileProgress } from './ProductStage';
import { CATALOG, catalogIndex } from '@/lib/products';

// rail chapters → the first product of each chapter
const CHAPTER_AT: [string, string, string][] = [
  ['reciprocating', 'single-stage-air-compressor', 'Reciprocating'],
  ['duplex-pet', 'duplex-air-compressor', 'Duplex & PET'],
  ['screw', 'screw-air-compressor', 'Screw'],
  ['dryers', 'refrigerated-air-dryer', 'Dryers & chillers'],
  ['receivers', 'air-receiver-tank', 'Receiver tanks'],
  ['vacuum', 'vacuum-pump', 'Vacuum pumps'],
  ['spares', 'air-compressor-parts', 'Spares'],
];
const PER = 85; // vh of scroll per product

/** Chapters 04–10: scroll walks the whole range on one turntable, one product at a time (concept image 04). */
export default function ProductChapters() {
  const total = CATALOG.length;
  const { sectionRef, progress, step } = useScrollProgress(total);
  const p = CATALOG[step];
  const next = CATALOG[step + 1];
  const bar = useRef<HTMLElement>(null), mbar = useRef<HTMLElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const f = progress.current * total; const local = Math.min(1, Math.max(0, f - Math.min(total - 1, Math.floor(f))));
      if (bar.current) bar.current.style.width = `${local * 100}%`;
      if (mbar.current) mbar.current.style.width = `${(f / total) * 100}%`;
    };
    tick(); return () => cancelAnimationFrame(raf);
  }, [progress, total]);
  return (
    <section ref={sectionRef} className="relative" style={{ height: `${total * PER}vh` }}>
      {CHAPTER_AT.map(([id, slug]) => (
        <div key={id} id={id} className="pointer-events-none absolute left-0 h-px w-px" style={{ top: `${(catalogIndex(slug) * (total * PER - 100)) / total + 1}vh` }} />
      ))}
      <div className="bg-product sticky top-0 h-[100svh] overflow-hidden">
        <Turntable model={p.model} className="absolute inset-0" />
        <MobileProgress index={step} total={total} label={p.short} fill={mbar} />
        <div className="wrap pointer-events-none relative z-10 flex h-full flex-col justify-end pb-24 md:justify-start md:pb-0 md:pt-[126px]">
          <ProductCard key={p.slug} product={p} index={step} total={total} />
        </div>
        <div className="absolute inset-x-0 bottom-[34px] z-10 hidden md:block">
          <div className="wrap flex items-center justify-between gap-6">
            <Counter index={step} total={total} next={next?.name} fill={bar} />
            <UsedIn product={p} />
            <DragHint />
          </div>
        </div>
      </div>
    </section>
  );
}
