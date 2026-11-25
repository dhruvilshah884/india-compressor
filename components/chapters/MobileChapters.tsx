'use client';

import Link from 'next/link';
import { ThumbStage, ModelThumb } from '../three/ThumbStage';
import { ProductCard } from './ProductStage';
import { LABELS } from './InsideChapter';
import { CATALOG } from '@/lib/products';

/**
 * Phones: the scroll-pinned 3D chapters (inside, plant floor, product turntable) become plain sections
 * that scroll normally: one 3D compressor with its parts listed, and a swipeable row of products.
 * All 3D models share one WebGL canvas (ThumbStage).
 */
export default function MobileChapters() {
  return (
    <ThumbStage>
      <MobileInside />
      <MobileRange />
    </ThumbStage>
  );
}

function MobileInside() {
  return (
    <section className="bg-inside py-14">
      <div className="wrap">
        <p className="mono text-[10.5px] text-blue">02 · Inside a Parth</p>
        <h2 className="font-display mt-2.5 text-[30px] font-bold leading-[1.05]">
          Built from cast iron, <span className="text-red">not compromises.</span>
        </h2>
        <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">Every part that matters, so you know exactly what you are paying for.</p>

        <div className="relative mt-6 h-[230px] rounded-[22px] border border-line bg-[radial-gradient(240px_150px_at_50%_70%,var(--stage-2),var(--bg))]">
          <ModelThumb model="two" className="absolute inset-0" />
        </div>

        <ol className="mt-5 grid gap-2.5">
          {LABELS.map(([title, sub, n]) => (
            <li key={n} className="panel flex items-center gap-3.5 px-4 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red font-mono text-[11px] font-semibold text-white">{n}</span>
              <span>
                <b className="block text-[15px]">{title}</b>
                <span className="text-[13px] text-muted">{sub}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function MobileRange() {
  const total = CATALOG.length;
  return (
    <section className="bg-product py-14">
      <div className="wrap">
        <p className="mono text-[10.5px] text-blue">03 · The range</p>
        <h2 className="font-display mt-2.5 text-[30px] font-bold leading-[1.05]">
          {total} machines, <span className="text-red">one air line.</span>
        </h2>
        <p className="mt-3 text-[15px] leading-[1.6] text-ink-2">Swipe to see every machine. Tap a size to see its specs.</p>
      </div>

      <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATALOG.map((p, i) => (
          <div key={p.slug} className="flex w-[86%] max-w-[380px] shrink-0 snap-center flex-col gap-3">
            <div className="relative h-[190px] rounded-[22px] border border-line bg-[radial-gradient(220px_130px_at_50%_70%,var(--stage-2),var(--bg))]">
              <ModelThumb model={p.model} className="absolute inset-0" />
              <span className="absolute left-3 top-3 rounded-md border border-line bg-bg-2 px-[7px] py-1 font-mono text-[10px] font-semibold tracking-[0.08em] text-ink-2">
                {String(i + 1).padStart(2, '0')} / {total}
              </span>
            </div>
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>

      <div className="wrap mt-5">
        <Link href="/products" className="btn btn-red w-full">See all products →</Link>
      </div>
    </section>
  );
}
