import type { Metadata } from 'next';
import Link from 'next/link';
import SystemSection from '@/components/sections/SystemSection';
import SystemSizer from '@/components/sections/SystemSizer';
import CtaBand from '@/components/sections/CtaBand';
import { SYSTEM_STEPS } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Complete Compressed Air System — Clean, Dry, Reliable Air',
  description: 'Screw air compressor + air receiver + pre filter + refrigerated air dryer + after filter: a complete compressed-air system from Parth Air Compressor, Ahmedabad, sized and supplied together.',
  alternates: { canonical: '/solutions/complete-compressed-air-system' },
};

const WHY = [
  { t: 'Water ruins air tools', d: 'A 20 HP compressor can push 10+ litres of water a day into your pipeline. The dryer takes it out before it reaches machines.' },
  { t: 'Oil spoils products', d: 'Paint, food, pharma and textiles need oil-free air at the point of use. Two-stage filtration removes aerosols and particles.' },
  { t: 'Steady pressure saves power', d: 'The receiver absorbs demand peaks, so the compressor loads and unloads less often — lower power bills and longer life.' },
  { t: 'One supplier, one warranty', d: 'Every part sized together by Parth engineers, delivered, installed and serviced by one team.' },
];

export default function SolutionPage() {
  return (
    <>
      <section className="pb-6 pt-32 md:pt-40">
        <div className="wrap">
          <p className="eyebrow">Solutions · Screw compressor systems</p>
          <h1 className="font-display mt-3 max-w-4xl text-[clamp(38px,5.6vw,72px)] font-bold leading-[0.96]">
            Complete compressed air solution.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-2">
            If your process needs <b>clean, dry, reliable air</b>, a compressor alone isn&apos;t enough. Here is the full line we build around a Parth <Link href="/products/screw-air-compressor" className="font-semibold text-red hover:underline">screw air compressor</Link>.
          </p>
          <ol className="mt-8 flex flex-wrap items-center gap-2 text-[14px]">
            {SYSTEM_STEPS.map((s, i) => (
              <li key={s.label} className="flex items-center gap-2">
                <Link href={`/products/${s.slug}`} className="rounded-full border border-line bg-bg-2 px-3.5 py-2 font-medium hover:border-red/40">{s.label}</Link>
                {i < SYSTEM_STEPS.length - 1 && <span className="font-mono text-[11px] text-cyan">AIR FLOW →</span>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SystemSection id="air-system" eyebrow="Follow the air" title={<>From atmosphere to <span className="text-cyan">instrument-grade</span> air.</>} />

      <section className="py-20 md:py-28">
        <div className="wrap">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">Each stage</p>
            <h2 className="font-display mt-3 text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.05]">What every part does.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {SYSTEM_STEPS.map((s, i) => (
              <Link key={s.label} href={`/products/${s.slug}`} className="card reveal group p-5 transition hover:-translate-y-1" data-delay={i * 0.06}>
                <p className="font-mono text-[12px] text-red">0{i + 1}</p>
                <h3 className="font-display mt-2 text-[18px] font-bold leading-snug">{s.label}</h3>
                <p className="mt-1 text-[13.5px] font-semibold text-blue">{s.role}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{s.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="sizer" className="scroll-mt-24 pb-20 md:pb-28">
        <div className="wrap">
          <div className="reveal mb-10 max-w-2xl">
            <p className="eyebrow">Size your system</p>
            <h2 className="font-display mt-3 text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.05]">Start from the compressor.</h2>
          </div>
          <div className="reveal"><SystemSizer /></div>
        </div>
      </section>

      <section className="pb-8">
        <div className="wrap grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <div key={w.t} className="card reveal p-6" data-delay={i * 0.06}>
              <h3 className="font-display text-[19px] font-bold">{w.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand title="Get the complete system quoted in one go." text="Tell us your compressor size (or air demand), working pressure and application. We reply with a matched compressor, receiver, filters and dryer." />
    </>
  );
}
