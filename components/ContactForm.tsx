'use client';

import { useState } from 'react';
import { PRODUCTS } from '@/lib/products';
import { SITE, whatsappLink } from '@/lib/site';

/**
 * No backend: the enquiry opens WhatsApp (or the mail app) with the message filled in,
 * so it reaches Parth directly and nothing is stored on this website.
 */
export default function ContactForm() {
  const [f, setF] = useState({ name: '', company: '', phone: '', city: '', product: 'Complete compressed air system', message: '' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const text = () => [
    'Hello Parth Air Compressor, I have an enquiry.',
    `Name: ${f.name}`, f.company && `Company: ${f.company}`, `Phone: ${f.phone}`, f.city && `City: ${f.city}`,
    `Product: ${f.product}`, f.message && `Details: ${f.message}`,
  ].filter(Boolean).join('\n');
  const send = (via: 'wa' | 'mail') => (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const form = (e.currentTarget as HTMLElement).closest('form');
    if (form && !form.reportValidity()) return;
    if (via === 'wa') window.open(whatsappLink(text()), '_blank', 'noopener');
    else window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry: ${f.product}`)}&body=${encodeURIComponent(text())}`;
  };
  const input = 'mt-1.5 w-full rounded-xl border border-line bg-bg px-4 py-3 text-[15px] outline-none transition focus:border-blue';

  return (
    <form onSubmit={send('wa')} className="card grid gap-4 p-6 md:grid-cols-2 md:p-8">
      <label className="text-[13.5px] font-semibold">Your name *<input required className={input} value={f.name} onChange={set('name')} autoComplete="name" /></label>
      <label className="text-[13.5px] font-semibold">Company<input className={input} value={f.company} onChange={set('company')} autoComplete="organization" /></label>
      <label className="text-[13.5px] font-semibold">Phone *<input required type="tel" className={input} value={f.phone} onChange={set('phone')} autoComplete="tel" /></label>
      <label className="text-[13.5px] font-semibold">City<input className={input} value={f.city} onChange={set('city')} autoComplete="address-level2" /></label>
      <label className="text-[13.5px] font-semibold md:col-span-2">Product
        <select className={input} value={f.product} onChange={set('product')}>
          <option>Complete compressed air system</option>
          {PRODUCTS.map((p) => <option key={p.slug}>{p.name}</option>)}
          <option>Service / spares</option>
        </select>
      </label>
      <label className="text-[13.5px] font-semibold md:col-span-2">Requirement
        <textarea rows={4} className={input} value={f.message} onChange={set('message')} placeholder="HP or CFM, working pressure, application, hours per day…" />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
        <button type="submit" className="btn btn-red flex-1">Send on WhatsApp</button>
        <button type="button" onClick={send('mail')} className="btn btn-ghost flex-1">Send by email</button>
      </div>
    </form>
  );
}
