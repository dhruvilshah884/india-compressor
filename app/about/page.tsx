import type { Metadata } from 'next';
import CtaBand from '@/components/sections/CtaBand';
import { STATS, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About Parth Air Compressor',
  description: 'Manufacturing air compressors and compressed-air equipment in GIDC Vatva, Ahmedabad since 2000 — serving industries across India and 9 export countries.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  { t: 'Built in-house', d: 'Machining, assembly and testing at our GIDC Vatva works — so we control quality and lead times.' },
  { t: 'Tested before dispatch', d: 'Every compressor is run, pressure-tested and checked for delivery before it leaves the factory.' },
  { t: 'Service that answers', d: 'Spares in stock for Parth and leading makes, with a service team that picks up the phone.' },
  { t: 'Sized honestly', d: 'We recommend the compressor and air treatment your process actually needs — not the biggest one.' },
];

// Milestones are indicative; confirm the years with the client before going live.
const TIMELINE = [
  { y: '2000', t: 'Parth Air Compressor founded in GIDC Vatva, Ahmedabad.' },
  { y: '2008', t: 'Two-stage and duplex range for heavy industrial duty.' },
  { y: '2014', t: 'Multistage 40 bar PET and booster compressors launched.' },
  { y: '2018', t: 'Screw compressors with complete air-treatment systems.' },
  { y: 'Today', t: '1,00,000+ installations in India and 9 export countries.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="pb-16 pt-32 md:pt-40">
        <div className="wrap">
          <p className="eyebrow">About us</p>
          <h1 className="font-display mt-3 max-w-4xl text-[clamp(38px,5.6vw,72px)] font-bold leading-[0.96]">Twenty-five years of air, made in Ahmedabad.</h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2">
            {SITE.name} designs and manufactures air compressors, air dryers, filters, receivers, chillers and vacuum pumps for textiles, chemicals, pharma, PET, dairy, automobile and food plants — and supplies complete compressed-air systems built around them.
          </p>
          <dl className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="card p-6">
                <dd className="font-display text-[34px] font-bold leading-none">{s.value}</dd>
                <dt className="mt-2 text-[13.5px] text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">How we work</p>
            <h2 className="font-display mt-3 text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.05]">Quality you can hear running.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {VALUES.map((v, i) => (
                <div key={v.t} className="card reveal p-5" data-delay={i * 0.06}>
                  <h3 className="font-display text-[18px] font-bold">{v.t}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">Milestones</p>
            <ol className="mt-6 border-l-2 border-line">
              {TIMELINE.map((m) => (
                <li key={m.y} className="reveal relative pb-8 pl-7 last:pb-0">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-red" />
                  <p className="font-display text-[22px] font-bold">{m.y}</p>
                  <p className="mt-1 text-[15px] text-ink-2">{m.t}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
