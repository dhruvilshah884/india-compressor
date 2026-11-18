'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { conceptModel, fitToFloor } from '@/lib/three/concept';
import type { ModelKey } from '@/lib/products';

/**
 * One fixed, transparent WebGL canvas that draws every product thumbnail on the page into its slot
 * (scissor rendering), instead of one WebGL context per card — browsers allow only ~16 contexts.
 */
type Item = { el: HTMLElement; group: THREE.Group; camera: THREE.PerspectiveCamera; hover: boolean; spin: number };
type Register = (el: HTMLElement, model: ModelKey) => () => void;
const Ctx = createContext<Register | null>(null);

export function ThumbStage({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const items = useRef(new Set<Item>());
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene(); sceneRef.current = scene;
    const pm = new THREE.PMREMGenerator(renderer);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environment = env; scene.environmentIntensity = 0.85;
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c4d8, 1.2));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 7, 6); scene.add(key);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => renderer.setSize(window.innerWidth, window.innerHeight, false);
    resize(); window.addEventListener('resize', resize);
    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (document.hidden) return;
      const H = canvas.clientHeight, W = canvas.clientWidth;
      renderer.setScissorTest(false); renderer.clear(); renderer.setScissorTest(true);
      const all = [...items.current];
      for (const it of all) it.group.visible = false;
      for (const it of all) {
        const r = it.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W || r.width < 2) continue;
        // hover = one full turn, then settle back to the 3/4 view
        if (it.hover && !reduced) it.spin += dt * 2.4; else it.spin += (Math.round(it.spin / (Math.PI * 2)) * Math.PI * 2 - it.spin) * Math.min(1, dt * 3);
        it.group.rotation.y = 0.5 + it.spin;
        it.group.visible = true;
        it.camera.aspect = r.width / r.height; it.camera.updateProjectionMatrix();
        renderer.setViewport(r.left, H - r.bottom, r.width, r.height);
        renderer.setScissor(r.left, H - r.bottom, r.width, r.height);
        renderer.render(scene, it.camera);
        it.group.visible = false;
      }
    };
    loop();
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('resize', resize);
      scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); const mat = m.material as THREE.Material | undefined; if (mat && !Array.isArray(mat)) mat.dispose(); });
      env.dispose(); pm.dispose(); renderer.dispose(); sceneRef.current = null;
    };
  }, []);

  const register: Register = (el, model) => {
    const scene = sceneRef.current;
    if (!scene) return () => {};
    const m = conceptModel(model); const group = new THREE.Group(); group.add(m); fitToFloor(m);
    group.rotation.y = 0.5; group.updateMatrixWorld(true);
    const sph = new THREE.Box3().setFromObject(group).getBoundingSphere(new THREE.Sphere());
    group.visible = false; scene.add(group);
    // frame the model's bounding sphere from a 3/4 view, like the catalogue image
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    const dist = (sph.radius / Math.sin(THREE.MathUtils.degToRad(13))) * 1.08;
    camera.position.set(sph.center.x + dist * 0.62, sph.center.y + dist * 0.42, sph.center.z + dist * 0.66); camera.lookAt(sph.center);
    const it: Item = { el, group, camera, hover: false, spin: 0 };
    const card = el.closest('a, article') ?? el;
    const on = () => { it.hover = true; }, off = () => { it.hover = false; };
    card.addEventListener('pointerenter', on); card.addEventListener('pointerleave', off);
    items.current.add(it);
    return () => {
      card.removeEventListener('pointerenter', on); card.removeEventListener('pointerleave', off);
      items.current.delete(it); scene.remove(group);
      group.traverse((o) => (o as THREE.Mesh).geometry?.dispose?.());
    };
  };

  return (
    <Ctx.Provider value={register}>
      {children}
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] h-screen w-screen" />
    </Ctx.Provider>
  );
}

/** An empty slot; the shared canvas draws the 3D model into it. */
export function ModelThumb({ model, className = '' }: { model: ModelKey; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const register = useContext(Ctx);
  useEffect(() => {
    if (!register || !ref.current) return;
    // the stage's effect runs first (parent), but wait a frame to be safe
    let undo = () => {};
    const id = requestAnimationFrame(() => { if (ref.current) undo = register(ref.current, model); });
    return () => { cancelAnimationFrame(id); undo(); };
  }, [register, model]);
  return <div ref={ref} className={className} aria-hidden="true" />;
}
