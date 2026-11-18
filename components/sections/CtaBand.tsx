import Link from 'next/link';
import { SITE, whatsappLink } from '@/lib/site';

export default function CtaBand({ title = 'Tell us what you run. We will size the air.', text = 'Share your machines, working pressure and hours — our engineers reply with the right compressor and air treatment.' }: { title?: string; text?: string }) {
  return (
    <section className="py-20 md:py-28">
      <div className="wrap">
        <div className="reveal relative overflow-hidden rounded-[28px] bg-navy px-6 py-12 text-white md:px-14 md:py-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red/40 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan/25 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.05]">{title}</h2>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/75">{text}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-end">
              <a href={whatsappLink('Hello Parth Air Compressor, I need a quotation.')} target="_blank" rel="noopener noreferrer" className="btn btn-red">WhatsApp us</a>
              <a href={SITE.phoneHref} className="btn border border-white/25 text-white hover:border-white">Call {SITE.phone}</a>
              <Link href="/contact" className="text-[14px] font-semibold text-white/80 hover:text-white">Or send an enquiry →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
