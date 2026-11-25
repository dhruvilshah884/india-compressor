import { ImageResponse } from 'next/og';
import { GLOBE_DATA_URI } from './brandMark';

export const OG_SIZE = { width: 1200, height: 630 };

/** The share image (WhatsApp, LinkedIn, Google): Parth globe + name, a big title, a subtitle and the address line. */
export function ogCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', background: 'linear-gradient(135deg, #ffffff 0%, #eef2f8 60%, #dfe7f5 100%)', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GLOBE_DATA_URI} width={84} height={84} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 50, fontWeight: 900, fontStyle: 'italic', color: '#e3242b', letterSpacing: 2 }}>PARTH</div>
            <div style={{ fontSize: 22, color: '#0b1222' }}>Quality Air Compressor · Since 2000</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 24, color: '#1f45b8', letterSpacing: 4, textTransform: 'uppercase' }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 34 ? 62 : 76, fontWeight: 800, color: '#0b1222', lineHeight: 1.05, marginTop: 14 }}>{title}</div>
          <div style={{ fontSize: 34, color: '#e11d2e', fontWeight: 700, marginTop: 16 }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#475569' }}>
          <span>GIDC Vatva, Ahmedabad, Gujarat</span>
          <span>www.indiacompressor.com</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
