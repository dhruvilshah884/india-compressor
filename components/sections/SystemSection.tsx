'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useScrollProgress } from '../useScrollProgress';
import { SYSTEM_STEPS } from '@/lib/products';
import { whatsappLink } from '@/lib/site';

const SystemScene = dynamic(() => import('../three/SystemScene'), { ssr: false });

/**
 * "Complete Compressed Air Solution — Clean • Dry • Reliable Air" (the client's idea for the screw compressor).
 * A dark stage with all five machines on one pipe rack; scrolling fills the line with air, machine by machine.
 */
export default function SystemSection({ eyebrow = 'Complete compressed air solution', title, intro, id }: {
  eyebrow?: string; title?: React.ReactNode; intro?: React.ReactNode; id?: string;
}) {
  const { sectionRef, progress, step } = useScrollProgress(SYSTEM_STEPS.length);
  const pins = useRef<(HTMLElement | null)[]>([]);
  const outletPin = useRef<HTMLDivElement>(null);
  const s = SYSTEM_STEPS[step];

  return (
    <section id={id} ref={sectionRef} className="relative" style={{ height: `${SYSTEM_STEPS.length * 70 + 100}vh` }}>
      <div className="bg-inside sticky top-0 h-[100svh] overflow-hidden">
        <div className="blueprint absolute inset-0" />
        <SystemScene progress={progress} pins={pins} outletPin={outletPin} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0">
          <div ref={outletPin} className="float-label transition-opacity duration-500" style={{ opacity: 0 }}>
            <span className="mt-3 flex -translate-x-1/2 flex-col items-center">
              <i className="h-[18px] w-0.5 bg-[linear-gradient(transparent,#16a34a)]" />
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#16a34a]/30 bg-[#f0fdf4] px-3 py-1.5 text-[12.5px] font-semibold text-[#15803d] shadow-[0_8px_20px_rgba(15,23,42,.08)]">
                <i className="h-2 w-2 rounded-full bg-[#16a34a]" />Clean, dry air → to your machines
              </span>
            </span>
          </div>
          {SYSTEM_STEPS.map((x, i) => (
            <Link key={x.label} href={`/products/${x.slug}`} ref={(el) => { pins.current[i] = el; }} className="float-label pointer-events-auto">
              <span className="flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <span className={`flex items-center gap-[7px] whitespace-nowrap rounded-full border py-1.5 pl-[7px] pr-[11px] text-[12.5px] font-semibold transition-colors ${i === step ? 'border-ink bg-ink text-white' : 'label-card'}`}>
                  <span className={`grid h-[22px] w-[22px] place-items-center rounded-full font-mono text-[10px] font-semibold ${i === step ? 'bg-red text-white' : i < step ? 'bg-blue/10 text-blue' : 'bg-[#e8edf6] text-blue'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="max-lg:hidden">{x.label}</span>
                </span>
                <i className="h-[22px] w-0.5 bg-[linear-gradient(#94a3b8,transparent)]" />
              </span>
            </Link>
          ))}
        </div>

        <div className="wrap relative z-10 pt-24 md:pt-[120px]">
          <p className="mono text-blue">{eyebrow}</p>
          <h2 className="font-display mt-3 max-w-3xl text-[30px] font-bold leading-[1.02] md:text-[clamp(36px,4vw,52px)]">
            {title ?? <>Clean <span className="text-cyan">•</span> Dry <span className="text-cyan">•</span> Reliable air.</>}
          </h2>
          {intro && <div className="mt-3 hidden max-w-2xl text-[15.5px] leading-[1.6] text-ink-2 md:block">{intro}</div>}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 pb-24 md:pb-[34px]">
          <div className="wrap flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="panel max-w-[400px] p-5" key={step}>
              <p className="mono text-[11px] text-red">● Air is here · {String(step + 1).padStart(2, '0')} / {String(SYSTEM_STEPS.length).padStart(2, '0')}</p>
              <h3 className="font-display mt-1.5 text-[20px] font-bold">{s.label} <span className="text-[14px] font-semibold text-blue">· {s.role}</span></h3>
              <p className="mt-1 text-[13.5px] leading-[1.5] text-ink-2">{s.detail}</p>
              <div className="mt-3 flex gap-2">
                <Link href={`/products/${s.slug}`} className="btn btn-ghost btn-sm bg-white">View {s.label.toLowerCase()}</Link>
                <a className="btn btn-red btn-sm" target="_blank" rel="noopener noreferrer"
                  href={whatsappLink('Hello Parth, I need a quote for a complete compressed air system: Screw compressor + Air receiver + Pre filter + Refrigerated air dryer + After filter.')}>
                  Quote the full system
                </a>
              </div>
            </div>
            <div className="hidden flex-col items-end gap-3 md:flex">
              <div className="flex items-center gap-[18px] text-[13px] text-ink-2">
                <span><i className="mr-2 inline-block h-1.5 w-[26px] rounded align-middle bg-cyan" />Compressed air</span>
                <span><i className="mr-2 inline-block h-1.5 w-[26px] rounded align-middle bg-red" />Air is here</span>
              </div>
              <Link href="/solutions/complete-compressed-air-system" className="text-[14px] font-semibold text-blue hover:underline">How the complete system works →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
