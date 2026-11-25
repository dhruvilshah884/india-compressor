'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeCanvas, type SceneSetup } from '../three/ThreeCanvas';
import { conceptModel, fitToFloor, HOTSPOTS } from '@/lib/three/concept';
import { placeLabel, easeOut, clamp01 } from '@/lib/three/project';
import { variantsFor, defaultVariant, type Product, type ModelKey } from '@/lib/products';
import { whatsappLink } from '@/lib/site';

/** The 3D turntable from concept image 04: swaps models with a fly-in, drag to rotate, hotspots that follow the machine. */
export function Turntable({ model, className = '' }: { model: ModelKey; className?: string }) {
  const modelRef = useRef(model); modelRef.current = model;
  const hots = useRef<(HTMLDivElement | null)[]>([]);
  const [shown, setShown] = useState(model);

  const setup: SceneSetup = ({ scene, camera, canvas, size, reducedMotion }) => {
    const tt = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.3, 0.12, 96), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.05, roughness: 0.35 }));
    tt.position.y = -0.06; tt.receiveShadow = true; scene.add(tt);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.025, 8, 120), new THREE.MeshBasicMaterial({ color: 0xe11d2e })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.01; scene.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.01, 8, 120), new THREE.MeshBasicMaterial({ color: 0x1f45b8, transparent: true, opacity: 0.3 })); ring2.rotation.x = Math.PI / 2; scene.add(ring2);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d3e6, 1.1));
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.12 })); sh.rotation.x = -Math.PI / 2; sh.position.y = -0.12; sh.receiveShadow = true; scene.add(sh);
    const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(5, 8, 6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 }); scene.add(key);
    const rim = new THREE.PointLight(0xe11d2e, 12, 12); rim.position.set(-3.5, 2.5, -2.5); scene.add(rim);

    const spin = new THREE.Group(); scene.add(spin); // drag rotates this
    let cur: { key: ModelKey; g: THREE.Group } | null = null;
    let old: THREE.Group | null = null;
    let tIn = 1, tOut = 1;
    const build = (k: ModelKey) => {
      const m = conceptModel(k); const g = new THREE.Group(); g.add(m); const sz = fitToFloor(m);
      g.userData.k = Math.min((k === 'parts' ? 3.3 : 2.75) / Math.max(sz.x, sz.z), 2.5 / sz.y); g.scale.setScalar(g.userData.k);
      g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });
      spin.add(g); return g;
    };
    cur = { key: modelRef.current, g: build(modelRef.current) };
    tIn = reducedMotion ? 1 : 0;

    // drag to rotate
    let drag = false, lastX = 0, rot = 0, vel = 0, idle = 0;
    const down = (e: PointerEvent) => { drag = true; idle = 0; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; };
    const move = (e: PointerEvent) => { if (!drag) return; const d = (e.clientX - lastX) * 0.01; lastX = e.clientX; rot += d; vel = d; };
    const up = () => { drag = false; canvas.style.cursor = 'grab'; };
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.style.cursor = 'grab'; canvas.style.touchAction = 'pan-y';

    const look = new THREE.Vector3(); let portrait = false;
    const place = () => {
      portrait = size.w / size.h < 0.9;
      if (portrait) { camera.fov = 34; camera.position.set(7.0, 5.2, 16.5); look.set(0, 0.9, 0); camera.setViewOffset(size.w, size.h, 0, size.h * 0.2, size.w, size.h); }
      else { const k = Math.min(1.35, Math.max(1, size.h / 860)); camera.fov = 28; camera.position.set(5.6 * k, 3.9 * k, 11.6 * k); look.set(0.2, 1.0, 0); camera.setViewOffset(size.w, size.h, (-170 / 1440) * size.w * (size.w > 1100 ? 1 : 0.3), 0, size.w, size.h); }
      camera.lookAt(look); camera.updateProjectionMatrix();
    };
    const c = new THREE.Vector3(), w = new THREE.Vector3(), camDir = new THREE.Vector3();
    return {
      resize: place,
      update: (t, dt) => {
        // model swap: old one sinks away, new one flies in and turns 3/4 to camera
        if (cur && modelRef.current !== cur.key) {
          if (old) { spin.remove(old); }
          old = cur.g; tOut = 0;
          cur = { key: modelRef.current, g: build(modelRef.current) }; tIn = reducedMotion ? 1 : 0;
          setShown(cur.key);
        }
        if (old) { tOut = Math.min(1, tOut + dt * 4); const e = easeOut(tOut); old.scale.setScalar(old.userData.k * (1 - e)); old.position.y = -e * 0.6; if (tOut >= 1) { spin.remove(old); old = null; } }
        if (cur) {
          tIn = Math.min(1, tIn + dt * 1.8); const e = easeOut(tIn);
          cur.g.scale.setScalar(cur.g.userData.k * (0.6 + 0.4 * e)); cur.g.position.set((1 - e) * 4, (1 - e) * 1.5, 0);
          cur.g.rotation.y = -0.55 - (1 - e) * 1.6;
        }
        if (drag) idle = 0; else { vel *= 0.92; rot += vel; idle += dt; if (idle > 3 && !reducedMotion) rot += dt * 0.25 * Math.min(1, (idle - 3) / 1.5); }
        spin.rotation.y = rot;
        // hotspots
        const list = (cur && HOTSPOTS[cur.key]) || [];
        spin.updateMatrixWorld(true);
        camera.getWorldDirection(camDir);
        const ready = tIn > 0.98 && !portrait;
        for (let i = 0; i < 4; i++) {
          const el = hots.current[i];
          if (!el) continue;
          const h = list[i];
          if (!h || !cur || !ready) { el.style.opacity = '0'; continue; }
          w.copy(h[0]); cur.g.localToWorld(w);
          c.set(0, w.y, 0); const facing = w.clone().sub(c).normalize().dot(camDir) < 0.25;
          placeLabel(el, w, camera, size.w, size.h, -7, -7);
          el.style.opacity = facing ? '1' : '0';
        }
      },
      dispose: () => { canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); },
    };
  };

  const list = HOTSPOTS[shown] || [];
  return (
    <div className={className}>
      <ThreeCanvas setup={setup} className="absolute inset-0" fov={28} envIntensity={0.8} />
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} ref={(el) => { hots.current[i] = el; }} className="float-label flex items-center gap-2.5 transition-opacity duration-300" style={{ opacity: 0 }}>
            <i className="hot-dot" />
            {list[i] && <span className="label-card rounded-[10px] px-3 py-[7px] text-[13px] font-semibold">{list[i][1]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Spec card (left), counter + next (bottom left), used-in chips and drag hint — the chrome of concept image 04. */
export function ProductCard({ product, index, chapter, details = true }: { product: Product; index: number; total?: number; chapter?: string; details?: boolean }) {
  const variants = variantsFor(product);
  const [vi, setVi] = useState(() => defaultVariant(product));
  useEffect(() => setVi(defaultVariant(product)), [product]);
  const v = variants[Math.min(vi, variants.length - 1)];
  return (
    <div className="panel pointer-events-auto w-full p-5 md:w-[440px] md:p-7">
      <p className="mono text-[10.5px] text-blue md:text-[12px]"><span className="hidden md:inline">{String(index + 1).padStart(2, '0')} · </span>Product · {chapter ?? product.short}</p>
      <h2 className="font-display mb-1 mt-2 text-[28px] font-bold leading-[1.05] md:mb-2 md:mt-2.5 md:text-[46px] md:leading-none">{product.name}</h2>
      <p className="font-display text-[17px] font-bold text-cyan md:text-[22px]">{product.range}</p>
      <p className="mb-4 mt-3 hidden text-[14.5px] leading-[1.6] text-ink-2 md:block">{product.description.split(/(?<=\.)\s/)[0]}</p>
      <div className="mb-3 mt-3 flex gap-1.5 overflow-x-auto md:mb-[18px] md:mt-0 md:flex-wrap md:overflow-visible" role="tablist" aria-label="Sizes">
        {variants.map((x, i) => (
          <button key={x.chip} role="tab" aria-selected={i === vi} className="chip h-[30px] shrink-0 px-3 text-[13px]" data-on={i === vi} onClick={() => setVi(i)}>
            {i === vi && /^\d+(\.\d+)?$/.test(x.chip) && /HP/.test(variants[0].chip) ? `${x.chip} HP` : x.chip}
          </button>
        ))}
      </div>
      <table className="w-full border-collapse text-[13px] md:text-[13.5px]">
        <tbody>
          {v.specs.map(([k, val], i) => (
            <tr key={k} className={i === 3 ? 'max-md:hidden' : ''}>
              <td className="border-t border-line py-2 text-muted md:py-[9px]">{k}</td>
              <td className="border-t border-line py-2 text-right font-semibold md:py-[9px]">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3.5 flex gap-2.5 md:mt-5">
        <a href={whatsappLink(`Hello Parth, please quote ${product.name} — ${v.chip}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-red max-md:hidden">Request quote</a>
        <a href={whatsappLink(`Hello Parth, please send the spec sheet PDF for ${product.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost max-md:h-10 max-md:flex-1 max-md:px-4 max-md:text-[14px]"><span className="md:hidden">⤓ Spec sheet</span><span className="hidden md:inline">⤓ Spec sheet PDF</span></a>
        {details && <Link href={`/products/${product.slug}`} className="btn btn-ghost btn-sm flex-1 md:hidden">Details</Link>}
        {!details && <a href={whatsappLink(`Hello Parth, please quote ${product.name} — ${v.chip}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-red btn-sm flex-1 md:hidden">Get quote</a>}
      </div>
    </div>
  );
}

export function UsedIn({ product }: { product: Product }) {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <span className="mono mr-1 text-muted">Used in</span>
      {product.applications.slice(0, 4).map((a) => <span key={a} className="chip cursor-default bg-white text-[14px]">{a}</span>)}
    </div>
  );
}

export function DragHint() {
  return (
    <div className="hidden items-center gap-2.5 text-[13px] text-ink-2 md:flex">
      <svg width="34" height="20" viewBox="0 0 34 20" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".8"><ellipse cx="17" cy="10" rx="15" ry="6" /><path d="M27 3l3 2-3 3" /></svg>
      Drag to rotate 360°
    </div>
  );
}

export function Counter({ index, total, next, fill, nextHref }: { index: number; total: number; next?: string; fill: number | React.RefObject<HTMLElement | null>; nextHref?: string }) {
  return (
    <div className="flex items-center gap-[18px]">
      <b className="font-display text-[58px] font-bold leading-none text-ink">{String(index + 1).padStart(2, '0')}<small className="text-[22px] text-muted"> / {total}</small></b>
      {next && (
        <div>
          {nextHref
            ? <Link href={nextHref} className="mono mb-2 block text-muted hover:text-ink">Next · {next}</Link>
            : <span className="mono mb-2 block text-muted">Next · {next}</span>}
          <div className="h-[3px] w-[260px] rounded bg-ink/10">
            {typeof fill === 'number'
              ? <i className="block h-full rounded bg-red" style={{ width: `${fill * 100}%` }} />
              : <i ref={fill as React.RefObject<HTMLElement>} className="block h-full w-0 rounded bg-red" />}
          </div>
        </div>
      )}
    </div>
  );
}

/** Phones: "06 / 14 · SCREW" with a red progress line under the navbar (concept image 07). */
export function MobileProgress({ index, total, label, fill }: { index: number; total: number; label: string; fill: number | React.RefObject<HTMLElement | null> }) {
  return (
    <div className="absolute inset-x-5 top-[86px] z-10 flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[0.1em] text-muted md:hidden">
      <span className="uppercase">{String(index + 1).padStart(2, '0')} / {total} · {label}</span>
      <i className="relative h-[3px] flex-1 rounded bg-ink/10">{typeof fill === 'number'
        ? <i className="absolute inset-y-0 left-0 rounded bg-red" style={{ width: `${fill * 100}%` }} />
        : <i ref={fill as React.RefObject<HTMLElement>} className="absolute inset-y-0 left-0 w-0 rounded bg-red" />}</i>
    </div>
  );
}

export { clamp01 };
