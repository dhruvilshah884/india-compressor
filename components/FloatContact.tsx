import Link from 'next/link';
import { SITE, whatsappLink } from '@/lib/site';

/** Phones: the Call · WhatsApp · Get a quote dock that stays on screen (concept image 07). */
export default function FloatContact() {
  return (
    <div className="fixed inset-x-3 bottom-3.5 z-50 grid h-[60px] grid-cols-[1fr_1fr_1.3fr] gap-1.5 rounded-[18px] border border-line bg-white/90 p-1.5 shadow-[0_10px_30px_rgba(15,23,42,.12)] backdrop-blur-md md:hidden">
      <a href={SITE.phoneHref} className="grid place-items-center rounded-[13px] text-[13.5px] font-semibold text-ink">☎ Call</a>
      <a href={whatsappLink('Hello Parth Air Compressor, I need details about your air compressors.')} target="_blank" rel="noopener noreferrer"
        className="grid place-items-center rounded-[13px] text-[13.5px] font-semibold text-ink">WhatsApp</a>
      <Link href="/contact" className="grid place-items-center rounded-[13px] bg-red text-[13.5px] font-semibold text-white">Get a quote</Link>
    </div>
  );
}
