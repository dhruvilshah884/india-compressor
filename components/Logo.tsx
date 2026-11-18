import Link from 'next/link';

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#1f45b8" />
      <circle cx="16" cy="14" r="9" fill="#5b8cff" opacity=".45" />
      <path d="M5 22c8-7 22-9 31-4" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M7 29c9-5 19-6 27-2" stroke="#e11d2e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** PARTH wordmark with the "Quality Air Compressor · Since 2000" line, as in the concept images */
export default function Logo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label="Parth Air Compressor — home">
      <LogoMark size={compact ? 30 : 38} />
      <span className="leading-none">
        <span className={`wordmark block ${compact ? 'text-[21px]' : ''}`}>PARTH</span>
        {!compact && <span className="mt-[3px] block text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--eyebrow)]">Quality Air Compressor · Since 2000</span>}
      </span>
    </Link>
  );
}
