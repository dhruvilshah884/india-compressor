'use client';

import Link from 'next/link';
import { useState } from 'react';
import ProductCard from './ProductCard';
import { ThumbStage } from './three/ThumbStage';
import { CATALOG, GROUPS, GROUP_LABEL, type Group } from '@/lib/products';

/** Product range grid with filter chips (concept image 05). */
export default function ProductCatalog() {
  const [group, setGroup] = useState<Group | 'All'>('All');
  const list = group === 'All' ? CATALOG : CATALOG.filter((p) => p.group === group);
  const rest = (4 - (list.length % 4)) % 4; // columns left on the last row for the CTA
  return (
    <ThumbStage>
      <div className="mb-[26px] flex flex-wrap gap-2" role="tablist" aria-label="Filter products">
        <button role="tab" aria-selected={group === 'All'} className="chip" data-on={group === 'All'} onClick={() => setGroup('All')}>All {CATALOG.length}</button>
        {GROUPS.map((g) => (
          <button key={g} role="tab" aria-selected={g === group} className="chip" data-on={g === group} onClick={() => setGroup(g)}>{GROUP_LABEL[g]}</button>
        ))}
      </div>
      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => <ProductCard key={p.slug} p={p} index={CATALOG.indexOf(p)} />)}
        <div className={`flex flex-col items-start justify-between gap-5 rounded-[22px] bg-[linear-gradient(120deg,#0b1530,#1f45b8)] px-[34px] py-[30px] text-white sm:col-span-2 md:flex-row md:items-center ${rest === 3 ? 'lg:col-span-3' : rest === 2 ? 'lg:col-span-2' : rest === 1 ? 'lg:col-span-1 md:flex-col md:items-start' : 'lg:col-span-4'}`}>
          <div>
            <h3 className="font-display text-[26px] font-bold leading-[1.1] md:text-[30px]">Not sure which compressor you need?</h3>
            <p className="mt-2 text-[14.5px] text-[#c7d2fe]">Tell us your CFM, pressure and duty — our engineers size it and send a quote within 24 hours.</p>
          </div>
          <Link href="/solutions/complete-compressed-air-system#sizer" className="btn btn-red shrink-0">Size my compressor →</Link>
        </div>
      </div>
    </ThumbStage>
  );
}
