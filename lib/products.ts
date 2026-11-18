export type ModelKey =
  | 'single' | 'two' | 'duplex' | 'pet' | 'booster' | 'oilfree' | 'screw'
  | 'rdryer' | 'hdryer' | 'chiller' | 'tank' | 'vacuum' | 'parts' | 'filter';

export type Group = 'Reciprocating' | 'High pressure' | 'Screw' | 'Air treatment' | 'Tanks' | 'Vacuum' | 'Spares';

export interface Product {
  slug: string;
  name: string;
  short: string;
  range: string;
  group: Group;
  model: ModelKey;
  description: string;
  features: string[];
  specs: [string, string][];
  applications: string[];
  /** part of the complete compressed-air system shown with the screw compressor */
  inSystem?: boolean;
}

export const GROUPS: Group[] = ['Reciprocating', 'High pressure', 'Screw', 'Air treatment', 'Tanks', 'Vacuum', 'Spares'];

export const PRODUCTS: Product[] = [
  {
    slug: 'screw-air-compressor', name: 'Screw Air Compressor', short: 'Screw', range: '5 – 100 HP', group: 'Screw', model: 'screw', inSystem: true,
    description: 'Energy-efficient rotary screw compressors designed for continuous industrial operation with low noise and vibration. Ideal for mid-to-large factories needing consistent air delivery — and the heart of a complete Parth compressed-air system.',
    features: ['Low noise enclosure', 'Energy efficient operation', 'Long service intervals', 'Microprocessor controller with fault alarms'],
    specs: [['Power', '5 – 100 HP'], ['Working pressure', '7.5 / 8.5 / 10 bar'], ['Cooling', 'Air cooled'], ['Drive', 'Belt / direct coupled'], ['Duty', '24/7 continuous']],
    applications: ['Textiles', 'Automobile', 'Pharma', 'Food & beverage', 'Dairy'],
  },
  {
    slug: 'air-receiver-tank', name: 'Air Receiver Tank', short: 'Receiver', range: '70 – 25,000 L', group: 'Tanks', model: 'tank', inSystem: true,
    description: 'Vertical and horizontal air receiver tanks fabricated to industry standards. Available in capacities from 70 L to 25,000 L with hydro-tested certification and safety valves.',
    features: ['Hydro-tested for safety', 'Multiple capacity options', 'Manufactured up to 25,000 L', 'Safety valve, gauge & auto drain'],
    specs: [['Capacity', '70 – 25,000 L'], ['Orientation', 'Vertical / horizontal'], ['Testing', 'Hydro-tested, certified'], ['Fittings', 'Safety valve · gauge · drain']],
    applications: ['All compressor installations', 'Buffer storage', 'Pressure stabilisation'],
  },
  {
    slug: 'compressed-air-filters', name: 'Compressed Air Filters', short: 'Filters', range: 'Pre & after filters', group: 'Air treatment', model: 'filter', inSystem: true,
    description: 'Line filters installed before and after the dryer. The pre filter stops dust, water and oil aerosols reaching the dryer; the after filter polishes the air down to fine particle and oil levels for sensitive equipment.',
    features: ['Pre filter protects the dryer', 'After filter for fine particles & oil', 'Auto / manual drain', 'Differential pressure gauge'],
    specs: [['Types', 'Pre filter · after filter · carbon'], ['Flow', 'Matched to compressor CFM'], ['Drain', 'Auto / manual'], ['Housing', 'Aluminium, powder coated']],
    applications: ['Pharma', 'Food & beverage', 'Paint shops', 'Instrument air'],
  },
  {
    slug: 'refrigerated-air-dryer', name: 'Refrigerated Air Dryer', short: 'Refrigerated dryer', range: '20 – 2500 CFM', group: 'Air treatment', model: 'rdryer', inSystem: true,
    description: 'Removes moisture from compressed air to protect downstream equipment in pharma, food processing, and precision manufacturing. Compact design with low pressure drop and stable dew point performance.',
    features: ['Stable dew point in all load conditions', 'Low pressure drop', 'Auto drain valve', 'Digital dew point display'],
    specs: [['Flow', '20 – 2500 CFM'], ['Dew point', '+3 °C PDP'], ['Refrigerant', 'Eco-friendly'], ['Drain', 'Auto timer drain']],
    applications: ['Pharma', 'Food processing', 'Paint', 'Precision manufacturing'],
  },
  {
    slug: 'two-stage-air-compressor', name: 'Two Stage Air Compressor', short: 'Two stage', range: '2 – 40 HP', group: 'Reciprocating', model: 'two',
    description: 'Reliable two-stage reciprocating air compressors for workshops, garages, and small/medium scale factories. Built with heavy cast iron components for long service life and efficient high-pressure air delivery.',
    features: ['Cast iron cylinder block', 'Efficient two-stage compression', 'Intercooler between stages', 'Easy maintenance'],
    specs: [['Power', '2 – 40 HP'], ['Pressure', 'Up to 12 bar'], ['Cooling', 'Air cooled'], ['Mounting', 'Tank mounted']],
    applications: ['Workshops', 'Garages', 'Small & medium factories'],
  },
  {
    slug: 'single-stage-air-compressor', name: 'Single Stage Air Compressor', short: 'Single stage', range: '1 – 20 HP', group: 'Reciprocating', model: 'single',
    description: 'Economical single-stage reciprocating compressors ideal for light-duty applications, spray painting, and small workshops. Simple design with easy maintenance and reliable performance.',
    features: ['Economical single-stage design', 'Easy to maintain', 'Reliable performance', 'Compact footprint'],
    specs: [['Power', '1 – 20 HP'], ['Pressure', 'Up to 8 bar'], ['Cooling', 'Air cooled'], ['Mounting', 'Tank mounted']],
    applications: ['Spray painting', 'Small workshops', 'Tyre inflation'],
  },
  {
    slug: 'duplex-air-compressor', name: 'Duplex Air Compressor', short: 'Duplex', range: '30 – 50 HP', group: 'Reciprocating', model: 'duplex',
    description: 'Two heavy-duty reciprocating units on a shared receiver, delivering uninterrupted compressed air for critical manufacturing lines. Engineered for 24/7 operation with auto-changeover so one unit always remains on standby. High pressure for PET, low pressure for industrial use.',
    features: ['Twin-pump auto changeover', 'Heavy-duty cast iron construction', 'Low maintenance, long service life', 'One unit always on standby'],
    specs: [['Power', '30 – 50 HP'], ['Pumps', '2 on a shared receiver'], ['Pressure', 'Low or high (PET)'], ['Duty', '24/7 with standby']],
    applications: ['Critical lines', 'PET industry', 'Hospitals'],
  },
  {
    slug: 'multistage-pet-air-compressor', name: 'Multistage PET Air Compressor', short: 'PET', range: '15 – 75 HP · 40 bar', group: 'High pressure', model: 'pet',
    description: 'Purpose-built for PET bottle blowing with pressures up to 40 bar. Multi-stage compression with intercooling ensures reliable high-pressure air for continuous bottle production lines.',
    features: ['Up to 40 bar discharge pressure', 'Multi-stage with intercooling', 'Designed for PET blowing', 'Heavy-duty pistons'],
    specs: [['Power', '15 – 75 HP'], ['Pressure', 'Up to 40 bar'], ['Stages', 'Multi-stage, intercooled'], ['Use', 'PET bottle blowing']],
    applications: ['PET bottle plants', 'Plastic blow moulding'],
  },
  {
    slug: 'booster-air-compressor', name: 'Booster Air Compressor', short: 'Booster', range: '10 – 20 HP · 40 bar', group: 'High pressure', model: 'booster',
    description: 'Boosts existing plant air pressure to higher levels required for PET blowing, laser cutting, and pressure testing. Built with robust intercooling and heavy-duty pistons for sustained high-pressure output.',
    features: ['High-pressure output up to 40 bar', 'Robust intercooling system', 'Heavy-duty pistons', 'Runs off existing plant air'],
    specs: [['Power', '10 – 20 HP'], ['Output', 'Up to 40 bar'], ['Inlet', 'Existing plant air'], ['Cooling', 'Intercooled']],
    applications: ['PET blowing', 'Laser cutting', 'Pressure testing'],
  },
  {
    slug: 'oil-free-air-compressor', name: 'Oil Free Air Compressor', short: 'Oil free', range: '1 – 20 HP', group: 'Reciprocating', model: 'oilfree',
    description: 'Delivers 100% oil-free compressed air for sensitive applications in food, pharma, and electronics. Piston rings made of self-lubricating materials ensure zero oil contamination.',
    features: ['100% oil-free air output', 'Self-lubricating piston rings', 'Low maintenance', 'Ideal for clean applications'],
    specs: [['Power', '1 – 20 HP'], ['Air quality', '100% oil free'], ['Rings', 'Self-lubricating'], ['Cooling', 'Air cooled']],
    applications: ['Food', 'Pharma', 'Electronics', 'Medical'],
  },
  {
    slug: 'heatless-air-dryer', name: 'High Pressure Heatless Air Dryer', short: 'Heatless dryer', range: '10 – 300 CFM', group: 'Air treatment', model: 'hdryer',
    description: 'Uses pressure swing adsorption technology to achieve ultra-low dew points for instrument air and critical processes. No heat required — energy-efficient desiccant drying for high-pressure systems.',
    features: ['Dew point down to -40 °C', 'Pressure swing adsorption', 'No external heat required', 'Twin desiccant towers'],
    specs: [['Flow', '10 – 300 CFM'], ['Dew point', 'Down to -40 °C'], ['Technology', 'PSA, twin tower'], ['Heat', 'None required']],
    applications: ['Instrument air', 'Pharma', 'Chemicals'],
  },
  {
    slug: 'water-chiller', name: 'Water Chiller', short: 'Chiller', range: '2 – 100 TR', group: 'Air treatment', model: 'chiller',
    description: 'High-efficiency water chillers built for plastic moulding, pharmaceuticals, and metal fabrication. Equipped with digital temperature control, scroll / reciprocating compressors, and corrosion-resistant components for stable cooling around the clock.',
    features: ['Energy-efficient scroll / reciprocating compressor', 'Custom configurations available', 'Digital PID temperature control', 'Corrosion-resistant build'],
    specs: [['Capacity', '2 – 100 TR'], ['Compressor', 'Scroll / reciprocating'], ['Control', 'Digital PID'], ['Duty', 'Round the clock']],
    applications: ['Plastic moulding', 'Pharma', 'Metal fabrication'],
  },
  {
    slug: 'vacuum-pump', name: 'Vacuum Pump', short: 'Vacuum', range: '1.5 – 10 HP', group: 'Vacuum', model: 'vacuum',
    description: 'Oil-lubricated reciprocating vacuum pumps engineered for deep, stable vacuum in pharmaceutical, chemical, medical, and packaging processes. Heavy cast-iron construction for long, low-maintenance, continuous-duty service.',
    features: ['Reciprocating oil-lubricated design', 'Deep, stable ultimate vacuum', 'Heavy cast iron construction', 'Single & two stage'],
    specs: [['Power', '1.5 – 10 HP'], ['Type', 'Reciprocating, oil lubricated'], ['Stages', 'Single / two'], ['Duty', 'Continuous']],
    applications: ['Pharma', 'Chemical', 'Medical', 'Packaging'],
  },
  {
    slug: 'air-compressor-parts', name: 'Air Compressor Parts & Spares', short: 'Spares', range: 'Genuine components', group: 'Spares', model: 'parts',
    description: 'High-quality air compressor parts including crankshafts, filters, valves and pistons, plus replacement spares for Ingersoll-Rand, Atlas Copco, Chicago Pneumatic, ELGI and other makes.',
    features: ['Guaranteed compatibility', 'Extended lifespan', 'Optimal performance', 'Spares for leading brands'],
    specs: [['Parts', 'Crankshafts · valves · pistons · filters'], ['Makes', 'Parth, IR, Atlas Copco, CP, ELGI'], ['Supply', 'Nationwide']],
    applications: ['Maintenance', 'Overhauls', 'Screw compressor spares'],
  },
];

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

/** the complete compressed-air system: order of the air path */
export const SYSTEM_STEPS = [
  { slug: 'screw-air-compressor', label: 'Screw Air Compressor', model: 'screw' as ModelKey, role: 'Makes the compressed air', detail: 'Draws in atmospheric air and compresses it to 7.5 – 10 bar, 24/7.' },
  { slug: 'air-receiver-tank', label: 'Air Receiver', model: 'tank' as ModelKey, role: 'Stores & steadies the air', detail: 'Evens out pressure swings, lets the compressor rest and drops out the first water.' },
  { slug: 'compressed-air-filters', label: 'Pre Filter', model: 'filter' as ModelKey, role: 'Catches dust, water & oil', detail: 'Stops solid particles and oil aerosols before they reach the dryer.' },
  { slug: 'refrigerated-air-dryer', label: 'Refrigerated Air Dryer', model: 'rdryer' as ModelKey, role: 'Removes the moisture', detail: 'Chills the air to +3 °C so water condenses out and is drained away.' },
  { slug: 'compressed-air-filters', label: 'After Filter', model: 'filter' as ModelKey, role: 'Polishes the air', detail: 'Final fine filtration — clean, dry air ready for your machines.' },
];

/** order of the product range, as in the concept images (filters sit next to the dryer they protect) */
const ORDER = [
  'single-stage-air-compressor', 'two-stage-air-compressor', 'duplex-air-compressor', 'multistage-pet-air-compressor',
  'booster-air-compressor', 'oil-free-air-compressor', 'screw-air-compressor', 'refrigerated-air-dryer',
  'compressed-air-filters', 'heatless-air-dryer', 'water-chiller', 'air-receiver-tank', 'vacuum-pump', 'air-compressor-parts',
];
export const CATALOG: Product[] = ORDER.map((s) => PRODUCTS.find((p) => p.slug === s)!);
export const catalogIndex = (slug: string) => CATALOG.findIndex((p) => p.slug === slug);

/** filter chip labels for each group */
export const GROUP_LABEL: Record<Group, string> = {
  Reciprocating: 'Reciprocating', 'High pressure': 'High pressure / PET', Screw: 'Screw', 'Air treatment': 'Air treatment',
  Tanks: 'Tanks', Vacuum: 'Vacuum', Spares: 'Spares',
};

export interface Variant { chip: string; specs: [string, string][] }
const cfm = (hp: number, perHp: number) => `${Math.round(hp * perHp)} CFM`;
/**
 * Size options shown as chips on a product (pick one → the table updates).
 * Typical values for the size class — to be replaced with Parth's datasheets.
 */
export function variantsFor(p: Product): Variant[] {
  const hpChips = (list: number[], row: (hp: number) => [string, string][]) => list.map((hp, i) => ({ chip: i === 0 || i === list.length - 1 ? `${hp} HP` : String(hp), specs: row(hp) }));
  switch (p.model) {
    case 'screw': return hpChips([5, 10, 20, 30, 50, 75, 100], (hp) => [['Free air delivery', cfm(hp, 3.93)], ['Working pressure', '7.5 / 8.5 / 10 bar'], ['Noise level', `${hp <= 20 ? 65 : hp <= 50 ? 68 : 72} ± 3 dB(A)`], ['Drive', hp <= 20 ? 'Belt · IE3 motor' : 'Direct · IE3 motor']]);
    case 'two': return hpChips([2, 5, 7.5, 10, 15, 20, 30, 40], (hp) => [['Free air delivery', cfm(hp, 3.6)], ['Working pressure', '12 bar'], ['Receiver', `${hp <= 5 ? 220 : hp <= 15 ? 500 : 1000} L`], ['Cooling', 'Air cooled · intercooled']]);
    case 'single': return hpChips([1, 2, 3, 5, 10, 20], (hp) => [['Free air delivery', cfm(hp, 3.3)], ['Working pressure', '8 bar'], ['Receiver', `${hp <= 2 ? 90 : hp <= 5 ? 220 : 500} L`], ['Cooling', 'Air cooled']]);
    case 'duplex': return hpChips([30, 40, 50], (hp) => [['Free air delivery', `2 × ${Math.round(hp * 1.8)} CFM`], ['Pumps', '2, auto changeover'], ['Working pressure', '12 bar / 40 bar (PET)'], ['Duty', '24/7 with standby']]);
    case 'oilfree': return hpChips([1, 2, 3, 5, 10, 20], (hp) => [['Free air delivery', cfm(hp, 3)], ['Air quality', '100% oil free'], ['Working pressure', '8 bar'], ['Cooling', 'Air cooled']]);
    case 'pet': return hpChips([15, 25, 40, 50, 75], (hp) => [['Free air delivery', cfm(hp, 1.6)], ['Discharge pressure', '40 bar'], ['Stages', 'Multistage · intercooled'], ['Use', 'PET bottle blowing']]);
    case 'booster': return hpChips([10, 15, 20], (hp) => [['Boosted flow', cfm(hp, 6)], ['Output pressure', '40 bar'], ['Inlet', '7 – 10 bar plant air'], ['Cooling', 'Intercooled']]);
    case 'rdryer': return [20, 50, 100, 250, 500, 1000, 2500].map((c) => ({ chip: `${c} CFM`, specs: [['Rated flow', `${c} CFM`], ['Pressure dew point', '+3 °C'], ['Pressure drop', '< 0.2 bar'], ['Drain', 'Auto timer drain']] as [string, string][] }));
    case 'hdryer': return [10, 25, 50, 100, 200, 300].map((c) => ({ chip: `${c} CFM`, specs: [['Rated flow', `${c} CFM`], ['Dew point', 'Down to −40 °C'], ['Technology', 'PSA · twin tower'], ['Heat', 'None required']] as [string, string][] }));
    case 'filter': return [50, 100, 250, 500, 1000].map((c) => ({ chip: `${c} CFM`, specs: [['Rated flow', `${c} CFM`], ['Pre filter', '1 micron'], ['After filter', '0.01 micron · 0.01 ppm oil'], ['Drain', 'Auto / manual']] as [string, string][] }));
    case 'chiller': return [2, 5, 10, 20, 50, 100].map((c) => ({ chip: `${c} TR`, specs: [['Cooling capacity', `${c} TR`], ['Compressor', c <= 10 ? 'Scroll' : 'Scroll / reciprocating'], ['Control', 'Digital PID'], ['Duty', 'Round the clock']] as [string, string][] }));
    case 'tank': return [70, 220, 500, 1000, 2000, 5000, 25000].map((l) => ({ chip: `${l.toLocaleString('en-IN')} L`, specs: [['Capacity', `${l.toLocaleString('en-IN')} L`], ['Orientation', l <= 220 ? 'Horizontal / vertical' : 'Vertical'], ['Testing', 'Hydro-tested · certified'], ['Fittings', 'Safety valve · gauge · drain']] as [string, string][] }));
    case 'vacuum': return hpChips([1.5, 2, 3, 5, 7.5, 10], (hp) => [['Displacement', `${Math.round(hp * 95)} LPM`], ['Type', 'Reciprocating · oil lubricated'], ['Stages', hp <= 3 ? 'Single' : 'Single / two'], ['Duty', 'Continuous']]);
    default: return [{ chip: 'All makes', specs: p.specs }];
  }
}
/** the chip selected by default (the one shown in the concept image for the screw: 30 HP) */
export const defaultVariant = (p: Product) => { const v = variantsFor(p); return p.model === 'screw' ? 3 : Math.min(v.length - 1, Math.floor(v.length / 2)); };
