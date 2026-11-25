import { ogCard, OG_SIZE } from '@/lib/ogCard';
import { PRODUCTS, bySlug } from '@/lib/products';

export const alt = 'Parth Air Compressor product';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug((await params).slug);
  return ogCard({
    eyebrow: p ? `${p.group} · Manufacturer in Ahmedabad` : 'Products',
    title: p?.name ?? 'Parth Air Compressor',
    subtitle: p?.range ?? 'Air compressors and air systems',
  });
}
