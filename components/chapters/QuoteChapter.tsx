import ContactForm from '../ContactForm';
import { SITE } from '@/lib/site';

/** 13 · Get a quote */
export default function QuoteChapter() {
  return (
    <section id="quote" className="bg-inside relative overflow-hidden py-24 md:py-32">
      <div className="blueprint absolute inset-0" />
      <div className="wrap relative grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <div>
          <p className="mono text-blue">13 · Get a quote</p>
          <h2 className="font-display mt-3 text-[clamp(34px,4.2vw,54px)] font-bold leading-none">Tell us your CFM, pressure and duty. <span className="text-red">We size the rest.</span></h2>
          <p className="mt-5 max-w-md text-[16px] leading-[1.6] text-ink-2">Our engineers reply with the right compressor, dryer, filters and receiver — usually the same working day.</p>
          <div className="mt-8 grid max-w-md grid-cols-2 gap-3 text-[14px]">
            <a href={SITE.phoneHref} className="rounded-2xl border border-line bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,.05)]"><span className="mono block text-[10.5px] text-muted">Call</span><b className="mt-1 block">{SITE.phone}</b></a>
            <a href={`mailto:${SITE.email}`} className="rounded-2xl border border-line bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,.05)]"><span className="mono block text-[10.5px] text-muted">Email</span><b className="mt-1 block truncate">{SITE.email}</b></a>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
