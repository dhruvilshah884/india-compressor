'use client';

import Link from 'next/link';
import { useRef } from 'react';
import * as THREE from 'three';
import { ThreeCanvas, type SceneSetup } from '../three/ThreeCanvas';
import { useScrollProgress } from '../useScrollProgress';
import { conceptModel, fitToFloor, airStream } from '@/lib/three/concept';
import { placeLabel } from '@/lib/three/project';
import { bySlug, type ModelKey } from '@/lib/products';
import { whatsappLink } from '@/lib/site';

// stations along the S-shaped air line: [model, x, z, product slug, pin label]
const STATIONS: [ModelKey, number, number, string, string][] = [
  ['two', -9, -5, 'two-stage-air-compressor', 'Two Stage'],
  ['duplex', -5.2, -6.4, 'duplex-air-compressor', 'Duplex'],
  ['pet', -1.2, -6.0, 'multistage-pet-air-compressor', 'Multistage PET'],
  ['screw', 3, -4.4, 'screw-air-compressor', 'Screw'],
  ['rdryer', 6.4, -1.4, 'refrigerated-air-dryer', 'Refrigerated Air Dryer'],
  ['hdryer', 4.2, 2.0, 'heatless-air-dryer', 'Heatless Air Dryer'],
  ['tank', 0.4, 2.4, 'air-receiver-tank', 'Air Receiver Tank'],
  ['chiller', -3.8, 2.8, 'water-chiller', 'Water Chiller'],
  ['vacuum', -7.6, 3.2, 'vacuum-pump', 'Vacuum Pump'],
  ['parts', -9.8, 6.6, 'air-compressor-parts', 'Spares'],
];
const BLURB: Record<string, string> = {
  'two-stage-air-compressor': '2 – 40 HP · cast-iron pump · intercooled, 12 bar.',
  'duplex-air-compressor': '30 – 50 HP · twin pumps with auto changeover.',
  'multistage-pet-air-compressor': '15 – 75 HP · 40 bar air for PET bottle blowing.',
  'screw-air-compressor': '5 – 100 HP · low-noise enclosure · built for 24/7 duty.',
  'refrigerated-air-dryer': '20 – 2500 CFM · +3 °C dew point · auto drain.',
  'heatless-air-dryer': '10 – 300 CFM · twin-tower PSA · down to −40 °C.',
  'air-receiver-tank': '70 – 25,000 L · hydro-tested · vertical or horizontal.',
  'water-chiller': '2 – 100 TR · digital PID control · 24/7 cooling.',
  'vacuum-pump': '1.5 – 10 HP · deep, stable vacuum · continuous duty.',
  'air-compressor-parts': 'Genuine spares for Parth, IR, Atlas Copco, CP and ELGI.',
};

/** 03 · The plant floor — an isometric Parth plant; scroll walks "You are here" along the air line (concept image 03). */
export default function PlantChapter() {
  const { sectionRef, progress, step } = useScrollProgress(STATIONS.length);
  const pins = useRef<(HTMLAnchorElement | null)[]>([]);
  const cur = STATIONS[step];
  const p = bySlug(cur[3])!;

  const setup: SceneSetup = ({ scene, size }) => {
    const cam = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 200);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: 0xe9eef6, roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(60, 60, 0xd3dbe8, 0xdfe6f0); grid.position.y = 0.01; scene.add(grid);
    scene.fog = new THREE.Fog(0xeef2f8, 40, 70);

    const stations = STATIONS.map(([key, x, z], i) => {
      const padMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.12, 64), padMat); pad.position.set(x, 0.06, z); pad.receiveShadow = true; scene.add(pad);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xc6d2e6 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.035, 8, 80), ringMat); ring.rotation.x = Math.PI / 2; ring.position.set(x, 0.13, z); scene.add(ring);
      const m = conceptModel(key); const g = new THREE.Group(); g.add(m); fitToFloor(m);
      const sz = new THREE.Box3().setFromObject(g).getSize(new THREE.Vector3()); g.scale.setScalar(Math.min(2.5 / Math.max(sz.x, sz.z), 1));
      g.position.set(x, 0.12, z); g.rotation.y = -0.6 + (i % 2) * 0.25; g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; }); scene.add(g);
      return { x, z, h: new THREE.Box3().setFromObject(g).max.y, padMat, ringMat, ring, g };
    });
    const pts = stations.map((st) => new THREE.Vector3(st.x + 1.5, 0.45, st.z + 1.2));
    const air = airStream(pts, { radius: 0.07, opacity: 1, additive: false, color: 0x0ea5e9, count: 120 }); scene.add(air);
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 300, 0.1, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.3, transparent: true, opacity: 0.12 })));
    const water = airStream([new THREE.Vector3(-3.8, 0.3, 1.2), new THREE.Vector3(-3.0, 0.3, -2), new THREE.Vector3(-1.4, 0.3, -4.2)], { color: 0x1f45b8, radius: 0.05, opacity: 0.95, additive: false, count: 20 }); scene.add(water);
    for (const [x, z, c] of [[1.6, -2.0, 0xf59e0b], [-2.4, 0.4, 0x1f45b8], [7.6, 1.6, 0xe11d2e]]) {
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.55, 6, 12), new THREE.MeshStandardMaterial({ color: c })); body.position.set(x, 0.55, z); body.castShadow = true; scene.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf2c79b })); head.position.set(x, 1.12, z); scene.add(head);
      const hat = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xfacc15 })); hat.position.set(x, 1.17, z); scene.add(hat);
    }
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d3e6, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(10, 22, 8); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 60 }); scene.add(sun);

    const target = new THREE.Vector3(1.2, 0, 0.4), want = new THREE.Vector3(), dir = new THREE.Vector3(18, 20, 18);
    let view = 9.6, narrow = false;
    const frame = (snap = false) => {
      const a = size.w / size.h; narrow = a < 1.1;
      const st = stations[Math.min(STATIONS.length - 1, Math.floor(progress.current * STATIONS.length * 0.9999))];
      // desktop: the whole plant with a gentle drift towards the active machine; phones: follow the machine
      want.set(1.2, 0, 0.4).lerp(new THREE.Vector3(st.x, 0, st.z), narrow ? 1 : 0.18);
      const wantView = narrow ? 6.4 : 9.6 * Math.max(1, 1.45 / a);
      if (snap) { target.copy(want); view = wantView; } else { target.lerp(want, 0.06); view += (wantView - view) * 0.06; }
      cam.left = -view * a; cam.right = view * a; cam.top = view; cam.bottom = -view;
      cam.position.copy(target).add(dir); cam.lookAt(target);
      if (narrow) cam.setViewOffset(size.w, size.h, 0, -size.h * 0.06, size.w, size.h);
      else cam.setViewOffset(size.w, size.h, (-250 / 1440) * size.w, (-150 / 900) * size.h, size.w, size.h);
      cam.updateProjectionMatrix();
    };
    let last = -1;
    return {
      camera: cam,
      resize: () => frame(true),
      update: (t) => {
        frame();
        air.userData.tick(t, 0.03); water.userData.tick(t, 0.05);
        const active = Math.min(STATIONS.length - 1, Math.floor(progress.current * STATIONS.length * 0.9999));
        if (active !== last) {
          last = active;
          stations.forEach((s, i) => {
            const on = i === active;
            s.padMat.color.setHex(on ? 0xffe4e6 : 0xffffff); s.ringMat.color.setHex(on ? 0xe11d2e : 0xc6d2e6);
            s.ring.geometry.dispose(); s.ring.geometry = new THREE.TorusGeometry(1.9, on ? 0.07 : 0.035, 8, 80);
          });
        }
        stations.forEach((s, i) => {
          s.g.position.y = 0.12 + (i === active ? Math.abs(Math.sin(t * 2.4)) * 0.08 : 0);
          placeLabel(pins.current[i], new THREE.Vector3(s.x, s.h + 0.3, s.z), cam, size.w, size.h);
        });
      },
    };
  };

  return (
    <section id="plant" ref={sectionRef} className="relative" style={{ height: '480vh' }}>
      <div className="bg-plant sticky top-0 h-[100svh] overflow-hidden">
        <ThreeCanvas setup={setup} className="absolute inset-0" envIntensity={0.9} />
        <div className="pointer-events-none absolute inset-0">
          {STATIONS.map(([, , , slug, label], i) => (
            <Link key={slug + i} href={`/products/${slug}`} ref={(el) => { pins.current[i] = el; }}
              className={`float-label pointer-events-auto ${i === step ? 'z-10' : ''} ${Math.abs(i - step) > 1 ? 'max-md:hidden' : ''}`}>
              <span className="flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <span className={`flex items-center gap-[7px] whitespace-nowrap rounded-full border py-1.5 pl-[7px] pr-[11px] text-[12.5px] font-semibold shadow-[0_8px_20px_rgba(15,23,42,.1)] transition-colors ${i === step ? 'border-[#0b1222] bg-[#0b1222] text-white' : 'border-black/10 bg-white text-[#0b1222] hover:border-red/40'}`}>
                  <span className={`grid h-[22px] w-[22px] place-items-center rounded-full font-mono text-[10px] font-semibold ${i === step ? 'bg-red text-white' : 'bg-[#e8edf6] text-blue'}`}>{String(i + 1).padStart(2, '0')}</span>
                  {label}
                </span>
                <i className="h-[26px] w-0.5 bg-[linear-gradient(#94a3b8,transparent)]" />
              </span>
            </Link>
          ))}
        </div>

        <div className="wrap pointer-events-none relative z-10 h-full">
          <div className="panel pointer-events-auto absolute left-5 right-5 top-[84px] px-5 py-4 md:left-14 md:right-auto md:top-[130px] md:w-[380px] md:px-7 md:py-[26px]">
            <p className="mono text-blue">03 · The plant floor</p>
            <h2 className="font-display mt-2 text-[24px] font-bold leading-[1.04] md:mb-3 md:mt-3 md:text-[38px]">Walk through a running <span className="text-red">Parth plant.</span></h2>
            <p className="hidden text-[15px] leading-[1.6] text-ink-2 md:block">Every machine is a stop on one air line. Scroll and the camera glides from the compressor house to the dryer, the receiver and out to the shop floor.</p>
          </div>
          <div className="panel pointer-events-auto absolute bottom-24 left-5 right-5 p-4 md:bottom-[10px] md:left-[560px] md:right-auto md:w-[270px] md:px-4 md:py-3.5" key={step}>
            <p className="mono text-[10.5px] text-red">● You are here · {String(step + 1).padStart(2, '0')} / {STATIONS.length}</p>
            <b className="font-display mb-1 mt-1.5 block text-[20px] font-bold">{p.name}</b>
            <p className="text-[13px] leading-[1.5] text-ink-2">{BLURB[p.slug]}</p>
            <div className="mt-2.5 flex gap-2">
              <Link href={`/products/${p.slug}`} className="btn btn-red btn-sm">View specs</Link>
              <a href={whatsappLink(`Hello Parth, please send a quote for ${p.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Get quote</a>
            </div>
          </div>
          <div className="absolute bottom-9 left-14 hidden items-center gap-[18px] text-[13px] text-ink-2 lg:flex">
            <span><i className="mr-2 inline-block h-1.5 w-[26px] rounded align-middle" style={{ background: '#38bdf8' }} />Compressed air</span>
            <span><i className="mr-2 inline-block h-1.5 w-[26px] rounded align-middle" style={{ background: '#1f45b8' }} />Chilled water</span>
            <span><i className="mr-2 inline-block h-1.5 w-[26px] rounded align-middle" style={{ background: '#e11d2e' }} />You are here</span>
          </div>
        </div>
      </div>
    </section>
  );
}
