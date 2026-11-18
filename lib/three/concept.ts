// The Parth range as stylised 3D models — the same models used in the redesign concept images.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { filter as lineFilter } from './models';
import type { ModelKey } from '@/lib/products';

export const C = { red: 0xd7192a, blue: 0x1f45b8, navy: 0x0b1530, steel: 0x9aa4b2, iron: 0x3a414d, dark: 0x1b2230, white: 0xeef1f5, chrome: 0xd9dee6, cyan: 0x38bdf8 };
const std = (color: number, metalness: number, roughness: number) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
export const M = {
  red: std(C.red, 0.35, 0.32),
  blue: std(C.blue, 0.35, 0.35),
  steel: std(C.steel, 0.85, 0.28),
  iron: std(C.iron, 0.6, 0.55),
  dark: std(C.dark, 0.4, 0.5),
  white: std(C.white, 0.15, 0.35),
  chrome: std(C.chrome, 1, 0.12),
  glass: new THREE.MeshStandardMaterial({ color: 0x0f1a2e, metalness: 0.2, roughness: 0.05, emissive: 0x0a3d6b, emissiveIntensity: 0.6 }),
  green: new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.8 }),
};

const mesh = (g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; };
const cyl = (r: number, h: number, m: THREE.Material, seg = 40) => mesh(new THREE.CylinderGeometry(r, r, h, seg), m);

let badgeTex: THREE.CanvasTexture | null = null;
function badge() {
  if (badgeTex) return badgeTex;
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 160;
  const g = cv.getContext('2d')!;
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 512, 160);
  g.fillStyle = '#d7192a'; g.font = 'italic 900 104px Arial Black, Arial'; g.fillText('PARTH', 34, 112);
  g.fillStyle = '#1f45b8'; g.font = '700 26px Arial'; g.fillText('QUALITY AIR COMPRESSOR', 40, 148);
  badgeTex = new THREE.CanvasTexture(cv); badgeTex.colorSpace = THREE.SRGBColorSpace;
  return badgeTex;
}
const badgePlane = (w = 0.9) => mesh(new THREE.PlaneGeometry(w, w * 0.31), new THREE.MeshStandardMaterial({ map: badge(), roughness: 0.4 }));

/** receiver with dished ends; horizontal unless `vertical` */
export function tank({ len = 3.2, r = 0.62, vertical = false, mat = M.red as THREE.Material } = {}) {
  const g = new THREE.Group();
  const body = cyl(r, len, mat, 64);
  const capGeo = new THREE.SphereGeometry(r, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const c1 = mesh(capGeo, mat); c1.scale.y = 0.42; c1.position.y = len / 2;
  const c2 = mesh(capGeo, mat); c2.scale.y = -0.42; c2.position.y = -len / 2;
  g.add(body, c1, c2);
  for (const y of [-len / 2, len / 2]) { const s = mesh(new THREE.TorusGeometry(r + 0.004, 0.012, 8, 64), M.iron); s.rotation.x = Math.PI / 2; s.position.y = y; g.add(s); }
  const b = badgePlane(r * 1.25); b.position.set(0, 0, r + 0.005); g.add(b);
  if (!vertical) { g.rotation.z = Math.PI / 2; b.rotation.z = -Math.PI / 2; }
  const wrap = new THREE.Group(); wrap.add(g);
  const legH = vertical ? 0.45 : 0.32;
  const legs = vertical ? [[0.45, 0.45], [-0.45, 0.45], [0.45, -0.45], [-0.45, -0.45]] : [[len / 2 - 0.3, 0.4], [-len / 2 + 0.3, 0.4], [len / 2 - 0.3, -0.4], [-len / 2 + 0.3, -0.4]];
  const baseY = vertical ? -(len / 2 + r * 0.42) - legH / 2 : -r - legH / 2 + 0.06;
  const k = vertical ? (r / 0.62) * 0.8 : 1;
  for (const [x, z] of legs) {
    const l = mesh(new THREE.BoxGeometry(0.1, legH, 0.1), M.dark, x * k, baseY, z * k); wrap.add(l);
    wrap.add(mesh(new THREE.BoxGeometry(0.22, 0.03, 0.22), M.dark, l.position.x, baseY - legH / 2, l.position.z));
  }
  wrap.userData.floor = baseY - legH / 2;
  return wrap;
}

function finnedCylinder(h = 0.55, r = 0.17) {
  const g = new THREE.Group();
  g.add(cyl(r * 0.8, h, M.iron));
  for (let i = 0; i < 9; i++) { const f = cyl(r, 0.022, M.iron); f.position.y = -h / 2 + 0.06 + (i * (h - 0.1)) / 8; g.add(f); }
  const head = mesh(new RoundedBoxGeometry(r * 2.3, 0.12, r * 2.3, 3, 0.03), M.dark); head.position.y = h / 2 + 0.05; g.add(head);
  return g;
}

/** V-twin pump block + motor + belt guard */
export function pumpSet({ scale = 1 } = {}) {
  const g = new THREE.Group();
  const crank = mesh(new RoundedBoxGeometry(0.7, 0.42, 0.6, 4, 0.06), M.iron); crank.position.y = 0.21; g.add(crank);
  const c1 = finnedCylinder(); c1.position.set(-0.18, 0.62, 0); c1.rotation.z = 0.5; g.add(c1);
  const c2 = finnedCylinder(); c2.position.set(0.18, 0.62, 0); c2.rotation.z = -0.5; g.add(c2);
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.42, 0.92, 0), new THREE.Vector3(-0.3, 1.18, 0.18), new THREE.Vector3(0.3, 1.18, 0.18), new THREE.Vector3(0.42, 0.92, 0)]);
  g.add(mesh(new THREE.TubeGeometry(curve, 40, 0.035, 12), M.chrome));
  const fly = cyl(0.42, 0.08, M.dark); fly.rotation.x = Math.PI / 2; fly.position.set(0, 0.32, 0.38); g.add(fly);
  const guard = mesh(new RoundedBoxGeometry(1.9, 0.95, 0.16, 6, 0.07), M.red); guard.position.set(0.72, 0.36, 0.5); g.add(guard);
  const gb = badgePlane(0.7); gb.position.set(0.85, 0.42, 0.585); g.add(gb);
  const motor = new THREE.Group();
  const mb = cyl(0.3, 0.75, M.blue); mb.rotation.z = Math.PI / 2; motor.add(mb);
  for (let i = 0; i < 10; i++) { const fin = mesh(new THREE.BoxGeometry(0.7, 0.03, 0.03), M.blue); const a = (i / 10) * Math.PI * 2; fin.position.set(0, Math.cos(a) * 0.31, Math.sin(a) * 0.31); motor.add(fin); }
  const cap = cyl(0.24, 0.12, M.dark); cap.rotation.z = Math.PI / 2; cap.position.x = -0.43; motor.add(cap);
  const tb = mesh(new THREE.BoxGeometry(0.22, 0.14, 0.18), M.dark); tb.position.set(0, 0.33, 0); motor.add(tb);
  motor.position.set(1.45, 0.3, 0.05); g.add(motor);
  const gauge = cyl(0.11, 0.05, M.chrome); gauge.rotation.x = Math.PI / 2; gauge.position.set(-0.75, 0.35, 0.18); g.add(gauge);
  const face = mesh(new THREE.CircleGeometry(0.09, 32), M.white); face.position.set(-0.75, 0.35, 0.207); g.add(face);
  const needle = mesh(new THREE.BoxGeometry(0.07, 0.008, 0.002), new THREE.MeshBasicMaterial({ color: C.red })); needle.position.set(-0.74, 0.36, 0.21); needle.rotation.z = 0.6; g.add(needle);
  g.scale.setScalar(scale);
  return g;
}

export function recipCompressor({ duplex = false, len = 3.2, mat = M.red as THREE.Material, r = 0.62 } = {}) {
  const g = new THREE.Group();
  const t = tank({ len, r, mat }); g.add(t);
  const p = pumpSet(); p.position.set(duplex ? -0.95 : -0.55, 0.55, -0.05); g.add(p);
  if (duplex) { const p2 = pumpSet(); p2.position.set(0.85, 0.55, -0.05); p2.scale.setScalar(0.9); g.add(p2); }
  const v = cyl(0.06, 0.25, M.chrome); v.rotation.z = Math.PI / 2; v.position.set(-len / 2 - 0.35, -0.1, 0); g.add(v);
  g.userData.floor = t.userData.floor;
  g.userData.outlet = new THREE.Vector3(-len / 2 - 0.5, -0.1, 0);
  return g;
}

function vents(g: THREE.Group, w: number, h: number, x: number, y: number, z: number, rows = 7) {
  for (let i = 0; i < rows; i++) g.add(mesh(new THREE.BoxGeometry(w, 0.025, 0.02), M.dark, x, y - h / 2 + (i + 0.5) * (h / rows), z));
}
export function screwCompressor() {
  const g = new THREE.Group();
  const body = mesh(new RoundedBoxGeometry(2.2, 1.9, 1.3, 6, 0.08), M.white); body.position.y = 0.95; g.add(body);
  const roof = mesh(new RoundedBoxGeometry(2.24, 0.16, 1.34, 4, 0.05), M.blue); roof.position.y = 1.92; g.add(roof);
  const base = mesh(new RoundedBoxGeometry(2.3, 0.14, 1.4, 3, 0.04), M.dark); base.position.y = 0.05; g.add(base);
  const stripe = mesh(new THREE.BoxGeometry(2.21, 0.09, 1.31), M.red); stripe.position.y = 0.32; g.add(stripe);
  vents(g, 0.8, 0.9, 0.55, 1.05, 0.66);
  const panel = mesh(new RoundedBoxGeometry(0.62, 0.48, 0.05, 3, 0.02), M.dark); panel.position.set(-0.55, 1.35, 0.66); g.add(panel);
  const screen = mesh(new THREE.PlaneGeometry(0.46, 0.26), M.glass); screen.position.set(-0.55, 1.4, 0.69); g.add(screen);
  for (let i = 0; i < 3; i++) { const b = cyl(0.03, 0.03, i === 0 ? M.green : M.red); b.rotation.x = Math.PI / 2; b.position.set(-0.7 + i * 0.15, 1.2, 0.69); g.add(b); }
  const bp = badgePlane(0.62); bp.position.set(-0.55, 0.75, 0.66); g.add(bp);
  for (let i = 0; i < 7; i++) g.add(mesh(new THREE.BoxGeometry(0.02, 0.025, 0.9), M.dark, 1.105, 0.65 + i * 0.13, 0));
  g.userData.floor = -0.02;
  return g;
}
export function dryer() {
  const g = new THREE.Group();
  const body = mesh(new RoundedBoxGeometry(0.9, 1.3, 1.0, 6, 0.06), M.blue); body.position.y = 0.65; g.add(body);
  const top = mesh(new RoundedBoxGeometry(0.92, 0.1, 1.02, 3, 0.03), M.white); top.position.y = 1.32; g.add(top);
  const grill = mesh(new THREE.CircleGeometry(0.28, 40), M.dark); grill.position.set(0, 0.62, 0.505); g.add(grill);
  for (let i = 1; i < 5; i++) { const r = mesh(new THREE.TorusGeometry(i * 0.065, 0.008, 6, 40), M.steel); r.position.set(0, 0.62, 0.51); g.add(r); }
  const disp = mesh(new THREE.PlaneGeometry(0.34, 0.14), M.glass); disp.position.set(0, 1.08, 0.505); g.add(disp);
  for (const x of [-0.25, 0.25]) { const p = cyl(0.05, 0.4, M.chrome); p.position.set(x, 1.5, 0.2); g.add(p); }
  return g;
}
export function chiller() {
  const g = new THREE.Group();
  const body = mesh(new RoundedBoxGeometry(2.2, 1.2, 1.1, 6, 0.06), M.white); body.position.y = 0.6; g.add(body);
  const top = mesh(new RoundedBoxGeometry(2.22, 0.12, 1.12, 3, 0.03), M.blue); top.position.y = 1.22; g.add(top);
  for (const x of [-0.55, 0.55]) {
    const ring = cyl(0.42, 0.1, M.dark); ring.position.set(x, 1.32, 0); g.add(ring);
    for (let b = 0; b < 4; b++) { const blade = mesh(new THREE.BoxGeometry(0.7, 0.015, 0.14), M.steel); blade.position.set(x, 1.38, 0); blade.rotation.y = b * Math.PI / 4 + 0.3; g.add(blade); }
  }
  vents(g, 1.0, 0.7, 0.45, 0.6, 0.555);
  const panel = mesh(new THREE.PlaneGeometry(0.42, 0.3), M.glass); panel.position.set(-0.6, 0.75, 0.555); g.add(panel);
  const bp = badgePlane(0.5); bp.position.set(-0.6, 0.35, 0.556); g.add(bp);
  return g;
}
export function vacuumPump() {
  const g = new THREE.Group();
  const base = mesh(new RoundedBoxGeometry(1.8, 0.1, 0.9, 3, 0.03), M.dark); base.position.y = 0.05; g.add(base);
  const p = pumpSet({ scale: 0.95 }); p.position.set(-0.45, 0.1, -0.05); g.add(p);
  return g;
}
export function boosterCompressor() {
  const g = new THREE.Group();
  const base = mesh(new RoundedBoxGeometry(2.2, 0.16, 1.1, 3, 0.04), M.dark); base.position.y = 0.08; g.add(base);
  const p = pumpSet(); p.position.set(-0.5, 0.16, -0.05); g.add(p);
  const vessel = tank({ len: 0.9, r: 0.22, vertical: true, mat: M.blue }); vessel.position.set(-0.95, 0.85, -0.25); vessel.scale.setScalar(0.9); g.add(vessel);
  return g;
}
/** a spares kit laid out for display: crankshaft, piston + rod, valve plates, filter element, V-belt, gasket */
export function parts() {
  const g = new THREE.Group();
  // crankshaft (back, raised on two V-blocks)
  const cs = new THREE.Group();
  const s1 = cyl(0.09, 1.7, M.chrome); s1.rotation.z = Math.PI / 2; cs.add(s1);
  for (const x of [-0.28, 0.28]) { const w = mesh(new RoundedBoxGeometry(0.12, 0.5, 0.3, 3, 0.04), M.iron); w.position.set(x, 0.1, 0); cs.add(w); }
  const pin = cyl(0.08, 0.5, M.chrome); pin.rotation.z = Math.PI / 2; pin.position.y = 0.26; cs.add(pin);
  const fw = cyl(0.3, 0.1, M.dark); fw.rotation.z = Math.PI / 2; fw.position.x = 0.95; cs.add(fw);
  cs.position.set(0, 0.42, -0.55); g.add(cs);
  for (const x of [-0.6, 0.6]) g.add(mesh(new RoundedBoxGeometry(0.22, 0.28, 0.3, 2, 0.03), M.dark, x, 0.14, -0.55));
  // piston with three rings + connecting rod (front left)
  const pis = cyl(0.3, 0.42, M.steel); pis.position.set(-0.95, 0.21, 0.45); g.add(pis);
  for (let i = 0; i < 3; i++) { const r = mesh(new THREE.TorusGeometry(0.302, 0.012, 6, 48), M.dark); r.rotation.x = Math.PI / 2; r.position.set(-0.95, 0.3 + i * 0.05, 0.45); g.add(r); }
  const rod = mesh(new RoundedBoxGeometry(0.12, 0.08, 0.95, 2, 0.03), M.iron); rod.position.set(-0.55, 0.05, 0.5); rod.rotation.y = 0.9; g.add(rod);
  const big = cyl(0.13, 0.09, M.iron); big.position.set(-0.2, 0.05, 0.75); g.add(big);
  // valve plates (stacked discs, front centre)
  for (let i = 0; i < 2; i++) {
    const vp = cyl(0.36, 0.05, M.chrome); vp.position.set(0.15, 0.03 + i * 0.07, 0.6); vp.rotation.y = i * 0.4; g.add(vp);
    for (let k = 0; k < 6; k++) { const h = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.052, 16), M.dark); const a = (k / 6) * Math.PI * 2; h.position.set(0.15 + Math.cos(a) * 0.2, 0.031 + i * 0.07, 0.6 + Math.sin(a) * 0.2); g.add(h); }
  }
  // pleated filter element (right)
  const fe = new THREE.Group();
  fe.add(cyl(0.3, 0.75, M.blue, 48));
  for (let k = 0; k < 24; k++) { const r = mesh(new THREE.BoxGeometry(0.03, 0.7, 0.06), M.white); const a = (k / 24) * Math.PI * 2; r.position.set(Math.cos(a) * 0.3, 0, Math.sin(a) * 0.3); r.rotation.y = -a; fe.add(r); }
  for (const y of [-0.39, 0.39]) fe.add(mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.05, 48), M.dark, 0, y, 0));
  fe.position.set(1.0, 0.41, 0.25); g.add(fe);
  // V-belt and gasket lying flat (front right)
  const belt = mesh(new THREE.TorusGeometry(0.32, 0.035, 10, 64), M.dark); belt.rotation.x = Math.PI / 2; belt.scale.set(1.35, 1, 1); belt.position.set(0.95, 0.035, 0.95); g.add(belt);
  const gasket = mesh(new THREE.TorusGeometry(0.22, 0.02, 8, 48), M.red); gasket.rotation.x = Math.PI / 2; gasket.position.set(-0.55, 0.02, 1.05); g.add(gasket);
  return g;
}
export function heatlessDryer() {
  const g = new THREE.Group();
  const a = tank({ len: 1.4, r: 0.28, vertical: true, mat: M.blue }); a.position.x = -0.35;
  const b = tank({ len: 1.4, r: 0.28, vertical: true, mat: M.blue }); b.position.x = 0.35;
  g.add(a, b);
  return g;
}

/** the 3D model for a product, as in the concept images */
export function conceptModel(key: ModelKey): THREE.Group {
  switch (key) {
    case 'single': return recipCompressor({ len: 2.3, r: 0.5 });
    case 'two': return recipCompressor({ len: 3.0 });
    case 'duplex': return recipCompressor({ duplex: true, len: 3.6 });
    case 'oilfree': return recipCompressor({ len: 2.6, mat: M.blue });
    case 'pet': case 'booster': return boosterCompressor();
    case 'screw': return screwCompressor();
    case 'rdryer': return dryer();
    case 'hdryer': return heatlessDryer();
    case 'chiller': return chiller();
    case 'tank': return tank({ len: 2.2, r: 0.55, vertical: true });
    case 'vacuum': return vacuumPump();
    case 'parts': return parts();
    case 'filter': return lineFilter();
  }
}

/** drop on the floor (y = 0), centre on X/Z, return the size */
export function fitToFloor(obj: THREE.Object3D) {
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  obj.position.y -= box.min.y;
  const c = box.getCenter(new THREE.Vector3());
  obj.position.x -= c.x; obj.position.z -= c.z;
  return box.getSize(new THREE.Vector3());
}

/** glowing air stream along a curve; `userData.tick(t)` makes the particles flow */
export function airStream(points: THREE.Vector3[], { color = C.cyan, radius = 0.025, opacity = 0.9, additive = true, count = 60 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points);
  const g = new THREE.Group();
  const blending = additive ? THREE.AdditiveBlending : THREE.NormalBlending;
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 120, radius, 8), new THREE.MeshBasicMaterial({ color, transparent: true, opacity })));
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 120, radius * 3.5, 8), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: additive ? 0.12 : 0.22, blending, depthWrite: false })));
  const pos = new Float32Array(count * 3); const off = Array.from({ length: count }, () => Math.random());
  const jit = Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 0.08);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: additive ? 0xffffff : color, size: 0.035, transparent: true, opacity: 0.9, blending, depthWrite: false })));
  const v = new THREE.Vector3();
  g.userData.tick = (t: number, speed = 0.06) => {
    for (let i = 0; i < count; i++) { curve.getPointAt((off[i] + t * speed) % 1, v); pos[i * 3] = v.x + jit[i * 3]; pos[i * 3 + 1] = v.y + jit[i * 3 + 1]; pos[i * 3 + 2] = v.z + jit[i * 3 + 2]; }
    geo.attributes.position.needsUpdate = true;
  };
  g.userData.tick(0);
  return g;
}

/** hotspots shown on the product turntable (model-local positions) */
export const HOTSPOTS: Partial<Record<ModelKey, [THREE.Vector3, string][]>> = {
  screw: [[new THREE.Vector3(-0.55, 1.4, 0.66), 'Smart controller'], [new THREE.Vector3(0.55, 1.05, 0.66), 'Low-noise enclosure'], [new THREE.Vector3(1.1, 0.9, 0), 'Air-end & cooler'], [new THREE.Vector3(0, 0.32, 0.66), '24/7 duty frame']],
  two: [[new THREE.Vector3(-0.55, 1.75, 0), 'Cast-iron pump block'], [new THREE.Vector3(-0.55, 2.05, 0.18), 'Intercooler'], [new THREE.Vector3(0.9, 1.0, 0.6), 'Belt guard'], [new THREE.Vector3(0.6, -0.1, 0.62), 'Hydro-tested receiver']],
  single: [[new THREE.Vector3(-0.55, 1.6, 0), 'Cast-iron pump'], [new THREE.Vector3(0.9, 0.95, 0.6), 'Belt guard'], [new THREE.Vector3(0.4, -0.1, 0.5), 'Receiver tank']],
  duplex: [[new THREE.Vector3(-0.95, 1.75, 0), 'Pump 1'], [new THREE.Vector3(0.85, 1.65, 0), 'Pump 2 · standby'], [new THREE.Vector3(0, -0.1, 0.62), 'Shared receiver']],
  oilfree: [[new THREE.Vector3(-0.55, 1.75, 0), 'Oil-free pump'], [new THREE.Vector3(0.9, 1.0, 0.6), 'Belt guard'], [new THREE.Vector3(0.4, -0.1, 0.62), 'Receiver tank']],
  pet: [[new THREE.Vector3(-0.5, 1.2, 0), '40 bar multistage pump'], [new THREE.Vector3(-0.95, 1.4, -0.25), 'High-pressure vessel'], [new THREE.Vector3(0.95, 0.5, 0.05), 'IE3 motor']],
  booster: [[new THREE.Vector3(-0.5, 1.2, 0), 'Booster pump'], [new THREE.Vector3(-0.95, 1.4, -0.25), 'Pressure vessel'], [new THREE.Vector3(0.95, 0.5, 0.05), 'Motor']],
  rdryer: [[new THREE.Vector3(0, 1.08, 0.5), 'Dew point display'], [new THREE.Vector3(0, 0.62, 0.5), 'Condenser fan'], [new THREE.Vector3(0.25, 1.65, 0.2), 'Air in / out']],
  hdryer: [[new THREE.Vector3(-0.35, 1.2, 0.28), 'Tower A'], [new THREE.Vector3(0.35, 1.2, 0.28), 'Tower B'], [new THREE.Vector3(0, 0.3, 0.3), 'Twin-tower PSA']],
  chiller: [[new THREE.Vector3(-0.55, 1.35, 0), 'Condenser fans'], [new THREE.Vector3(-0.6, 0.75, 0.55), 'Digital PID control'], [new THREE.Vector3(0.45, 0.6, 0.55), 'Scroll compressor']],
  tank: [[new THREE.Vector3(0, 0.3, 0.55), 'Hydro-tested shell'], [new THREE.Vector3(0, 1.55, 0.3), 'Dished ends'], [new THREE.Vector3(0.35, -1.5, 0.35), 'Rigid legs']],
  vacuum: [[new THREE.Vector3(-0.45, 1.2, 0), 'Reciprocating pump'], [new THREE.Vector3(0.95, 0.45, 0.05), 'Motor'], [new THREE.Vector3(0, 0.08, 0.4), 'Common base']],
  parts: [[new THREE.Vector3(0, 0.95, -0.55), 'Crankshaft'], [new THREE.Vector3(-0.95, 0.45, 0.45), 'Piston & rings'], [new THREE.Vector3(0.15, 0.12, 0.6), 'Valve plates'], [new THREE.Vector3(1.0, 0.85, 0.25), 'Filter element']],
  filter: [[new THREE.Vector3(0, 1.32, 0.2), 'Filter head'], [new THREE.Vector3(0, 0.8, 0.18), 'Element bowl'], [new THREE.Vector3(0, 0.05, 0.05), 'Auto drain']],
};
