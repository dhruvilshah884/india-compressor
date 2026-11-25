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
  title: { default: `Air Compressor Manufacturer in Ahmedabad, Gujarat | ${SITE.name}`, template: `%s | ${SITE.name}` },
  description:
    'Parth Air Compressor, GIDC Vatva, Ahmedabad — manufacturer of screw, reciprocating, PET and booster air compressors, refrigerated & heatless air dryers, filters, air receivers, chillers and vacuum pumps. Complete compressed-air systems since 2000.',
  keywords: [
    'air compressor manufacturer in Ahmedabad', 'air compressor manufacturer in Gujarat', 'air compressor manufacturer India',
    'screw air compressor', 'reciprocating air compressor', 'two stage air compressor', 'PET air compressor', 'booster air compressor',
    'refrigerated air dryer', 'heatless air dryer', 'air receiver tank', 'compressed air filter', 'water chiller', 'vacuum pump',
    'air compressor spare parts', 'Parth Air Compressor', 'GIDC Vatva',
  ],
  applicationName: SITE.name,
  openGraph: {
    type: 'website', siteName: SITE.name, locale: 'en_IN', url: '/',
    title: `${SITE.name} — Air Compressor Manufacturer in Ahmedabad`,
    description: 'Screw, reciprocating and PET air compressors, air dryers, filters, receivers, chillers and vacuum pumps. Manufacturer in GIDC Vatva, Ahmedabad since 2000.',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  formatDetection: { telephone: true, email: true, address: false },
};

export const viewport: Viewport = {
  themeColor: '#f4f6fa',
};


// the company as a local manufacturer: name, address, phone and hours must match the Google Business Profile exactly
const orgLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icon.svg`,
  image: `${SITE.url}/opengraph-image`,
  description: 'Manufacturer of screw, reciprocating, PET and booster air compressors, air dryers, filters, air receivers, water chillers and vacuum pumps in GIDC Vatva, Ahmedabad, since 2000.',
  telephone: SITE.phone,
  email: SITE.email,
  foundingDate: '2000',
  address: { '@type': 'PostalAddress', streetAddress: '38/B/3, Coronation Compound, Opp. Ideal Sheet Metal, Phase-1, GIDC Vatva', addressLocality: 'Ahmedabad', postalCode: '382445', addressRegion: 'Gujarat', addressCountry: 'IN' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00' }],
  areaServed: { '@type': 'Country', name: 'India' },
  hasMap: SITE.mapUrl,
  knowsAbout: ['Air compressors', 'Screw air compressors', 'Reciprocating air compressors', 'Compressed air dryers', 'Compressed air systems'],
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
