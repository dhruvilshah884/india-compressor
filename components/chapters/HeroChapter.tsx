'use client';

import Link from 'next/link';
import { useRef } from 'react';
import * as THREE from 'three';
import { ThreeCanvas, type SceneSetup } from '../three/ThreeCanvas';
import { recipCompressor, fitToFloor } from '@/lib/three/concept';
import { placeLabel, easeOut, clamp01 } from '@/lib/three/project';
import { STATS } from '@/lib/site';

/** 01 · Air, engineered — a red two-stage compressor on a white podium, light studio look. */
export default function HeroChapter() {
  const tag1 = useRef<HTMLDivElement>(null);
  const tag2 = useRef<HTMLDivElement>(null);

  const setup: SceneSetup = ({ scene, camera, size, reducedMotion }) => {
    // soft shadow floor + faint grid that fades out with distance
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.12 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(40, 40, 0xcfd8e6, 0xdfe5ee); grid.position.y = 0.001;
    (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.6; scene.add(grid);
    scene.fog = new THREE.Fog(0xeef2f8, 14, 30);

    // podium
    const pod = new THREE.Group(); scene.add(pod);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.45, 0.16, 96), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 }));
    base.position.y = 0.08; base.receiveShadow = true; base.castShadow = true; pod.add(base);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.46, 0.025, 8, 140), new THREE.MeshBasicMaterial({ color: 0xe11d2e })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.16; pod.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.012, 8, 140), new THREE.MeshBasicMaterial({ color: 0x1f45b8, transparent: true, opacity: 0.35 })); ring2.rotation.x = Math.PI / 2; ring2.position.y = 0.01; pod.add(ring2);

    const comp = recipCompressor({ len: 3.4 }); const cw = new THREE.Group(); cw.add(comp); fitToFloor(comp);
    cw.scale.setScalar(0.92); cw.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });
    const holder = new THREE.Group(); holder.add(cw); holder.position.y = 0.16; pod.add(holder);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d3e6, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-4, 10, 7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 }); key.shadow.radius = 6; scene.add(key);
    const rim = new THREE.PointLight(0xe11d2e, 18, 10); rim.position.set(6, 3, -3); scene.add(rim);

    // label anchors in compressor space: top of the pump block, side of the receiver
    const a1 = new THREE.Vector3(-1.0, 2.0, 0), a2 = new THREE.Vector3(1.75, -0.15, 0.3);
    const look = new THREE.Vector3(); let portrait = false;
    const place = () => {
      portrait = size.w / size.h < 0.9;
      if (portrait) {
        pod.position.set(0, 0, 0); camera.position.set(5.2, 6.4, 17.5); look.set(0, 0.9, 0);
        camera.setViewOffset(size.w, size.h, 0, size.h * 0.17, size.w, size.h);
      } else {
        pod.position.set(3.3, 0, 0.2); camera.position.set(-0.6, 4.2, 14); look.set(1.0, 1.2, 0);
        camera.setViewOffset(size.w, size.h, size.w > 1600 ? -size.w * 0.04 : 0, 0, size.w, size.h);
      }
      camera.lookAt(look); camera.updateProjectionMatrix();
    };
    let mx = 0;
    const onMove = (e: PointerEvent) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; };
    window.addEventListener('pointermove', onMove);
    let intro = reducedMotion ? 1 : 0;

    return {
      resize: place,
      update: (t, dt) => {
        if (intro < 1) intro = Math.min(1, intro + dt * 0.7);
        const e = easeOut(clamp01(intro));
        holder.position.y = 0.16 + (1 - e) * 2.2;
        const turn = portrait ? 0.45 + Math.sin(t * 0.4) * 0.25 : 0.42 + Math.sin(t * 0.25) * 0.06 + mx * 0.08;
        cw.rotation.y += (turn - cw.rotation.y) * 0.06;
        holder.updateMatrixWorld(true);
        const show = !portrait && intro > 0.95 ? '1' : '0';
        placeLabel(tag1.current, cw.localToWorld(a1.clone()), camera, size.w, size.h, -5, -5);
        placeLabel(tag2.current, cw.localToWorld(a2.clone()), camera, size.w, size.h, -5, -5);
        if (tag1.current) tag1.current.style.opacity = show;
        if (tag2.current) tag2.current.style.opacity = show;
      },
      dispose: () => window.removeEventListener('pointermove', onMove),
    };
  };

  // a dot on the machine, a short leader line, then the card — on the left or right so it never covers the model
  const tag = (ref: React.RefObject<HTMLDivElement | null>, title: string, sub: string, side: 'left' | 'right') => (
    <div ref={ref} className="float-label opacity-0 transition-opacity duration-500">
      <div className={`flex items-center ${side === 'left' ? '-translate-x-[calc(100%-10px)] flex-row-reverse' : ''}`}>
        <i className="tag3d-dot" />
        <i className="h-px w-10 bg-red/50" />
        <div className="label-card whitespace-nowrap rounded-xl px-3 py-2"><b className="block text-[13px]">{title}</b><span className="text-[11.5px] text-muted">{sub}</span></div>
      </div>
    </div>
  );

  return (
    <section id="air" className="bg-hero relative h-[100svh] min-h-[680px] overflow-hidden">
      <ThreeCanvas setup={setup} className="absolute inset-0" fov={32} envIntensity={0.85} />
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {tag(tag1, 'Two Stage · 2–40 HP', 'Cast-iron pump block', 'left')}
        {tag(tag2, 'Hydro-tested receiver', '70 – 25,000 L', 'right')}
      </div>

      <div className="wrap relative z-10 flex h-full flex-col">
        <div className="mt-auto max-w-[580px] pb-[112px] md:my-auto md:pb-12">
          <h1>
            <span className="mono block text-[10.5px] text-blue md:text-[12px]">● Air compressor manufacturer · Ahmedabad<span className="hidden md:inline"> · Since 2000</span></span>
            <span className="font-display mb-3 mt-2.5 block text-[40px] font-bold leading-[1.02] text-ink md:mb-6 md:mt-4 md:text-[clamp(54px,5.2vw,80px)] md:leading-[0.98]">
              Compressed air that <span className="text-red">never stops.</span>
            </span>
          </h1>
          <p className="max-w-[480px] text-[14.5px] leading-[1.55] text-ink-2 md:text-[18px] md:leading-[1.6]">
            <span className="md:hidden">Compressors, dryers, chillers and receiver tanks running 24/7 in 9 countries.</span>
            <span className="hidden md:inline">Reciprocating, screw and PET compressors, dryers, chillers and receiver tanks — built in GIDC Vatva and running 24/7 in plants across India and 9 countries.</span>
          </p>
          <div className="mt-[18px] flex gap-2 md:mt-8 md:gap-3">
            <Link href="/products" className="btn btn-red flex-1 md:flex-none"><span className="md:hidden">Explore range</span><span className="hidden md:inline">Explore the range →</span></Link>
            <Link href="/solutions/complete-compressed-air-system" className="btn btn-ghost flex-1 bg-white md:flex-none"><span className="md:hidden">Air system</span><span className="hidden md:inline">Plan a complete air system</span></Link>
          </div>
        </div>
        <dl className="absolute inset-x-5 bottom-8 hidden grid-cols-[1fr_1fr_1fr_1fr_1.2fr] border-t border-line pt-6 md:inset-x-14 md:grid xl:inset-x-[72px]">
          {STATS.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-[34px] font-bold leading-none text-ink">{s.value}</dd>
              <dt className="mt-1.5 text-[12.5px] tracking-[0.04em] text-muted">{s.label}</dt>
            </div>
          ))}
          <div className="flex items-center gap-3 self-center justify-self-end">
            <span className="mono text-ink-2">Scroll to enter the plant</span>
            <span className="relative h-[38px] w-6 rounded-[14px] border-2 border-ink/30">
              <span className="absolute left-1/2 top-[7px] -ml-[1.5px] h-2 w-[3px] animate-[mouse-wheel_1.6s_ease-in-out_infinite] rounded-sm bg-red" />
            </span>
          </div>
        </dl>
      </div>
    </section>
  );
}
