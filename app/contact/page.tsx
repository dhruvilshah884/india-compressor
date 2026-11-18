import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact & Request a Quote',
  description: `Contact ${SITE.name}, GIDC Vatva, Ahmedabad. Call ${SITE.phone} or send an enquiry for air compressors, dryers and complete compressed-air systems.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <section className="pb-24 pt-32 md:pt-40">
      <div className="wrap">
        <p className="eyebrow">Contact</p>
        <h1 className="font-display mt-3 max-w-3xl text-[clamp(38px,5.4vw,68px)] font-bold leading-[0.98]">Request a quote.</h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-2">Tell us what you need. Your message opens in WhatsApp or email, ready to send — we usually reply the same working day.</p>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm />
          <aside className="card flex flex-col gap-6 p-6 md:p-8">
            <div>
              <h2 className="eyebrow">Works & office</h2>
              <address className="mt-3 text-[15px] not-italic leading-relaxed">{SITE.address.map((l) => <span key={l} className="block">{l}</span>)}</address>
              <a href={SITE.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[14px] font-semibold text-red">Open in Google Maps →</a>
            </div>
            <div>
              <h2 className="eyebrow">Phone</h2>
              <a href={SITE.phoneHref} className="font-display mt-2 block text-[24px] font-bold hover:text-red">{SITE.phone}</a>
            </div>
            <div>
              <h2 className="eyebrow">Email</h2>
              <a href={`mailto:${SITE.email}`} className="mt-2 block text-[16px] font-semibold hover:text-red">{SITE.email}</a>
            </div>
            <div>
              <h2 className="eyebrow">Hours</h2>
              <p className="mt-2 text-[15px]">{SITE.hours}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
