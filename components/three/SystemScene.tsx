'use client';

import * as THREE from 'three';
import { ThreeCanvas, type SceneSetup } from './ThreeCanvas';
import { conceptModel, fitToFloor, airStream } from '@/lib/three/concept';
import { placeLabel } from '@/lib/three/project';
import { SYSTEM_STEPS } from '@/lib/products';

/**
 * The complete compressed-air system on one line: Screw compressor → Air receiver → Pre filter →
 * Refrigerated dryer → After filter, joined by an overhead pipe rack. `progress.current` (0..1, from scroll)
 * fills the line with air and lights up the machine the air has reached. Pins are DOM elements placed above each machine.
 */
export default function SystemScene({ progress, pins, outletPin, className = '' }: {
  progress: { current: number }; pins: { current: (HTMLElement | null)[] }; outletPin?: { current: HTMLElement | null }; className?: string;
}) {
  const setup: SceneSetup = ({ scene, camera, size }) => {
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d3e6, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 9, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -9, right: 9, top: 6, bottom: -6 }); scene.add(key);
    const rim = new THREE.PointLight(0xe11d2e, 10, 14); rim.position.set(-6, 3, -3); scene.add(rim);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.ShadowMaterial({ opacity: 0.12 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

    const xs = [-5.3, -2.2, 0.1, 2.4, 4.8];
    const stations = SYSTEM_STEPS.map((step, i) => {
      const m = conceptModel(step.model); const g = new THREE.Group(); g.add(m); const sz = fitToFloor(m);
      const k = step.model === 'screw' ? 0.85 : step.model === 'tank' ? 0.72 : 1.0;
      g.scale.setScalar(k); g.position.set(xs[i], 0, 0); g.rotation.y = step.model === 'screw' ? -0.35 : -0.15;
      g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; }); scene.add(g);
      const padMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.05, roughness: 0.4 });
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.2, 0.08, 64), padMat); pad.position.set(xs[i], -0.04, 0); pad.receiveShadow = true; scene.add(pad);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x1f45b8, transparent: true, opacity: 0.25 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.02, 8, 80), ringMat); ring.rotation.x = Math.PI / 2; ring.position.set(xs[i], 0.01, 0); scene.add(ring);
      return { g, top: sz.y * k, ringMat, x: xs[i] };
    });
    const HEADER = Math.max(...stations.map((s) => s.top)) + 0.45;

    // overhead pipe rack: riser out of each machine, header across, drop into the next
    const pts: THREE.Vector3[] = [];
    stations.forEach((s, i) => {
      if (i > 0) pts.push(new THREE.Vector3(s.x - 0.25, HEADER, 0), new THREE.Vector3(s.x, HEADER - 0.15, 0), new THREE.Vector3(s.x, s.top + 0.12, 0));
      if (i < stations.length - 1) pts.push(new THREE.Vector3(s.x + 0.05, s.top + 0.12, 0), new THREE.Vector3(s.x + 0.1, HEADER - 0.15, 0), new THREE.Vector3(s.x + 0.35, HEADER, 0));
    });
    // after the last filter: along the rack, then down to the outlet that feeds the plant
    const OX = xs[4] + 1.7, OY = 0.95;
    pts.push(new THREE.Vector3(xs[4] + 0.05, stations[4].top + 0.12, 0), new THREE.Vector3(xs[4] + 0.1, HEADER - 0.15, 0), new THREE.Vector3(xs[4] + 0.4, HEADER, 0),
      new THREE.Vector3(OX - 0.3, HEADER, 0), new THREE.Vector3(OX, HEADER - 0.3, 0), new THREE.Vector3(OX, OY + 0.25, 0));
    // outlet: ball valve, quick coupling and a small stand, with a green ring = clean dry air out
    const outlet = new THREE.Group(); outlet.position.set(OX, 0, 0); scene.add(outlet);
    const chrome = new THREE.MeshStandardMaterial({ color: 0xd9dee6, metalness: 1, roughness: 0.15 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), chrome); body.position.y = OY; body.castShadow = true; outlet.add(body);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.08), new THREE.MeshStandardMaterial({ color: 0xe11d2e })); handle.position.set(0.18, OY + 0.17, 0); outlet.add(handle);
    const nipple = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16), chrome); nipple.position.y = OY - 0.3; outlet.add(nipple);
    const coupler = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 20), new THREE.MeshStandardMaterial({ color: 0x1f45b8, metalness: 0.4, roughness: 0.3 })); coupler.position.y = OY - 0.55; outlet.add(coupler);
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, OY - 0.6, 0.06), new THREE.MeshStandardMaterial({ color: 0xcbd5e1 })); stand.position.set(-0.22, (OY - 0.6) / 2, 0); outlet.add(stand);
    const outRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.02, 8, 64), new THREE.MeshBasicMaterial({ color: 0x16a34a, transparent: true, opacity: 0.2 })); outRing.rotation.x = Math.PI / 2; outRing.position.y = 0.01; outlet.add(outRing);
    const outPad = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.58, 0.06, 48), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })); outPad.position.y = -0.03; outPad.receiveShadow = true; outlet.add(outPad);
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.2);
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 400, 0.085, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5, roughness: 0.25, transparent: true, opacity: 0.35, depthWrite: false })));
    // supports for the rack
    for (const x of [-3.7, -1.05, 1.25, 3.6, 6.2]) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, HEADER, 0.06), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.5, roughness: 0.5 })); post.position.set(x, HEADER / 2, -0.1); scene.add(post); }
    const air = airStream(pts, { radius: 0.045, count: 150, additive: false, color: 0x0ea5e9 });
    const airTubes = air.children.filter((c) => (c as THREE.Mesh).isMesh) as THREE.Mesh[];
    scene.add(air);
    // where along the curve each machine sits (0..1), so the active machine matches the air front
    const at = stations.map((s) => { let best = 0, d = 1e9; for (let u = 0; u <= 1; u += 0.002) { const p = curve.getPointAt(u); const dd = Math.abs(p.x - s.x) + Math.abs(p.y - s.top); if (dd < d) { d = dd; best = u; } } return best; });

    const look = new THREE.Vector3();
    const place = () => {
      const a = size.w / size.h;
      const k = Math.min(1.3, Math.max(1, size.h / 860));
      const dist = (a < 0.9 ? 34 : a < 1.3 ? 25 : 21) * k;
      camera.position.set(1.0, 4.2 * k, dist); look.set(0.6, 1.5, 0); camera.lookAt(look);
      camera.setViewOffset(size.w, size.h, a < 1.3 ? 0 : -size.w * 0.07, -size.h * (a < 0.9 ? 0.02 : size.h > 950 ? 0.035 : 0.09), size.w, size.h);
      camera.updateProjectionMatrix();
    };
    return {
      resize: place,
      update: (t) => {
        const p = progress.current;
        const active = Math.min(4, Math.floor(p * 4.999));
        const reach = Math.min(1, at[active] + (active === 4 ? 1 : (at[active + 1] - at[active]) * ((p * 5) % 1)));
        air.userData.tick(t, 0.05);
        // hide particles beyond the air front by squashing the tube draw range
        for (const m of airTubes) { const geo = m.geometry as THREE.TubeGeometry; geo.setDrawRange(0, Math.floor(geo.parameters.tubularSegments * reach) * geo.parameters.radialSegments * 6); }
        const ptsAttr = (air.children.find((c) => (c as THREE.Points).isPoints) as THREE.Points).geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < ptsAttr.count; i++) { const x = ptsAttr.getX(i); if (x > curve.getPointAt(reach).x + 0.05) ptsAttr.setY(i, -50); }
        ptsAttr.needsUpdate = true;
        stations.forEach((s, i) => {
          const target = i === active ? 1 : i < active ? 0.5 : 0.18;
          s.ringMat.opacity += (target - s.ringMat.opacity) * 0.1;
          s.ringMat.color.setHex(i === active ? 0xe11d2e : 0x1f45b8);
          placeLabel(pins.current[i], new THREE.Vector3(s.x, HEADER + 0.3, 0), camera, size.w, size.h);
        });
        // the outlet lights up green once the air has gone all the way through
        const done = active === 4 && (p * 5) % 1 > 0.5 || p > 0.97;
        (outRing.material as THREE.MeshBasicMaterial).opacity += ((done ? 1 : 0.2) - (outRing.material as THREE.MeshBasicMaterial).opacity) * 0.1;
        if (outletPin?.current) { placeLabel(outletPin.current, new THREE.Vector3(OX, 0, 0), camera, size.w, size.h); outletPin.current.style.opacity = done ? '1' : '0.55'; }
      },
    };
  };
  return <ThreeCanvas setup={setup} className={className} fov={30} envIntensity={0.7} />;
}
