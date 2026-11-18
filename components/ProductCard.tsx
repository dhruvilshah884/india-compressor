import Link from 'next/link';
import type { Product } from '@/lib/products';
import { ModelThumb } from './three/ThumbStage';

/** Catalogue card from concept image 05: 3D model on top, group · name · range, round arrow. */
export default function ProductCard({ p, index }: { p: Product; index?: number }) {
  return (
    <Link href={`/products/${p.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-card shadow-[0_10px_30px_rgba(15,23,42,.05)] outline outline-2 outline-transparent transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(225,29,46,.18)] hover:outline-red">
      <div className="relative h-[190px] border-b border-line bg-[radial-gradient(220px_130px_at_50%_70%,var(--stage-2),var(--bg))]">
        <ModelThumb model={p.model} className="absolute inset-0" />
        {index !== undefined && (
          <span className="absolute left-3 top-3 rounded-md border border-line bg-bg-2 px-[7px] py-1 font-mono text-[10px] font-semibold tracking-[0.08em] text-ink-2">3D · {String(index + 1).padStart(2, '0')}</span>
        )}
      </div>
      <div className="relative px-[18px] pb-[18px] pt-4 pr-14">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-blue">{p.group}</p>
        <h3 className="font-display mb-1 mt-1.5 text-[18px] font-bold leading-[1.2] text-ink">{p.name}</h3>
        <p className="text-[13.5px] text-muted">{p.range}</p>
        <span className="absolute bottom-[18px] right-4 grid h-[34px] w-[34px] place-items-center rounded-full bg-ink text-[15px] text-bg transition group-hover:bg-red group-hover:text-white">→</span>
      </div>
    </Link>
  );
}
