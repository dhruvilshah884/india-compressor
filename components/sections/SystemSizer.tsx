'use client';

import { useMemo, useState } from 'react';
import { whatsappLink } from '@/lib/site';

const HP = [5, 7.5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100];
const RECEIVER_L = [100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000];
const DRYER_CFM = [20, 30, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500];
const PRESSURES = [7.5, 8.5, 10];
const up = (list: number[], v: number) => list.find((x) => x >= v) ?? list[list.length - 1];

/**
 * Indicative sizing for the complete system from the screw compressor's HP.
 * Rules of thumb only (≈4 CFM per HP at 7.5 bar, less at higher pressure; receiver ≈ 4 L per CFM) —
 * the final selection is always confirmed by Parth's engineers.
 */
export default function SystemSizer() {
  const [hp, setHp] = useState(20);
  const [bar, setBar] = useState(7.5);
  const r = useMemo(() => {
    const cfmPerHp = bar <= 7.5 ? 4 : bar <= 8.5 ? 3.7 : 3.3;
    const cfm = Math.round(hp * cfmPerHp);
    return { cfm, receiver: up(RECEIVER_L, cfm * 4), dryer: up(DRYER_CFM, cfm * 1.1), filter: up(DRYER_CFM, cfm * 1.1) };
  }, [hp, bar]);

  const rows: [string, string, string][] = [
    ['Screw air compressor', `${hp} HP · ${bar} bar`, `≈ ${r.cfm} CFM free air delivery`],
    ['Air receiver', `${r.receiver.toLocaleString('en-IN')} L`, 'Vertical, with safety valve, gauge & auto drain'],
    ['Pre filter', `${r.filter} CFM`, 'Coarse filtration — 1 micron'],
    ['Refrigerated air dryer', `${r.dryer} CFM`, 'Pressure dew point +3 °C'],
    ['After filter', `${r.filter} CFM`, 'Fine filtration — 0.01 micron'],
  ];
  const msg = `Hello Parth, please quote a complete compressed air system:\n${rows.map(([a, b]) => `• ${a}: ${b}`).join('\n')}`;

  return (
    <div className="card overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-line p-6 md:p-8 lg:border-b-0 lg:border-r">
          <p className="eyebrow">System sizer</p>
          <h3 className="font-display mt-2 text-[26px] font-bold leading-tight">Pick your compressor — we size the rest.</h3>
          <label className="mt-6 block text-[14px] font-semibold" htmlFor="hp">Screw compressor power: <span className="text-red">{hp} HP</span></label>
          <input id="hp" type="range" min={0} max={HP.length - 1} step={1} value={HP.indexOf(hp)} onChange={(e) => setHp(HP[Number(e.target.value)])}
            className="mt-3 w-full accent-[var(--red)]" />
          <div className="mt-1 flex justify-between font-mono text-[11px] text-muted"><span>5 HP</span><span>100 HP</span></div>
          <p className="mt-6 text-[14px] font-semibold">Working pressure</p>
          <div className="mt-3 flex gap-2">
            {PRESSURES.map((p) => <button key={p} className="chip" data-on={p === bar} onClick={() => setBar(p)}>{p} bar</button>)}
          </div>
          <p className="mt-6 text-[12.5px] leading-relaxed text-muted">Indicative sizes from rules of thumb. Our engineers confirm the final selection after checking your air demand, pipeline and site.</p>
        </div>
        <div className="p-6 md:p-8">
          <ol className="space-y-3">
            {rows.map(([name, size, note], i) => (
              <li key={name} className="flex items-center gap-4 rounded-2xl border border-line bg-bg p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-mono text-[13px] font-bold text-bg">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{name}</p>
                  <p className="text-[13px] text-muted">{note}</p>
                </div>
                <span className="font-display shrink-0 text-right text-[17px] font-bold text-blue">{size}</span>
              </li>
            ))}
          </ol>
          <a href={whatsappLink(msg)} target="_blank" rel="noopener noreferrer" className="btn btn-red mt-5 w-full">Send this system for a quote on WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
