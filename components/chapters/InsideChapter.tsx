'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { ThreeCanvas, type SceneSetup } from '../three/ThreeCanvas';
import { useScrollProgress } from '../useScrollProgress';
import { tank, M } from '@/lib/three/concept';
import { placeLabel, easeInOut, clamp01 } from '@/lib/three/project';

const STEPS = ['Air receiver — hydro-tested', 'Crankcase & crankshaft', 'Pistons & cast-iron cylinders', 'Intercooler & valve plates', 'Motor, flywheel & belt guard'];
// label: [title, sub, number, x, y as a fraction of a 1440×900 stage]
export const LABELS: [string, string, string, number, number][] = [ // [title, sub, n, (unused x, y)]
  ['Air receiver', 'Hydro-tested · 70 – 25,000 L', '01', 1040 / 1440, 700 / 900],
  ['Crankcase & crankshaft', 'Balanced, forged steel', '02', 510 / 1440, 600 / 900],
  ['Cast-iron cylinders', 'Deep fins for 24/7 cooling', '03', 500 / 1440, 250 / 900],
  ['Intercooler', 'Cooler air between stages', '04', 880 / 1440, 150 / 900],
  ['Motor & belt drive', 'Up to 100 HP · IE3 motors', '05', 1060 / 1440, 420 / 900],
];

/** 02 · Inside a Parth — scroll takes the compressor apart, part by part (concept image 02). */
export default function InsideChapter() {
  const { sectionRef, progress, step } = useScrollProgress(STEPS.length);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const dots = useRef<(SVGGElement | null)[]>([]);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const bar = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);

  const setup: SceneSetup = ({ scene, camera, size }) => {
    const mesh = (g: THREE.BufferGeometry, m: THREE.Material) => { const o = new THREE.Mesh(g, m); o.castShadow = true; return o; };
    const cyl = (r: number, h: number, m: THREE.Material) => mesh(new THREE.CylinderGeometry(r, r, h, 40), m);
    const root = new THREE.Group(); root.position.x = 1.2; root.rotation.y = 0.25; scene.add(root);

    // every part group gets its own materials so the active step can glow cyan
    type Part = { g: THREE.Group; a: THREE.Vector3; b: THREE.Vector3; ra: number; rb: number; sa: number; sb: number; order: number; mats: THREE.MeshStandardMaterial[] };
    const parts: Part[] = [];
    const add = (order: number, g: THREE.Group, a: [number, number, number], b: [number, number, number], { ra = 0, rb = 0, sa = 1, sb = 1 } = {}) => {
      const mats: THREE.MeshStandardMaterial[] = [];
      g.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && (m.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) { const c = (m.material as THREE.MeshStandardMaterial).clone(); m.material = c; mats.push(c); } });
      root.add(g); parts.push({ g, a: new THREE.Vector3(...a), b: new THREE.Vector3(...b), ra, rb, sa, sb, order, mats });
    };
    const grp = (...o: THREE.Object3D[]) => { const g = new THREE.Group(); if (o.length) g.add(...o); return g; };

    // 01 receiver (stays put)
    add(0, grp(tank({ len: 3.2, r: 0.62 })), [0, 0, 0], [0, 0, 0]);
    // 02 crankcase + crankshaft
    const shaft = cyl(0.06, 1.3, M.chrome); shaft.rotation.z = Math.PI / 2; shaft.position.y = 0.55;
    const webs = [-0.2, 0.2].map((x) => { const w = mesh(new RoundedBoxGeometry(0.09, 0.32, 0.2, 3, 0.03), M.iron); w.position.set(x, 0.6, 0); return w; });
    add(1, grp(mesh(new RoundedBoxGeometry(0.9, 0.45, 0.7, 4, 0.06), M.iron), shaft, ...webs), [-0.55, 0.85, -0.05], [-0.4, 1.3, 0]);
    // 03 pistons + finned cylinders
    for (const [x, a] of [[-0.62, 0.5], [-0.18, -0.5]] as [number, number][]) {
      const p = grp(cyl(0.15, 0.2, M.steel)); for (let i = 0; i < 3; i++) { const r = mesh(new THREE.TorusGeometry(0.152, 0.007, 6, 32), M.dark); r.rotation.x = Math.PI / 2; r.position.y = 0.05 + i * 0.03; p.add(r); }
      p.rotation.z = a; add(2, p, [x - 0.15, 1.2, -0.05], [x * 1.4, 2.45, 0]);
      const cg = grp(cyl(0.14, 0.55, M.iron)); for (let i = 0; i < 9; i++) { const f = cyl(0.19, 0.02, M.iron); f.position.y = -0.22 + i * 0.055; cg.add(f); }
      cg.rotation.z = a; add(2, cg, [x - 0.15, 1.3, -0.05], [x * 1.6, 3.15, 0]);
    }
    // 04 heads + intercooler
    for (const [x, ax] of [[-1.0, -0.88], [-0.3, -0.22]]) add(3, grp(mesh(new RoundedBoxGeometry(0.42, 0.1, 0.42, 3, 0.03), M.dark)), [ax, 1.62, -0.05], [x, 3.95, 0]);
    const ic = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.4, 0, 0), new THREE.Vector3(-0.25, 0.35, 0.2), new THREE.Vector3(0.25, 0.35, 0.2), new THREE.Vector3(0.4, 0, 0)]);
    add(3, grp(mesh(new THREE.TubeGeometry(ic, 40, 0.035, 12), M.chrome)), [-0.55, 1.68, -0.05], [-0.65, 4.1, 0]);
    // 05 motor, flywheel, belt guard
    const motor = grp(); const mb = cyl(0.3, 0.75, M.blue); mb.rotation.z = Math.PI / 2; motor.add(mb);
    for (let i = 0; i < 10; i++) { const fin = mesh(new THREE.BoxGeometry(0.7, 0.03, 0.03), M.blue); const a = (i / 10) * Math.PI * 2; fin.position.set(0, Math.cos(a) * 0.31, Math.sin(a) * 0.31); motor.add(fin); }
    add(4, motor, [0.9, 0.88, 0], [1.9, 2.0, 0]);
    const fly = cyl(0.42, 0.08, M.dark); fly.rotation.x = Math.PI / 2;
    add(4, grp(fly), [-0.55, 0.9, 0.33], [1.45, 3.0, 0.9]);
    add(4, grp(mesh(new RoundedBoxGeometry(1.9, 0.95, 0.16, 6, 0.07), M.red)), [0.17, 0.93, 0.45], [2.3, 3.6, 0.4], { rb: -0.4, sb: 0.75 });

    const ghostMat = new THREE.MeshBasicMaterial({ color: 0x1f45b8, wireframe: true, transparent: true, opacity: 0 });
    const ghost = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.9), ghostMat); ghost.position.set(-0.3, 1.1, 0); root.add(ghost);
    const glMat = new THREE.LineDashedMaterial({ color: 0x1f45b8, dashSize: 0.08, gapSize: 0.08, transparent: true, opacity: 0 });
    const gl = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.4, 0.6, 0), new THREE.Vector3(-0.4, 4.6, 0)]), glMat); gl.computeLineDistances(); root.add(gl);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d3e6, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 8, 6); scene.add(key);
    const rim = new THREE.PointLight(0xe11d2e, 12, 12); rim.position.set(-3, 3, -3); scene.add(rim);

    // label anchors in root space, one per step (follow their part)
    const anchorOf = [new THREE.Vector3(-1.4, 0.2, 0.6), new THREE.Vector3(-0.45, 0, 0.35), new THREE.Vector3(-0.1, 0.05, 0.15), new THREE.Vector3(0, 0.25, 0.2), new THREE.Vector3(0.35, 0.1, 0.3)];
    const partFor = [0, 1, 3, 8, 9]; // tank, crankcase, cylinder, intercooler, motor
    const look = new THREE.Vector3(0.6, 2.2, 0);
    let portrait = false, colMax = 0;
    const place = () => {
      portrait = size.w / size.h < 0.9;
      if (portrait) { camera.position.set(9, 7, 21); look.set(0.8, 2.6, 0); camera.setViewOffset(size.w, size.h, 0, size.h * 0.12, size.w, size.h); }
      else {
        camera.position.set(9.5, 6.4, 15.5); look.set(0.6, 2.2, 0);
        // centre the machine (plus its label column) in the space right of the text card
        const cardRight = card.current ? card.current.getBoundingClientRect().right : size.w * 0.33;
        const railW = size.w >= 1280 ? 200 : 0;
        const freeL = cardRight + 30, freeR = size.w - railW - 20;
        const target = freeL + (freeR - freeL - 250) * 0.5;
        camera.setViewOffset(size.w, size.h, -(target - size.w / 2), 0, size.w, size.h);
        colMax = freeR - 230;
      }
      camera.lookAt(look); camera.updateProjectionMatrix();
    };
    const tmp = new THREE.Vector3();
    const pts = LABELS.map(() => ({ x: 0, y: 0, ty: 0, vis: 0 }));
    return {
      resize: place,
      update: (t) => {
        const p = progress.current;
        const active = Math.min(4, Math.floor(p * 4.999));
        const ex = (order: number) => (order === 0 ? 1 : easeInOut(clamp01((p - 0.06 - (order - 1) * 0.15) / 0.17)));
        for (const pt of parts) {
          const e = ex(pt.order);
          pt.g.position.lerpVectors(pt.a, pt.b, e);
          pt.g.rotation.y = THREE.MathUtils.lerp(pt.ra, pt.rb, e);
          pt.g.scale.setScalar(THREE.MathUtils.lerp(pt.sa, pt.sb, e));
          const glow = pt.order === active ? 0.35 : 0;
          for (const m of pt.mats) { m.emissive.setHex(0x0ea5e9); m.emissiveIntensity += (glow - m.emissiveIntensity) * 0.15; }
        }
        const opened = ex(1);
        ghostMat.opacity = opened * 0.25; glMat.opacity = opened * 0.7;
        root.rotation.y = 0.25 + Math.sin(t * 0.3) * 0.03;
        root.updateMatrixWorld();
        if (bar.current) bar.current.style.width = `${(p * 100).toFixed(1)}%`;
        // anchors on screen
        let maxX = 0;
        LABELS.forEach((_, i) => {
          const part = parts[partFor[i]];
          tmp.copy(anchorOf[i]).applyMatrix4(part.g.matrix).applyMatrix4(root.matrixWorld);
          const q = placeLabel(null, tmp, camera, size.w, size.h);
          pts[i].x = q.x; pts[i].y = q.y; pts[i].ty = q.y - 30; pts[i].vis = portrait ? 0 : i === 0 ? 1 : ex(i);
          maxX = Math.max(maxX, q.x);
        });
        // one tidy callout column to the right of the machine; labels never overlap each other
        const colX = Math.min(colMax, maxX + 90);
        const order = [...pts.keys()].sort((a, b) => pts[a].ty - pts[b].ty);
        let prev = -1e9;
        for (const i of order) { pts[i].ty = Math.max(pts[i].ty, prev + 94, 110); prev = pts[i].ty; }
        const over = prev - (size.h - 110); if (over > 0) for (const i of order) pts[i].ty -= over;
        pts.forEach((q, i) => {
          const el = labels.current[i];
          if (el) { el.style.transform = `translate3d(${colX.toFixed(1)}px, ${q.ty.toFixed(1)}px, 0)`; el.style.opacity = String(q.vis); }
          const d = dots.current[i]; if (d) { d.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`); d.style.opacity = String(q.vis); }
          const ln = lines.current[i];
          if (ln) { const ly = q.ty + 30, mx = colX - 26; ln.setAttribute('d', `M${q.x.toFixed(1)} ${q.y.toFixed(1)} L${mx.toFixed(1)} ${ly.toFixed(1)} L${colX.toFixed(1)} ${ly.toFixed(1)}`); ln.style.opacity = String(q.vis * 0.8); }
        });
      },
    };
  };

  return (
    <section id="inside" ref={sectionRef} className="relative" style={{ height: '420vh' }}>
      <div className="bg-inside sticky top-0 h-[100svh] overflow-hidden">
        <div className="blueprint absolute inset-0" />
        <ThreeCanvas setup={setup} className="absolute inset-0" fov={30} envIntensity={0.9} shadows={false} />
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" aria-hidden="true">
          {LABELS.map((_, i) => (
            <g key={i}>
              <path ref={(el) => { lines.current[i] = el; }} stroke={i === step ? '#e11d2e' : '#1f45b8'} strokeOpacity={i === step ? 1 : 0.45} strokeWidth="1.3" fill="none" style={{ opacity: 0 }} />
              <g ref={(el) => { dots.current[i] = el; }} style={{ opacity: 0 }}>
                <circle r="11" fill={i === step ? 'rgba(225,29,46,.15)' : 'rgba(31,69,184,.12)'} />
                <circle r="5" fill={i === step ? '#e11d2e' : '#1f45b8'} stroke="#fff" strokeWidth="2" />
              </g>
            </g>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {LABELS.map(([title, sub, n], i) => (
            <div key={n} ref={(el) => { labels.current[i] = el; }}
              className={`float-label label-card w-[220px] rounded-xl px-[13px] py-[9px] transition-[border-color,box-shadow] duration-300 ${i === step ? '!border-red shadow-[0_0_0_4px_rgba(225,29,46,.12),0_10px_30px_rgba(15,23,42,.1)]' : ''}`}
              style={{ opacity: 0 }}>
              <em className={`font-mono text-[10px] font-semibold not-italic tracking-[0.1em] ${i === step ? 'text-red' : 'text-blue'}`}>{n}</em>
              <b className="block text-[13.5px]">{title}</b><span className="text-[11.5px] text-muted">{sub}</span>
            </div>
          ))}
        </div>

        <div className="wrap relative z-10 flex h-full items-end pb-24 md:items-center md:pb-0 md:pt-16">
          <div ref={card} className="panel w-full p-5 md:w-[400px] md:p-[30px]">
            <p className="mono text-blue">02 · Inside a Parth</p>
            <h2 className="font-display mb-3 mt-2.5 text-[30px] font-bold leading-[1.02] md:mb-4 md:mt-3.5 md:text-[42px]">Built from cast iron, <span className="text-red">not compromises.</span></h2>
            <p className="hidden text-[15px] leading-[1.6] text-ink-2 md:block">Keep scrolling and the compressor opens up, part by part — so you see exactly what you are paying for before you ask for a quote.</p>
            <ol className="mt-4 grid gap-2 md:mt-[22px]">
              {STEPS.map((s, i) => (
                <li key={s} className={`items-center gap-3 text-[14px] transition-colors ${i === step ? 'flex font-semibold text-ink' : 'hidden md:flex'} ${i < step ? 'text-ink-2' : i > step ? 'text-muted' : ''}`}>
                  <span className={`grid h-[26px] w-[26px] place-items-center rounded-lg border font-mono text-[11px] font-semibold transition-colors ${i === step ? 'border-red bg-red text-white' : i < step ? 'border-blue/30 bg-blue/10 text-blue' : 'border-line text-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-4 h-1 rounded bg-ink/10 md:mt-[22px]"><i ref={bar} className="block h-full w-0 rounded bg-[linear-gradient(90deg,var(--blue),var(--red))]" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
