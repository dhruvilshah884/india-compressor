import type { Metadata } from 'next';
import ProductCatalog from '@/components/ProductCatalog';
import { CATALOG } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Products — Air Compressors, Dryers, Filters & Receivers',
  description: 'Screw, two-stage, single-stage, duplex, PET, booster and oil-free air compressors; refrigerated and heatless air dryers; filters, air receivers, water chillers, vacuum pumps and genuine spares.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  return (
    <section className="pb-20 pt-28 md:pt-[130px]">
      <div className="wrap">
        <div className="mb-[26px] flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mono text-blue">Product range</p>
            <h1 className="font-display mt-3 text-[38px] font-bold leading-none md:text-[54px]">{CATALOG.length} machines. <span className="text-red">One trusted name.</span></h1>
          </div>
          <p className="max-w-[420px] text-[15px] leading-[1.6] text-ink-2">Every Parth product in one place — compressors, high-pressure PET systems, dryers, filters, chillers, receiver tanks, vacuum pumps and genuine spares.</p>
        </div>
        <ProductCatalog />
      </div>
    </section>
  );
}
