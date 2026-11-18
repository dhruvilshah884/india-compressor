'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { NAV, SITE, whatsappLink } from '@/lib/site';

/** Floating rounded glass navbar (concept images). */
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState('');
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { const on = () => setHash(window.location.hash); on(); window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on); }, [pathname]);

  const active = (href: string) => {
    if (href.includes('#')) return pathname === '/' && hash === href.slice(1);
    if (href === '/') return pathname === '/' && !hash;
    if (href === '/products') return pathname.startsWith('/products') && pathname !== '/products/air-compressor-parts';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed inset-x-3 top-3 z-50 md:inset-x-8 md:top-5">
      <div className="glass flex h-14 items-center gap-6 rounded-2xl pl-4 pr-2.5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-colors duration-300 md:h-16 md:rounded-[18px] md:pl-5 md:pr-3">
        <Logo className="hidden md:flex" />
        <Logo compact className="md:hidden" />
        <nav className="ml-4 hidden items-center gap-[26px] xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`text-[14px] transition-colors ${active(n.href) ? 'font-semibold text-ink' : 'font-medium text-ink-2 hover:text-ink'}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1" />
        <a href={whatsappLink('Hello Parth Air Compressor, I need details about your air compressors.')} target="_blank" rel="noopener noreferrer"
          className="hidden items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink lg:inline-flex">
          <span className="h-2 w-2 rounded-full bg-[#25d366]" />{SITE.phone.replace(/ \d{5} \d{5}$/, '')} WhatsApp
        </a>
        <Link href="/contact" className="btn btn-red btn-sm hidden sm:inline-flex">Request quote</Link>
        <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}
          className="grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-line text-ink xl:hidden">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="glass mt-2 flex flex-col gap-1 rounded-2xl p-3 xl:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className={`rounded-xl px-4 py-3 text-[16px] ${active(n.href) ? 'bg-ink/5 font-semibold text-ink' : 'text-ink-2'}`}>{n.label}</Link>
          ))}
          <Link href="/contact" className="btn btn-red mt-2">Request quote</Link>
        </nav>
      )}
    </header>
  );
}
