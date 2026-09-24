import { ScrollTrigger } from 'gsap/ScrollTrigger';

let frame = 0;
/** All section mounts and text fits share one layout refresh per frame. */
export function requestLayoutRefresh() {
  if (frame || typeof window === 'undefined') return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    ScrollTrigger.refresh();
  });
}
