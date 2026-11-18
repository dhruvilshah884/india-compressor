'use client';

import Link from 'next/link';
import { useId } from 'react';

/**
 * The Parth Air Compressor logo (as on parthcompressor.com): blue banded globe, red italic PARTH,
 * "Since:2000" with rules, ® and "Quality Air Compressor" in a serif — redrawn as SVG for the light theme.
 */
export function ParthLogo({ height = 44, ink = '#0b1222' }: { height?: number; ink?: string }) {
  const id = useId().replace(/:/g, '');
  // latitude bands of the globe (y offset from centre), cut out of the sphere to leave the blue stripes
  const bands = [-27, -15, -3, 9, 21, 32];
  return (
    <svg height={height} viewBox="0 0 300 88" role="img" aria-label="Parth — Quality Air Compressor, since 2000" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#1f3fa6" />
          <stop offset="0.55" stopColor="#2563c9" />
          <stop offset="1" stopColor="#38a3e8" />
        </linearGradient>
        <mask id={`m${id}`}>
          <circle cx="42" cy="46" r="40" fill="#fff" />
          {bands.map((y) => {
            const R = 40, rx = Math.sqrt(Math.max(0, R * R - y * y));
            return <ellipse key={y} cx={42} cy={46 + y} rx={rx + 2} ry={rx * 0.36} fill="none" stroke="#000" strokeWidth={3.2} transform={`rotate(-16 42 ${46 + y})`} />;
          })}
          {/* the swirl opening on the left */}
          <path d="M8 34 C 20 20, 40 22, 46 40 C 34 30, 20 30, 10 44 Z" fill="#000" />
        </mask>
      </defs>
      <circle cx="42" cy="46" r="40" fill={`url(#g${id})`} mask={`url(#m${id})`} />

      {/* Since:2000 with rules either side */}
      <line x1="104" y1="12" x2="160" y2="12" stroke={ink} strokeWidth="1.3" />
      <text x="194" y="16.5" textAnchor="middle" fontFamily="Arial Narrow, Arial, sans-serif" fontSize="14" fill={ink}>Since:2000</text>
      <line x1="228" y1="12" x2="284" y2="12" stroke={ink} strokeWidth="1.3" />
      <text x="291" y="17" fontFamily="Arial, sans-serif" fontSize="13" fill={ink}>®</text>

      {/* PARTH */}
      <text x="96" y="62" fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="47"
        textLength="190" lengthAdjust="spacingAndGlyphs" fill="#e3242b" transform="skewX(-6) translate(6 0)">PARTH</text>

      {/* Quality Air Compressor */}
      <text x="104" y="84" fontFamily="'Times New Roman', Times, serif" fontSize="18.5" textLength="182" lengthAdjust="spacingAndGlyphs" fill={ink}>Quality Air Compressor</text>
    </svg>
  );
}

export default function Logo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={`flex shrink-0 items-center ${className}`} aria-label="Parth Air Compressor — home">
      <ParthLogo height={compact ? 38 : 50} />
    </Link>
  );
}
