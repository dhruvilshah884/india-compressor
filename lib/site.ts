export const SITE = {
  name: 'Parth Air Compressor',
  short: 'Parth',
  tagline: 'Quality Air Compressor · Since 2000',
  url: 'https://www.indiacompressor.com',
  phone: '+91 98790 49048',
  phoneHref: 'tel:+919879049048',
  whatsapp: '919879049048',
  email: 'parth@indiacompressor.com',
  address: ['38/B/3, Coronation Compound,', 'Opp. Ideal Sheet Metal, Phase-1,', 'G.I.D.C., Vatva, Ahmedabad - 382445,', 'Gujarat, India'],
  hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Parth+Air+Compressor+GIDC+Vatva+Ahmedabad',
};

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/solutions/complete-compressed-air-system', label: 'Solutions' },
  { href: '/#industries', label: 'Industries' },
  { href: '/#global', label: 'Global' },
  { href: '/products/air-compressor-parts', label: 'Spares' },
  { href: '/about', label: 'About' },
];

/** the home page story — the right-side chapter rail */
export const CHAPTERS = [
  { id: 'air', label: 'Air, engineered' },
  { id: 'inside', label: 'Inside a Parth' },
  { id: 'plant', label: 'The plant floor' },
  { id: 'reciprocating', label: 'Reciprocating' },
  { id: 'duplex-pet', label: 'Duplex & PET' },
  { id: 'screw', label: 'Screw' },
  { id: 'dryers', label: 'Dryers & chillers' },
  { id: 'receivers', label: 'Receiver tanks' },
  { id: 'vacuum', label: 'Vacuum pumps' },
  { id: 'spares', label: 'Spares' },
  { id: 'industries', label: 'Industries' },
  { id: 'global', label: 'Global' },
  { id: 'quote', label: 'Get a quote' },
];

export const STATS = [
  { value: '25+', label: 'Years of manufacturing' },
  { value: '1,00,000+', label: 'Active installations' },
  { value: '14', label: 'Product lines' },
  { value: '9', label: 'Countries served' },
];

export const INDUSTRIES = [
  { key: 'textiles', name: 'Textiles', use: 'Air-jet looms, spinning & pneumatic controls', products: ['screw-air-compressor', 'refrigerated-air-dryer', 'air-receiver-tank'] },
  { key: 'chemicals', name: 'Chemicals', use: 'Process air, instrument air & conveying', products: ['screw-air-compressor', 'heatless-air-dryer', 'compressed-air-filters'] },
  { key: 'pharma', name: 'Pharmaceuticals', use: 'Oil-free, dry and filtered air for clean rooms', products: ['oil-free-air-compressor', 'heatless-air-dryer', 'vacuum-pump'] },
  { key: 'paint', name: 'Paint & coating', use: 'Moisture-free air for spray booths', products: ['two-stage-air-compressor', 'refrigerated-air-dryer', 'compressed-air-filters'] },
  { key: 'pet', name: 'PET blow & plastic', use: '40 bar air for bottle blowing + mould cooling', products: ['multistage-pet-air-compressor', 'booster-air-compressor', 'water-chiller'] },
  { key: 'dairy', name: 'Dairy', use: 'Clean air for packing & CIP lines', products: ['screw-air-compressor', 'refrigerated-air-dryer', 'compressed-air-filters'] },
  { key: 'auto', name: 'Automobile', use: 'Tools, paint shops & assembly lines', products: ['screw-air-compressor', 'two-stage-air-compressor', 'air-receiver-tank'] },
  { key: 'food', name: 'Food & beverage', use: 'Oil-free air that touches product', products: ['oil-free-air-compressor', 'refrigerated-air-dryer', 'compressed-air-filters'] },
  { key: 'medical', name: 'Medical', use: 'Hospital air & vacuum systems', products: ['oil-free-air-compressor', 'vacuum-pump', 'heatless-air-dryer'] },
];

export const COUNTRIES = [
  { name: 'India', lat: 23.0, lon: 72.6, note: 'HQ · Vatva, Ahmedabad', hq: true, tag: 'HQ · Vatva' },
  { name: 'UAE', lat: 25.2, lon: 55.3, tag: 'Dryers' },
  { name: 'Oman', lat: 23.6, lon: 58.4, tag: 'PET' },
  { name: 'Nepal', lat: 27.7, lon: 85.3, tag: 'Recip.' },
  { name: 'Bhutan', lat: 27.5, lon: 89.6, tag: 'Recip.' },
  { name: 'Ethiopia', lat: 9.0, lon: 38.7, tag: 'Dryers' },
  { name: 'Uganda', lat: 0.35, lon: 32.6, tag: 'High pr.' },
  { name: 'Rwanda', lat: -1.9, lon: 30.1, tag: 'Screw' },
  { name: 'Tanzania', lat: -6.8, lon: 39.3, tag: 'Tanks' },
  { name: 'Cameroon', lat: 3.9, lon: 11.5, tag: 'Recip.' },
];

export function whatsappLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
