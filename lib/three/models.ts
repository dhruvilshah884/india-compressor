// Stylised 3D models of the Parth range, built from primitives (no downloads, loads instantly).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { ModelKey } from '@/lib/products';

const std = (color: number, metalness = 0.35, roughness = 0.38) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
export const MAT = {
  red: std(0xd7192a, 0.3, 0.32),
  blue: std(0x1f5fd6, 0.3, 0.32),
  navy: std(0x1f45b8, 0.35, 0.35),
  yellow: std(0xf5a623, 0.25, 0.35),
  charcoal: std(0x3b4250, 0.45, 0.45),
  steel: std(0x9aa4b2, 0.85, 0.28),
  iron: std(0x3a414d, 0.6, 0.55),
  dark: std(0x1b2230, 0.4, 0.5),
  white: std(0xeef1f5, 0.12, 0.35),
  chrome: std(0xd9dee6, 1, 0.12),
  glass: new THREE.MeshStandardMaterial({ color: 0x0f1a2e, metalness: 0.2, roughness: 0.05, emissive: 0x0a3d6b, emissiveIntensity: 0.6 }),
  green: new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.9 }),
};

function mesh(g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o;
}
const cyl = (r: number, h: number, m: THREE.Material, seg = 40) => mesh(new THREE.CylinderGeometry(r, r, h, seg), m);
const rbox = (w: number, h: number, d: number, r: number, m: THREE.Material) => mesh(new RoundedBoxGeometry(w, h, d, 4, r), m);

let badgeTex: THREE.CanvasTexture | null = null;
function badge(sub = 'QUALITY AIR COMPRESSOR') {
  if (badgeTex && sub === 'QUALITY AIR COMPRESSOR') return badgeTex;
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 160;
  const g = cv.getContext('2d')!;
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 512, 160);
  g.fillStyle = '#1f45b8'; g.beginPath(); g.arc(62, 72, 44, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 7; g.beginPath(); g.moveTo(24, 82); g.quadraticCurveTo(62, 48, 104, 70); g.stroke();
  g.fillStyle = '#d7192a'; g.font = 'italic 900 88px Arial Black, Arial'; g.fillText('PARTH', 122, 104);
  g.fillStyle = '#1f45b8'; g.font = '700 22px Arial'; g.fillText(sub, 126, 140);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (sub === 'QUALITY AIR COMPRESSOR') badgeTex = t;
  return t;
}
const badgePlane = (w = 0.9, sub?: string) => mesh(new THREE.PlaneGeometry(w, w * 0.31), new THREE.MeshStandardMaterial({ map: badge(sub), roughness: 0.4 }));

/** receiver tank with dished ends. Horizontal tanks lie along X. */
export function tank({ len = 3.2, r = 0.62, vertical = false, mat = MAT.red as THREE.Material } = {}) {
  const g = new THREE.Group();
  g.add(cyl(r, len, mat, 64));
  const capGeo = new THREE.SphereGeometry(r, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const c1 = mesh(capGeo, mat); c1.scale.y = 0.42; c1.position.y = len / 2;
  const c2 = mesh(capGeo, mat); c2.scale.y = -0.42; c2.position.y = -len / 2;
  g.add(c1, c2);
  for (const y of [-len / 2, len / 2]) { const s = mesh(new THREE.TorusGeometry(r + 0.004, 0.012, 8, 64), MAT.iron); s.rotation.x = Math.PI / 2; s.position.y = y; g.add(s); }
  const b = badgePlane(r * 1.25); b.position.set(0, vertical ? len * 0.15 : 0, r + 0.005); g.add(b);
  if (!vertical) { g.rotation.z = Math.PI / 2; b.rotation.z = -Math.PI / 2; }
  const wrap = new THREE.Group(); wrap.add(g);
  if (vertical) {
    // lifting lug + top nozzle + side outlet + gauge
    const lug = mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 24, Math.PI), MAT.dark); lug.position.y = len / 2 + r * 0.42; wrap.add(lug);
    const side = cyl(0.06, 0.3, MAT.chrome); side.rotation.z = Math.PI / 2; side.position.set(r + 0.12, len * 0.38, 0); wrap.add(side);
    const g2 = cyl(0.09, 0.04, MAT.chrome); g2.rotation.x = Math.PI / 2; g2.position.set(-r * 0.55, len * 0.3, r * 0.82); wrap.add(g2);
    // skirt base
    const skirt = mesh(new THREE.CylinderGeometry(r * 0.75, r * 0.85, 0.36, 48, 1, true), MAT.dark); skirt.position.y = -len / 2 - r * 0.3; wrap.add(skirt);
    const ring = cyl(r * 0.9, 0.04, MAT.dark); ring.position.y = -len / 2 - r * 0.48; wrap.add(ring);
  } else {
    const legH = 0.32, baseY = -r - legH / 2 + 0.06;
    for (const [x, z] of [[len / 2 - 0.3, 0.4], [-len / 2 + 0.3, 0.4], [len / 2 - 0.3, -0.4], [-len / 2 + 0.3, -0.4]]) {
      wrap.add(mesh(new THREE.BoxGeometry(0.1, legH, 0.1), MAT.dark, x, baseY, z));
      wrap.add(mesh(new THREE.BoxGeometry(0.22, 0.03, 0.22), MAT.dark, x, baseY - legH / 2, z));
    }
  }
  return wrap;
}

function finnedCylinder(h = 0.55, r = 0.17) {
  const g = new THREE.Group();
  g.add(cyl(r * 0.8, h, MAT.iron));
  for (let i = 0; i < 9; i++) { const f = cyl(r, 0.022, MAT.iron); f.position.y = -h / 2 + 0.06 + (i * (h - 0.1)) / 8; g.add(f); }
  const head = rbox(r * 2.3, 0.12, r * 2.3, 0.03, MAT.dark); head.position.y = h / 2 + 0.05; g.add(head);
  return g;
}

/** V-twin pump, motor and belt guard */
export function pumpSet(scale = 1) {
  const g = new THREE.Group();
  const crank = rbox(0.7, 0.42, 0.6, 0.06, MAT.iron); crank.position.y = 0.21; g.add(crank);
  const c1 = finnedCylinder(); c1.position.set(-0.18, 0.62, 0); c1.rotation.z = 0.5; g.add(c1);
  const c2 = finnedCylinder(); c2.position.set(0.18, 0.62, 0); c2.rotation.z = -0.5; g.add(c2);
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.42, 0.92, 0), new THREE.Vector3(-0.3, 1.18, 0.18), new THREE.Vector3(0.3, 1.18, 0.18), new THREE.Vector3(0.42, 0.92, 0)]);
  g.add(mesh(new THREE.TubeGeometry(curve, 40, 0.035, 12), MAT.chrome));
  const fly = cyl(0.42, 0.08, MAT.dark); fly.rotation.x = Math.PI / 2; fly.position.set(0, 0.32, 0.38); g.add(fly);
  const guard = rbox(1.9, 0.95, 0.16, 0.07, MAT.red); guard.position.set(0.72, 0.36, 0.5); g.add(guard);
  const gb = badgePlane(0.7); gb.position.set(0.85, 0.42, 0.585); g.add(gb);
  const motor = new THREE.Group();
  const mb = cyl(0.3, 0.75, MAT.navy); mb.rotation.z = Math.PI / 2; motor.add(mb);
  for (let i = 0; i < 10; i++) { const fin = mesh(new THREE.BoxGeometry(0.7, 0.03, 0.03), MAT.navy); const a = (i / 10) * Math.PI * 2; fin.position.set(0, Math.cos(a) * 0.31, Math.sin(a) * 0.31); motor.add(fin); }
  const cap = cyl(0.24, 0.12, MAT.dark); cap.rotation.z = Math.PI / 2; cap.position.x = -0.43; motor.add(cap);
  motor.position.set(1.45, 0.3, 0.05); g.add(motor);
  const gauge = cyl(0.11, 0.05, MAT.chrome); gauge.rotation.x = Math.PI / 2; gauge.position.set(-0.75, 0.35, 0.18); g.add(gauge);
  const face = mesh(new THREE.CircleGeometry(0.09, 32), MAT.white); face.position.set(-0.75, 0.35, 0.207); g.add(face);
  g.scale.setScalar(scale);
  return g;
}

export function recipCompressor({ duplex = false, len = 3.2, mat = MAT.red as THREE.Material, r = 0.62 } = {}) {
  const g = new THREE.Group();
  g.add(tank({ len, r, mat }));
  const p = pumpSet(); p.position.set(duplex ? -0.95 : -0.55, 0.55, -0.05); g.add(p);
  if (duplex) { const p2 = pumpSet(0.9); p2.position.set(0.85, 0.55, -0.05); g.add(p2); }
  const v = cyl(0.06, 0.25, MAT.chrome); v.rotation.z = Math.PI / 2; v.position.set(-len / 2 - 0.35, -0.1, 0); g.add(v);
  g.userData.outlet = new THREE.Vector3(-len / 2 - 0.5, -0.1, 0);
  return g;
}

function vents(g: THREE.Group, w: number, h: number, x: number, y: number, z: number, rows = 7) {
  for (let i = 0; i < rows; i++) g.add(mesh(new THREE.BoxGeometry(w, 0.025, 0.02), MAT.dark, x, y - h / 2 + (i + 0.5) * (h / rows), z));
}

/** screw compressor in Parth colours: charcoal cabinet, yellow front door, controller */
export function screwCompressor() {
  const g = new THREE.Group();
  const body = rbox(2.2, 1.9, 1.3, 0.06, MAT.charcoal); body.position.y = 0.95; g.add(body);
  const door = rbox(0.9, 1.62, 0.06, 0.03, MAT.yellow); door.position.set(-0.55, 0.92, 0.66); g.add(door);
  const top = rbox(2.24, 0.06, 1.34, 0.02, MAT.yellow); top.position.y = 1.92; g.add(top);
  const base = rbox(2.3, 0.14, 1.4, 0.04, MAT.dark); base.position.y = 0.05; g.add(base);
  // controller on the right door
  const panel = rbox(0.62, 0.42, 0.05, 0.02, MAT.dark); panel.position.set(0.5, 1.45, 0.66); g.add(panel);
  const screen = mesh(new THREE.PlaneGeometry(0.4, 0.22), MAT.glass); screen.position.set(0.45, 1.48, 0.69); g.add(screen);
  const led = cyl(0.03, 0.03, MAT.green); led.rotation.x = Math.PI / 2; led.position.set(0.72, 1.52, 0.69); g.add(led);
  const estop = cyl(0.05, 0.05, MAT.red); estop.rotation.x = Math.PI / 2; estop.position.set(0.72, 1.36, 0.69); g.add(estop);
  vents(g, 0.7, 0.75, 0.5, 0.75, 0.66, 8);
  const bp = badgePlane(0.7); bp.position.set(-0.55, 0.62, 0.695); g.add(bp);
  // door handles + side grill
  for (const y of [1.25, 0.6]) g.add(mesh(new THREE.BoxGeometry(0.04, 0.16, 0.04), MAT.chrome, -0.94, y, 0.7));
  for (let i = 0; i < 8; i++) g.add(mesh(new THREE.BoxGeometry(0.02, 0.025, 0.9), MAT.dark, 1.105, 0.55 + i * 0.13, 0));
  // outlet pipe on the side, towards the receiver
  const out = cyl(0.07, 0.36, MAT.chrome); out.rotation.z = Math.PI / 2; out.position.set(1.25, 0.32, 0); g.add(out);
  g.userData.outlet = new THREE.Vector3(1.45, 0.32, 0);
  return g;
}

/** refrigerated dryer: white cabinet in a blue frame */
export function dryer() {
  const g = new THREE.Group();
  const frame = rbox(1.15, 1.5, 1.05, 0.04, MAT.navy); frame.position.y = 0.75; g.add(frame);
  const face = rbox(0.98, 1.32, 0.04, 0.02, MAT.white); face.position.set(0, 0.76, 0.53); g.add(face);
  const disp = rbox(0.22, 0.16, 0.03, 0.01, MAT.white); disp.position.set(0, 1.18, 0.56); g.add(disp);
  const dscr = mesh(new THREE.PlaneGeometry(0.16, 0.06), MAT.glass); dscr.position.set(0, 1.2, 0.58); g.add(dscr);
  const sw = cyl(0.045, 0.04, MAT.red); sw.rotation.x = Math.PI / 2; sw.position.set(0, 1.03, 0.57); g.add(sw);
  for (const x of [-0.06, 0.06]) { const b = cyl(0.025, 0.03, MAT.red); b.rotation.x = Math.PI / 2; b.position.set(x, 0.93, 0.57); g.add(b); }
  const bp = badgePlane(0.62, 'REFRIGERATED AIR DRYER'); bp.position.set(0, 0.62, 0.556); g.add(bp);
  for (let i = 0; i < 10; i++) g.add(mesh(new THREE.BoxGeometry(0.02, 0.6, 0.02), MAT.dark, -0.4 + i * 0.03, 0.45, 0.535)); // left grill
  for (const x of [-0.6, 0.6]) { const p = cyl(0.06, 0.3, MAT.chrome); p.rotation.z = Math.PI / 2; p.position.set(x * 1.07, 1.3, 0); g.add(p); }
  return g;
}

/** line filter: red bowl, black head, drain */
export function filter() {
  const g = new THREE.Group();
  const head = rbox(0.42, 0.22, 0.42, 0.04, MAT.dark); head.position.y = 1.32; g.add(head);
  const cap = cyl(0.17, 0.08, MAT.dark); cap.position.y = 1.47; g.add(cap);
  const bowl = cyl(0.17, 1.0, MAT.red); bowl.position.y = 0.72; g.add(bowl);
  const bottom = mesh(new THREE.SphereGeometry(0.17, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), MAT.red); bottom.position.y = 0.22; g.add(bottom);
  for (let i = 0; i < 4; i++) { const r = mesh(new THREE.TorusGeometry(0.172, 0.006, 6, 32), MAT.dark); r.rotation.x = Math.PI / 2; r.position.y = 0.5 + i * 0.12; g.add(r); }
  const drain = cyl(0.03, 0.14, MAT.chrome); drain.position.y = 0.04; g.add(drain);
  for (const x of [-0.32, 0.32]) { const p = cyl(0.06, 0.24, MAT.chrome); p.rotation.z = Math.PI / 2; p.position.set(x, 1.32, 0); g.add(p); }
  const lbl = mesh(new THREE.PlaneGeometry(0.12, 0.5), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })); lbl.position.set(0, 0.8, 0.172); g.add(lbl);
  return g;
}

export function chiller() {
  const g = new THREE.Group();
  const body = rbox(2.2, 1.2, 1.1, 0.06, MAT.white); body.position.y = 0.6; g.add(body);
  const top = rbox(2.22, 0.12, 1.12, 0.03, MAT.navy); top.position.y = 1.22; g.add(top);
  for (const x of [-0.55, 0.55]) {
    const ring = cyl(0.42, 0.1, MAT.dark); ring.position.set(x, 1.32, 0); g.add(ring);
    for (let b = 0; b < 4; b++) { const blade = mesh(new THREE.BoxGeometry(0.7, 0.015, 0.14), MAT.steel); blade.position.set(x, 1.38, 0); blade.rotation.y = b * Math.PI / 4 + 0.3; blade.name = 'blade'; g.add(blade); }
  }
  vents(g, 1.0, 0.7, 0.45, 0.6, 0.555);
  const panel = mesh(new THREE.PlaneGeometry(0.42, 0.3), MAT.glass); panel.position.set(-0.6, 0.75, 0.555); g.add(panel);
  const bp = badgePlane(0.5); bp.position.set(-0.6, 0.35, 0.556); g.add(bp);
  return g;
}

export function boosterCompressor() {
  const g = new THREE.Group();
  const base = rbox(2.2, 0.16, 1.1, 0.04, MAT.dark); base.position.y = 0.08; g.add(base);
  const p = pumpSet(); p.position.set(-0.5, 0.16, -0.05); g.add(p);
  const vessel = tank({ len: 0.9, r: 0.22, vertical: true, mat: MAT.navy }); vessel.position.set(-0.95, 0.9, -0.25); vessel.scale.setScalar(0.9); g.add(vessel);
  return g;
}

export function vacuumPump() {
  const g = new THREE.Group();
  const base = rbox(1.8, 0.1, 0.9, 0.03, MAT.dark); base.position.y = 0.05; g.add(base);
  const p = pumpSet(0.95); p.position.set(-0.45, 0.1, -0.05); g.add(p);
  return g;
}

export function parts() {
  const g = new THREE.Group();
  const cs = new THREE.Group();
  const s1 = cyl(0.07, 0.9, MAT.chrome); s1.rotation.z = Math.PI / 2; cs.add(s1);
  for (const x of [-0.2, 0.2]) { const w = rbox(0.08, 0.36, 0.2, 0.03, MAT.iron); w.position.set(x, 0.08, 0); cs.add(w); }
  const pin = cyl(0.06, 0.4, MAT.chrome); pin.rotation.z = Math.PI / 2; pin.position.y = 0.2; cs.add(pin);
  cs.position.set(0, 0.35, 0); g.add(cs);
  const pis = cyl(0.2, 0.3, MAT.steel); pis.position.set(-0.75, 0.3, 0.2); g.add(pis);
  for (let i = 0; i < 3; i++) { const r = mesh(new THREE.TorusGeometry(0.202, 0.008, 6, 40), MAT.dark); r.rotation.x = Math.PI / 2; r.position.set(-0.75, 0.38 + i * 0.04, 0.2); g.add(r); }
  const vp = cyl(0.26, 0.05, MAT.chrome); vp.position.set(0.8, 0.1, 0.25); g.add(vp);
  const fl = filter(); fl.scale.setScalar(0.45); fl.position.set(0.75, 0, -0.35); g.add(fl);
  return g;
}

export function heatlessDryer() {
  const g = new THREE.Group();
  for (const x of [-0.35, 0.35]) { const t = tank({ len: 1.4, r: 0.28, vertical: true, mat: MAT.navy }); t.position.x = x; g.add(t); }
  const manifold = cyl(0.05, 0.9, MAT.chrome); manifold.rotation.z = Math.PI / 2; manifold.position.y = 1.15; g.add(manifold);
  return g;
}

export function makeModel(key: ModelKey): THREE.Group {
  switch (key) {
    case 'single': return recipCompressor({ len: 2.3, r: 0.5 });
    case 'two': return recipCompressor({ len: 3.0 });
    case 'duplex': return recipCompressor({ duplex: true, len: 3.6 });
    case 'oilfree': return recipCompressor({ len: 2.6, mat: MAT.navy });
    case 'pet': case 'booster': return boosterCompressor();
    case 'screw': return screwCompressor();
    case 'rdryer': return dryer();
    case 'hdryer': return heatlessDryer();
    case 'chiller': return chiller();
    case 'tank': return tank({ len: 2.4, r: 0.55, vertical: true, mat: MAT.blue });
    case 'vacuum': return vacuumPump();
    case 'parts': return parts();
    case 'filter': return filter();
  }
}

/** put an object on the floor (y=0) and centre it on X/Z; returns its size */
export function settle(obj: THREE.Object3D) {
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  obj.position.y -= box.min.y;
  const c = box.getCenter(new THREE.Vector3());
  obj.position.x -= c.x; obj.position.z -= c.z;
  return box.getSize(new THREE.Vector3());
}

/** glowing air line along a curve, with travelling particles (call .userData.tick(t)) */
export function airLine(points: THREE.Vector3[], { color = 0x0ea5e9, radius = 0.05, glow = true, count = 70 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points);
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 200, radius, 10), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })));
  if (glow) g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 200, radius * 3, 10), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, depthWrite: false })));
  const pos = new Float32Array(count * 3); const offsets = Array.from({ length: count }, () => Math.random());
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: radius * 1.6, transparent: true, opacity: 0.95, depthWrite: false }));
  g.add(pts);
  const v = new THREE.Vector3();
  g.userData.tick = (t: number, speed = 0.08, upto = 1) => {
    for (let i = 0; i < count; i++) {
      const u = ((offsets[i] + t * speed) % 1) * upto;
      curve.getPointAt(u, v); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
    }
    geo.attributes.position.needsUpdate = true;
  };
  g.userData.tick(0);
  return g;
}
