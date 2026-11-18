# Parth Air Compressor — website (indiacompressor.com)

Next.js 15 (App Router) · Tailwind v4 · Three.js · GSAP ScrollTrigger · Lenis. Light theme by default (toggle in the navbar, remembered per visitor).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Pages
- `/` — 3D hero, **complete compressed air system** (scroll follows the air: screw compressor → receiver → pre filter → refrigerated dryer → after filter), products, "Inside a Parth" exploded view, industries, export globe.
- `/products`, `/products/[slug]` — 14 products, interactive 3D model per product. The **screw compressor** page carries the client's idea: "Need clean, dry air? Add the complete system" + a system sizer that suggests receiver / dryer / filter sizes and sends the list on WhatsApp.
- `/solutions/complete-compressed-air-system`, `/about`, `/contact` (form opens WhatsApp / email — no backend).

## Where to edit content
- Company details, nav, stats, industries, export countries: `lib/site.ts`
- Products, specs, system steps: `lib/products.ts`
- 3D models (stylised, built in code): `lib/three/models.ts`

## Confirm with the client before going live
- Spec values in `lib/products.ts` (pressures, CFM ranges, dew point) and sizer rules in `components/sections/SystemSizer.tsx` are typical values, not Parth datasheets.
- About page milestones (years) are placeholders.
- Stats (25+ years, 1,00,000+ installations, 9 countries) and the export country list.
- Real product photos or CAD/GLB models can replace the stylised 3D models later.
