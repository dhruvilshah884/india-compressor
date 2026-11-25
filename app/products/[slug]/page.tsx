import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductHero from '@/components/chapters/ProductHero';
import SystemSection from '@/components/sections/SystemSection';
import SystemSizer from '@/components/sections/SystemSizer';
import CtaBand from '@/components/sections/CtaBand';
import ProductCard from '@/components/ProductCard';
import { ThumbStage } from '@/components/three/ThumbStage';
import { PRODUCTS, SYSTEM_STEPS, CATALOG, bySlug } from '@/lib/products';
import { SITE } from '@/lib/site';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = bySlug((await params).slug);
  if (!p) return {};
  const title = `${p.name} Manufacturer in Ahmedabad (${p.range})`;
  const description = `${p.name} (${p.range}) from Parth Air Compressor, Ahmedabad, Gujarat. ${p.description.split(/(?<=\.)\s/)[0]}`;
  return {
    title,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title, description, url: `/products/${p.slug}`, type: 'website' },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  const isScrew = p.slug === 'screw-air-compressor';
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && (x.group === p.group || (p.inSystem && x.inSystem))).slice(0, 3);
  const url = `${SITE.url}/products/${p.slug}`;
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description, url,
      image: `${url}/opengraph-image`, category: p.group,
      brand: { '@type': 'Brand', name: 'Parth' }, manufacturer: { '@id': `${SITE.url}/#organization` },
      additionalProperty: p.specs.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE.url}/products` },
        { '@type': 'ListItem', position: 3, name: p.name, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ProductHero slug={p.slug} />

      <section className="py-16 md:py-20">
        <div className="wrap grid gap-5 lg:grid-cols-3">
          <div className="card reveal p-6 md:p-8">
            <p className="mono text-blue">{p.group}</p>
            <h2 className="font-display mt-2 text-[24px] font-bold">Why this {p.short.toLowerCase()}</h2>
            <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-2">{p.description}</p>
            <ul className="mt-5 grid gap-2.5">
              {p.features.map((f) => <li key={f} className="flex items-start gap-2.5 text-[14.5px]"><span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-red" />{f}</li>)}
            </ul>
          </div>
          <div className="card reveal p-6 md:p-8">
            <h2 className="font-display text-[24px] font-bold">Specifications</h2>
            <dl className="mt-5 divide-y divide-line">
              {p.specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3 text-[14.5px]"><dt className="text-muted">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
              ))}
            </dl>
            <p className="mt-4 text-[12.5px] text-muted">Exact ratings depend on model. Ask for the datasheet of the size you need.</p>
          </div>
          <div className="card reveal p-6 md:p-8" data-delay="0.08">
            <h2 className="font-display text-[24px] font-bold">Where it&apos;s used</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.applications.map((a) => <span key={a} className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-[14px]">{a}</span>)}
            </div>
          </div>
        </div>
      </section>

      {isScrew && (
        <>
          <SystemSection
            id="air-system"
            eyebrow="Complete compressed air solution"
            title={<>Need clean, dry air?<br className="hidden md:block" /> Add the complete system.</>}
            intro={<>Air leaving any compressor is hot and saturated with water and oil vapour. For paint shops, pharma, food, textiles and instruments, pair this screw compressor with a <b>receiver</b>, <b>pre filter</b>, <b>refrigerated dryer</b> and <b>after filter</b>. Scroll to follow the air.</>}
          />
          <section className="py-20 md:py-24">
            <div className="wrap">
              <div className="reveal mb-10 max-w-2xl">
                <p className="eyebrow">Size your system</p>
                <h2 className="font-display mt-3 text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.05]">One order. Every part matched.</h2>
              </div>
              <div className="reveal"><SystemSizer /></div>
            </div>
          </section>
        </>
      )}

      {related.length > 0 && (
        <section className="py-16">
          <ThumbStage>
            <div className="wrap">
              <h2 className="font-display text-[28px] font-bold">{p.inSystem ? 'Rest of the air system' : 'Related products'}</h2>
              <div className="mt-8 grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                {(p.inSystem ? PRODUCTS.filter((x) => x.inSystem && x.slug !== p.slug && SYSTEM_STEPS.some((s) => s.slug === x.slug)) : related).slice(0, 3).map((x) => <ProductCard key={x.slug} p={x} index={CATALOG.indexOf(x)} />)}
              </div>
            </div>
          </ThumbStage>
        </section>
      )}

      <CtaBand />
    </>
  );
}
