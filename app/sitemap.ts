import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = ['', '/products', '/solutions/complete-compressed-air-system', '/about', '/contact'];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, lastModified, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${SITE.url}/products/${p.slug}`, lastModified, changeFrequency: 'monthly' as const, priority: p.slug === 'screw-air-compressor' ? 0.9 : 0.7 })),
  ];
}
