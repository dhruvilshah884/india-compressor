'use client';

import { Turntable, ProductCard, UsedIn, DragHint, Counter, MobileProgress } from './ProductStage';
import { CATALOG, catalogIndex, bySlug } from '@/lib/products';

/** Product page hero: the single-product version of the product chapter (concept image 04). */
export default function ProductHero({ slug }: { slug: string }) {
  const p = bySlug(slug)!;
  const i = catalogIndex(slug), total = CATALOG.length;
  const next = CATALOG[(i + 1) % total];
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
