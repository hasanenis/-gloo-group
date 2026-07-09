import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motionDuration, motionEase, motionStagger, usePrefersReducedMotion } from '../lib/motion';

const VERTICAL_LINES = [60, 720, 1380] as const;
const HORIZONTAL_LINES = [72, 690, 1406, 2122, 3196] as const;
const GRID_MARKS = [
  { x: 720, y: 72 },
  { x: 60, y: 690 },
  { x: 1380, y: 690 },
  { x: 720, y: 1406 },
  { x: 720, y: 2122 },
] as const;

export default function HomeMechanicalBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = backdropRef.current;
      if (!root) return;

      const grid = root.querySelector<HTMLElement>('[data-home-grid]');
      const lines = Array.from(root.querySelectorAll('[data-home-grid-line]'));
      const marks = Array.from(root.querySelectorAll('[data-home-grid-mark]'));

      if (prefersReducedMotion) {
        gsap.set(root, { opacity: 1 });
        gsap.set(grid, { opacity: 1, clearProps: 'transform' });
        gsap.set([...lines, ...marks], { opacity: 1, scale: 1, clearProps: 'transform' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: motionEase.soft } });

      tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: motionDuration.section }, 0)
        .fromTo(grid, { opacity: 0 }, { opacity: 1, duration: motionDuration.slow }, 0.03)
        .fromTo(
          lines,
          { opacity: 0 },
          { opacity: 1, duration: motionDuration.section, stagger: 0.045 },
          0.1,
        )
        .fromTo(
          marks,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: motionDuration.section * 0.55, stagger: motionStagger.tight },
          0.22,
        );
    },
    { scope: backdropRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <div
      ref={backdropRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-0"
      style={{ mixBlendMode: 'multiply' }}
    >
      <div
        data-home-grid
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(17,17,17,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.026) 1px, transparent 1px)',
          backgroundPosition: 'clamp(24px, 4vw, 72px) 40px',
          backgroundSize: 'clamp(300px, 46vw, 860px) clamp(260px, 38vw, 680px)',
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 4200"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.48">
          {VERTICAL_LINES.map((x) => (
            <line
              key={`vertical-${x}`}
              data-home-grid-line
              x1={x}
              x2={x}
              y1="0"
              y2="4200"
              stroke="#111111"
              strokeOpacity="0.042"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {HORIZONTAL_LINES.map((y) => (
            <line
              key={`horizontal-${y}`}
              data-home-grid-line
              x1="0"
              x2="1440"
              y1={y}
              y2={y}
              stroke="#111111"
              strokeOpacity="0.035"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {GRID_MARKS.map((mark) => (
            <g
              key={`mark-${mark.x}-${mark.y}`}
              data-home-grid-mark
              opacity="0"
              transform={`translate(${mark.x} ${mark.y})`}
            >
              <line x1="-10" x2="10" y1="0" y2="0" stroke="#111111" strokeOpacity="0.09" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <line x1="0" x2="0" y1="-10" y2="10" stroke="#111111" strokeOpacity="0.09" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </g>
          ))}

        </g>
      </svg>
    </div>
  );
}
