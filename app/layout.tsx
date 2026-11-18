import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import FloatContact from '@/components/FloatContact';
import { SITE } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Air Compressors, Dryers & Complete Air Systems | Ahmedabad`, template: `%s | ${SITE.name}` },
  description:
    'Parth Air Compressor, GIDC Vatva, Ahmedabad — manufacturer of screw, reciprocating, PET and booster air compressors, refrigerated & heatless air dryers, filters, air receivers, chillers and vacuum pumps. Complete compressed-air systems since 2000.',
  keywords: ['air compressor Ahmedabad', 'screw air compressor', 'refrigerated air dryer', 'air receiver tank', 'compressed air filter', 'PET air compressor', 'Parth Air Compressor', 'GIDC Vatva'],
  openGraph: { type: 'website', siteName: SITE.name, locale: 'en_IN' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#f4f6fa',
};


const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  foundingDate: '2000',
  address: { '@type': 'PostalAddress', streetAddress: '38/B/3, Coronation Compound, Opp. Ideal Sheet Metal, Phase-1, GIDC Vatva', addressLocality: 'Ahmedabad', postalCode: '382445', addressRegion: 'Gujarat', addressCountry: 'IN' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </head>
      <body className="antialiased">
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatContact />
      </body>
    </html>
  );
}
