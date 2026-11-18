import * as THREE from 'three';

const v = new THREE.Vector3();
/** Move a DOM label so its anchor sits on a 3D point. Returns the screen position (CSS px). */
export function placeLabel(el: HTMLElement | null | undefined, world: THREE.Vector3, cam: THREE.Camera, w: number, h: number, dx = 0, dy = 0) {
  v.copy(world).project(cam);
  const x = ((v.x + 1) / 2) * w, y = ((1 - v.y) / 2) * h;
  if (el) { el.style.transform = `translate3d(${(x + dx).toFixed(1)}px, ${(y + dy).toFixed(1)}px, 0)`; el.style.visibility = v.z < 1 ? 'visible' : 'hidden'; }
  return { x, y };
}
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
