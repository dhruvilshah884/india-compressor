import { ogCard, OG_SIZE } from '@/lib/ogCard';

export const alt = 'Parth Air Compressor — air compressor manufacturer in Ahmedabad';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({
    eyebrow: 'Air compressor manufacturer · Ahmedabad',
    title: 'Compressed air that never stops.',
    subtitle: 'Screw · Reciprocating · PET · Dryers · Receivers',
  });
}
