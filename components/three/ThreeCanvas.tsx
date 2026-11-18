'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface SceneCtx {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  size: { w: number; h: number };
  reducedMotion: boolean;
}
export interface SceneHandle {
  /** called every frame while the canvas is on screen */
  update?: (t: number, dt: number) => void;
  resize?: (w: number, h: number) => void;
  dispose?: () => void;
  /** render with this camera instead of the default perspective one (e.g. an orthographic camera) */
  camera?: THREE.Camera;
}
export type SceneSetup = (ctx: SceneCtx) => SceneHandle | void;

/**
 * A transparent WebGL canvas that fills its parent. The page background shows through, so the same
 * scene works in light and dark theme. Rendering pauses when the canvas scrolls off screen.
 */
export function ThreeCanvas({ setup, className = '', fov = 30, shadows = true, envIntensity = 0.8, frameloop = 'always' }: {
  setup: SceneSetup; className?: string; fov?: number; shadows?: boolean; envIntensity?: number; frameloop?: 'always' | 'demand';
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer);
    const envTex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = envIntensity;
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 200);
    const size = { w: 1, h: 1 };
    const handle = setupRef.current({ scene, camera, renderer, canvas, size, reducedMotion }) || {};

    const resize = () => {
      const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
      size.w = w; size.h = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      handle.resize?.(w, h);
      renderer.render(scene, handle.camera ?? camera);
    };
    const ro = new ResizeObserver(resize); ro.observe(host); resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '200px' });
    io.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) { clock.getDelta(); return; }
      const dt = Math.min(clock.getDelta(), 0.05);
      handle.update?.(reducedMotion ? 0 : clock.elapsedTime, dt);
      renderer.render(scene, handle.camera ?? camera);
    };
    if (frameloop === 'always') loop();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      handle.dispose?.();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose?.();
      });
      envTex.dispose(); pm.dispose(); renderer.dispose(); canvas.remove();
    };
  }, [fov, shadows, envIntensity, frameloop]);

  // only add `relative` when the caller didn't position it — `relative` would override `absolute`
  // in the generated CSS and collapse the canvas to 0px height
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className);
  return <div ref={hostRef} className={positioned ? className : `relative ${className}`} aria-hidden="true" />;
}

/** standard 3-point light rig used across the site */
export function addLights(scene: THREE.Scene, { key = 2.4, rimColor = 0xe11d2e, rim = 18, shadowSize = 12 } = {}) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d3e6, 1.0));
  const k = new THREE.DirectionalLight(0xffffff, key);
  k.position.set(6, 10, 7); k.castShadow = true; k.shadow.mapSize.set(2048, 2048); k.shadow.bias = -0.0004;
  Object.assign(k.shadow.camera, { left: -shadowSize, right: shadowSize, top: shadowSize, bottom: -shadowSize, near: 1, far: 50 });
  scene.add(k);
  const r = new THREE.PointLight(rimColor, rim, 14); r.position.set(-5, 3, -4); scene.add(r);
  return k;
}

/** an invisible floor that only shows soft shadows, so models sit on the page background */
export function shadowFloor(scene: THREE.Scene, opacity = 0.18, size = 60) {
  const f = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShadowMaterial({ opacity }));
  f.rotation.x = -Math.PI / 2; f.receiveShadow = true; scene.add(f);
  return f;
}
