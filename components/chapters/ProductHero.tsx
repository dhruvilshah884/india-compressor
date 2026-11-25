'use client';

import { Turntable, ProductCard, UsedIn, DragHint, Counter, MobileProgress } from './ProductStage';
import { ThumbStage, ModelThumb } from '../three/ThumbStage';
import { useMinWidth } from '../useMinWidth';
import { CATALOG, catalogIndex, bySlug } from '@/lib/products';

/** Product page hero: the single-product version of the product chapter (concept image 04). Phones get a simple stacked version. */
export default function ProductHero({ slug }: { slug: string }) {
  const desktop = useMinWidth(768);
  const p = bySlug(slug)!;
  const i = catalogIndex(slug), total = CATALOG.length;
  const next = CATALOG[(i + 1) % total];

  if (!desktop) {
    // phones (and the server render): model in its own box, spec card under it, nothing covering the machine
    return (
      <section className={`bg-product pb-10 pt-[92px] ${desktop === null ? 'md:hidden' : ''}`}>
        <ThumbStage>
          <div className="wrap">
            <p className="mono text-[11px] text-muted">{String(i + 1).padStart(2, '0')} / {total} · {p.short}</p>
            <div className="relative mt-3 h-[260px] rounded-[22px] border border-line bg-[radial-gradient(260px_160px_at_50%_70%,var(--stage-2),var(--bg))]">
              <ModelThumb model={p.model} className="absolute inset-0" />
            </div>
            <div className="mt-3">
              <ProductCard product={p} index={i} total={total} details={false} />
            </div>
          </div>
        </ThumbStage>
      </section>
    );
  }

  return (
    <section className="bg-product relative h-[100svh] min-h-[760px] overflow-hidden">
      <Turntable model={p.model} className="absolute inset-0" />
      <MobileProgress index={i} total={total} label={p.short} fill={(i + 1) / total} />
      <div className="wrap pointer-events-none relative z-10 flex h-full flex-col justify-end pb-24 md:justify-start md:pb-0 md:pt-[126px]">
        <ProductCard product={p} index={i} total={total} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[34px] z-10 hidden md:block">
        <div className="wrap flex items-center justify-between gap-6 [&>*]:pointer-events-auto">
          <Counter index={i} total={total} next={next.name} nextHref={`/products/${next.slug}`} fill={(i + 1) / total} />
          <UsedIn product={p} />
          <DragHint />
        </div>
      </div>
    </section>
  );
}
