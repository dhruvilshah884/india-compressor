import Link from 'next/link';
import { INDUSTRIES } from '@/lib/site';
import { bySlug } from '@/lib/products';

const ICONS: Record<string, React.ReactNode> = {
  textiles: <><path d="M6 26V10l6 4V10l6 4V10l8 5v11z" /><path d="M6 26h20" /></>,
  chemicals: <><path d="M12 4h8M14 4v8l-7 12a2 2 0 0 0 2 3h14a2 2 0 0 0 2-3l-7-12V4" /><path d="M10 20h12" /></>,
  pharma: <><rect x="5" y="12" width="22" height="9" rx="4.5" transform="rotate(-35 16 16)" /><path d="M12 9l9 13" /></>,
  paint: <><path d="M7 6h14v7H7zM21 9h4v7H14v4" /><rect x="12" y="20" width="4" height="7" rx="1" /></>,
  pet: <><path d="M13 3h6v4l2 3v17a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V10l2-3z" /><path d="M11 15h10" /></>,
  dairy: <><path d="M11 3h10v5l3 5v14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V13l3-5z" /><path d="M8 17h16" /></>,
  auto: <><path d="M4 21v-4l4-6h14l5 6h1v4z" /><circle cx="10" cy="22" r="3" /><circle cx="22" cy="22" r="3" /></>,
  food: <><path d="M8 14h16l-2 14H10z" /><path d="M12 14V8a4 4 0 0 1 8 0v6" /></>,
  medical: <path d="M13 5h6v8h8v6h-8v8h-6v-8H5v-6h8z" />,
};

/** 11 · Industries — which machines each industry buys. */
export default function IndustriesChapter() {
  return (
    <section id="industries" className="scroll-mt-20 bg-bg py-24 md:py-32">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="reveal">
            <p className="mono text-blue">11 · Industries</p>
            <h2 className="font-display mt-3 text-[34px] font-bold leading-none md:text-[50px]">Built for {INDUSTRIES.length} industries. <span className="text-red">The right air for each.</span></h2>
          </div>
          <p className="reveal max-w-[420px] text-[15px] leading-[1.6] text-ink-2">From air-jet looms to PET bottle blowing and hospital air — we match the compressor and air treatment to what your process needs.</p>
        </div>
        <div className="mt-12 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => (
            <div key={ind.key} className="reveal group rounded-[22px] border border-line bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,.1)]" data-delay={(i % 3) * 0.06}>
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef2fb] text-blue transition group-hover:bg-red group-hover:text-white">
                  <svg viewBox="0 0 32 32" className="h-6 w-6 fill-none stroke-current" strokeWidth={1.7} strokeLinejoin="round">{ICONS[ind.key]}</svg>
                </span>
                <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-display mt-5 text-[21px] font-bold">{ind.name}</h3>
              <p className="mt-1.5 text-[14.5px] leading-[1.55] text-ink-2">{ind.use}</p>
              <div className="mt-5 border-t border-line pt-4">
                <p className="mono mb-2.5 text-[10px] text-muted">Recommended machines</p>
                <div className="flex flex-wrap gap-1.5">
                  {ind.products.map((s) => {
                    const p = bySlug(s);
                    return p ? <Link key={s} href={`/products/${s}`} className="rounded-full border border-line bg-bg px-3 py-1 text-[12.5px] font-medium text-ink-2 transition hover:border-red/40 hover:text-red">{p.short}</Link> : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
