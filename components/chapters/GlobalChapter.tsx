'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { ThreeCanvas, type SceneSetup } from '../three/ThreeCanvas';
import { useScrollProgress } from '../useScrollProgress';
import { placeLabel, clamp01, easeOut } from '@/lib/three/project';
import { COUNTRIES } from '@/lib/site';

const LAND: number[][][] = [
  [[-17,21],[-16,12],[-8,5],[5,4],[9,4],[10,-1],[13,-6],[12,-17],[15,-27],[18,-34],[26,-34],[33,-26],[35,-17],[40,-11],[40,-3],[51,11],[43,12],[37,19],[33,31],[25,32],[11,37],[-6,36],[-10,29]],
  [[35,30],[39,22],[43,13],[52,16],[57,19],[60,23],[56,26],[51,25],[48,30],[39,33]],
  [[68,24],[72,21],[73,16],[77,8],[80,10],[80,15],[87,21],[89,22],[92,22],[88,27],[81,30],[75,32],[74,35],[70,31]],
  [[40,40],[50,45],[60,45],[70,40],[75,37],[80,30],[90,28],[97,28],[100,22],[105,10],[109,12],[108,21],[118,24],[122,31],[121,40],[130,43],[142,46],[141,52],[160,60],[180,66],[180,72],[110,77],[70,73],[55,68],[40,66],[30,60],[28,46]],
  [[-10,36],[-9,43],[-2,44],[-5,48],[3,51],[8,54],[10,58],[5,62],[15,69],[30,71],[30,60],[28,46],[20,40],[15,38],[10,44],[3,43]],
  [[114,-22],[122,-18],[130,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[141,-38],[131,-31],[115,-34]],
  [[-168,66],[-140,70],[-95,72],[-80,63],[-65,60],[-55,50],[-70,43],[-76,35],[-81,25],[-90,29],[-97,26],[-105,20],[-90,15],[-83,9],[-78,8],[-90,14],[-105,22],[-118,33],[-124,42],[-125,49],[-135,58],[-150,60],[-165,60]],
  [[-80,8],[-72,12],[-60,10],[-50,0],[-35,-6],[-40,-22],[-48,-27],[-58,-38],[-65,-55],[-72,-50],[-74,-40],[-71,-18],[-81,-5]],
];

/** 12 · Global — dotted globe with export arcs drawn out from Ahmedabad as you scroll. */
export default function GlobalChapter() {
  const { sectionRef, progress } = useScrollProgress(1);
  const hqLabel = useRef<HTMLDivElement>(null);
  const others = COUNTRIES.filter((c) => !c.hq);

  const setup: SceneSetup = ({ scene, camera, size }) => {
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdbe3f0, 2.2));
    const R = 2.3, globe = new THREE.Group(); scene.add(globe);
    const ll = (lat: number, lon: number, rad = R) => { const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180; return new THREE.Vector3(-rad * Math.sin(phi) * Math.cos(th), rad * Math.cos(phi), rad * Math.sin(phi) * Math.sin(th)); };
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.995, 64, 64), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0 })));
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.12, 64, 64), new THREE.MeshBasicMaterial({ color: 0x1f45b8, transparent: true, opacity: 0.05, side: THREE.BackSide })));
    const cv = document.createElement('canvas'); cv.width = 720; cv.height = 360; const g2 = cv.getContext('2d')!; g2.fillStyle = '#fff';
    for (const poly of LAND) { g2.beginPath(); poly.forEach(([lon, lat], i) => { const x = (lon + 180) * 2, y = (90 - lat) * 2; if (i) g2.lineTo(x, y); else g2.moveTo(x, y); }); g2.closePath(); g2.fill(); }
    const img = g2.getImageData(0, 0, 720, 360).data; const dots: number[] = [];
    for (let lat = -80; lat <= 80; lat += 1.6) { const step = 1.6 / Math.max(0.2, Math.cos(lat * Math.PI / 180)); for (let lon = -180; lon < 180; lon += step) { const x = Math.floor((lon + 180) * 2), y = Math.floor((90 - lat) * 2); if (img[(y * 720 + x) * 4] > 128) { const v = ll(lat, lon, R * 1.003); dots.push(v.x, v.y, v.z); } } }
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    globe.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x1f45b8, size: 0.03, transparent: true, opacity: 0.55 })));
    for (let lat = -60; lat <= 60; lat += 30) { const pts: THREE.Vector3[] = []; for (let lon = -180; lon <= 180; lon += 4) pts.push(ll(lat, lon, R * 1.001)); globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xc3d0e8, transparent: true, opacity: 0.8 }))); }
    const hq = COUNTRIES.find((c) => c.hq)!;
    const pin = (lat: number, lon: number, color: number, s: number) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 16), new THREE.MeshBasicMaterial({ color })); m.position.copy(ll(lat, lon, R * 1.01)); globe.add(m);
      const halo = new THREE.Mesh(new THREE.RingGeometry(s * 1.6, s * 2.3, 32), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.45, side: THREE.DoubleSide })); halo.position.copy(m.position); halo.lookAt(0, 0, 0); globe.add(halo);
      return [m, halo];
    };
    pin(hq.lat, hq.lon, 0xe11d2e, 0.06);
    const arcs = COUNTRIES.filter((c) => !c.hq).map((c) => {
      const pins = pin(c.lat, c.lon, 0x1f45b8, 0.035);
      const a = ll(hq.lat, hq.lon, R), b = ll(c.lat, c.lon, R); const mid = a.clone().add(b).multiplyScalar(0.5); mid.setLength(R + a.distanceTo(b) * 0.45);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.008, 6), new THREE.MeshBasicMaterial({ color: 0xe11d2e }));
      const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.03, 6), new THREE.MeshBasicMaterial({ color: 0xe11d2e, transparent: true, opacity: 0.12, depthWrite: false }));
      globe.add(core, glow); return { core, glow, pins };
    });
    const glowRing = new THREE.Mesh(new THREE.RingGeometry(R * 1.02, R * 1.35, 96), new THREE.MeshBasicMaterial({ color: 0x1f45b8, transparent: true, opacity: 0.04, side: THREE.DoubleSide })); scene.add(glowRing);
    camera.position.set(0, 0, 14); camera.lookAt(0, 0, 0);
    let portrait = false;
    const place = () => {
      portrait = size.w / size.h < 0.9;
      if (portrait) { camera.position.set(0, 0, 17); camera.setViewOffset(size.w, size.h, 0, size.h * 0.24, size.w, size.h); }
      else { camera.position.set(0, 0, 14 * Math.min(1.3, Math.max(1, size.h / 860))); camera.setViewOffset(size.w, size.h, (-170 / 1440) * size.w, (30 / 900) * size.h, size.w, size.h); }
      camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
    };
    const hqLocal = ll(hq.lat, hq.lon, R * 1.02);
    return {
      resize: place,
      update: (t) => {
        const p = progress.current;
        // spin from India towards Africa as the chapter scrolls in, then hold
        const spin = easeOut(clamp01(p * 1.6));
        globe.rotation.set(0.26, 3.75 + (1 - spin) * 0.9 + Math.sin(t * 0.2) * 0.03, 0);
        arcs.forEach(({ core, glow, pins }, i) => {
          const local = clamp01(p * 2.4 - 0.15 - i * 0.12);
          const n = Math.floor(60 * local) * 6 * 6;
          core.geometry.setDrawRange(0, n); glow.geometry.setDrawRange(0, n);
          pins.forEach((m) => { m.visible = local > 0.95; });
        });
        globe.updateMatrixWorld();
        placeLabel(hqLabel.current, globe.localToWorld(hqLocal.clone()), camera, size.w, size.h, 14, -44);
      },
    };
  };

  return (
    <section ref={sectionRef} className="relative" style={{ height: '200vh' }}>
      <div id="global" className="absolute top-0 h-px w-px" />
      <div className="bg-global sticky top-0 h-[100svh] overflow-hidden">
        <ThreeCanvas setup={setup} className="absolute inset-0" fov={30} shadows={false} />
        <div className="pointer-events-none absolute inset-0">
          <div ref={hqLabel} className="float-label whitespace-nowrap rounded-[10px] bg-red px-[11px] py-[7px] text-[12.5px] font-semibold text-white shadow-lg">Ahmedabad · HQ</div>
        </div>
        <div className="wrap relative z-10 flex h-full flex-col justify-end pb-24 md:justify-center md:pb-0 md:pt-16">
          <div className="max-w-[440px]">
            <p className="mono text-blue">12 · Global</p>
            <h2 className="font-display mb-3 mt-3 text-[32px] font-bold leading-none md:mb-4 md:text-[50px]">Made in Ahmedabad. <span className="text-red">Running in {others.length} countries.</span></h2>
            <p className="hidden text-[15px] leading-[1.6] text-ink-2 md:block">From PET bottling lines in the Gulf to pharma plants in East Africa — every arc is a Parth system delivered, installed and supported.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 md:mt-6">
              {COUNTRIES.map((c) => (
                <div key={c.name} className={`flex items-center gap-[9px] rounded-[10px] border bg-white px-2.5 py-2 text-[13px] text-ink shadow-[0_4px_14px_rgba(15,23,42,.04)] md:text-[14px] ${c.hq ? 'border-red/40' : 'border-line'} ${c.hq ? '' : 'max-md:[&:nth-child(n+7)]:hidden'}`}>
                  <i className={`h-2 w-2 rounded-full ${c.hq ? 'bg-red' : 'bg-blue'}`} />{c.name}
                  <small className="ml-auto text-[11px] text-muted">{c.tag}</small>
                </div>
              ))}
            </div>
            <div className="mt-6 hidden gap-10 md:flex">
              <div><b className="font-display block text-[34px] font-bold leading-none">25+</b><span className="text-[12.5px] text-muted">years exporting</span></div>
              <div><b className="font-display block text-[34px] font-bold leading-none">1,00,000+</b><span className="text-[12.5px] text-muted">installations</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
