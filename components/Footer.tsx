import Link from 'next/link';
import Logo from './Logo';
import { SITE, NAV } from '@/lib/site';
import { PRODUCTS } from '@/lib/products';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-2">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-[14.5px] leading-relaxed text-muted">
            Air compressors, dryers, filters, receivers and complete compressed-air systems — built in GIDC Vatva, Ahmedabad since 2000.
          </p>
          <Link href="/solutions/complete-compressed-air-system" className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-red">
            Plan a complete air system →
          </Link>
        </div>
        <div>
          <h3 className="eyebrow">Products</h3>
          <ul className="mt-4 space-y-2.5 text-[14.5px]">
            {PRODUCTS.slice(0, 8).map((p) => (
              <li key={p.slug}><Link className="text-ink-2 hover:text-red" href={`/products/${p.slug}`}>{p.name}</Link></li>
            ))}
            <li><Link className="font-semibold text-ink hover:text-red" href="/products">All products →</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">Company</h3>
          <ul className="mt-4 space-y-2.5 text-[14.5px]">
            {NAV.map((n) => <li key={n.href}><Link className="text-ink-2 hover:text-red" href={n.href}>{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">Contact</h3>
          <address className="mt-4 space-y-3 text-[14.5px] not-italic leading-relaxed text-ink-2">
            <p>{SITE.address.map((l) => <span key={l} className="block">{l}</span>)}</p>
            <p><a className="font-semibold text-ink hover:text-red" href={SITE.phoneHref}>{SITE.phone}</a></p>
            <p><a className="hover:text-red" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            <p className="text-muted">{SITE.hours}</p>
          </address>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-2 py-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="font-mono">indiacompressor.com · parthcompressor.com</p>
        </div>
      </div>
    </footer>
  );
}
