import type { CSSProperties } from 'react';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { motionDuration, motionEase, usePrefersReducedMotion } from '../../lib/motion';
import { cn } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

type FeatureProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  conceptImage: string;
  builtImage: string;
  conceptAlt?: string;
  builtAlt?: string;
  className?: string;
};

function Feature({
  eyebrow = 'Design to Delivery',
  title = 'From drawn lines to living buildings',
  description = 'Every project begins as measured intent, then becomes structure, facade, and a place built to endure.',
  conceptImage,
  builtImage,
  conceptAlt = 'Blueprint-style architectural concept',
  builtAlt = 'Built Igloo construction project',
  className = '',
}: FeatureProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const sectionStyle = {
    '--reveal': '78%',
    '--concept-x': '-18px',
    '--built-x': '10px',
    '--veil-x': '-26px',
  } as CSSProperties;

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (prefersReducedMotion) {
        sectionRef.current.style.setProperty('--reveal', '56%');
        sectionRef.current.style.setProperty('--concept-x', '0px');
        sectionRef.current.style.setProperty('--built-x', '0px');
        sectionRef.current.style.setProperty('--veil-x', '0px');
        gsap.set('.design-cinematic-copy, .design-cinematic-media', {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      gsap.set(sectionRef.current, {
        '--reveal': '78%',
        '--concept-x': '-18px',
        '--built-x': '10px',
        '--veil-x': '-26px',
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            once: true,
          },
        })
        .fromTo(
          '.design-cinematic-media',
          { opacity: 0, scale: 1.045 },
          {
            opacity: 1,
            scale: 1,
            duration: motionDuration.cinematic,
            ease: motionEase.smooth,
          },
          0,
        )
        .fromTo(
          '.design-cinematic-copy',
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: motionDuration.slow,
            ease: motionEase.expo,
          },
          0.28,
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=145%',
            scrub: 1.15,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          sectionRef.current,
          {
            '--reveal': '78%',
            '--concept-x': '-18px',
            '--built-x': '10px',
            '--veil-x': '-26px',
          },
          {
            '--reveal': '24%',
            '--concept-x': '20px',
            '--built-x': '-14px',
            '--veil-x': '38px',
            ease: 'none',
          },
          0,
        );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-[#080808] text-white md:min-h-[720px]',
        className,
      )}
      style={sectionStyle}
    >
      <div className="design-cinematic-media absolute inset-0 opacity-0">
        <img
          src={builtImage}
          alt={builtAlt}
          className="absolute inset-0 h-full w-full scale-[1.04] object-cover will-change-transform"
          style={{ transform: 'translate3d(var(--built-x), 0, 0) scale(1.04)' }}
        />

        <div
          className="absolute inset-0 z-10 overflow-hidden will-change-[clip-path,transform]"
          style={{
            clipPath: 'polygon(0 0, calc(var(--reveal) + 16%) 0, calc(var(--reveal) - 12%) 100%, 0 100%)',
            transform: 'translate3d(var(--concept-x), 0, 0) scale(1.06)',
          }}
        >
          <img
            src={conceptImage}
            alt={conceptAlt}
            className="h-full w-full object-cover opacity-95 saturate-0"
            style={{
              filter: 'contrast(1.24) brightness(1.16) sepia(0.18) hue-rotate(158deg) saturate(2.3)',
            }}
          />
          <div className="absolute inset-0 bg-[#0c3552]/64 mix-blend-multiply" />
          <div className="absolute inset-0 opacity-[0.26] mix-blend-screen [background-image:linear-gradient(rgba(255,255,255,.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.32)_1px,transparent_1px)] [background-size:54px_54px]" />
          <div className="absolute inset-0 opacity-[0.28] mix-blend-screen [background-image:linear-gradient(135deg,transparent_44%,rgba(255,255,255,.55)_45%,transparent_47%),linear-gradient(18deg,transparent_57%,rgba(255,255,255,.38)_58%,transparent_60%)]" />
        </div>

        <div
          className="absolute top-[-14%] bottom-[-14%] z-20 w-px origin-center rotate-[10deg] bg-white/70 shadow-[0_0_34px_rgba(255,255,255,0.76)]"
          style={{ left: 'var(--reveal)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_calc(50%+var(--veil-x))_45%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.28)_38%,rgba(0,0,0,0.08)_62%,rgba(0,0,0,0.55)_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-y-0 left-0 z-30 w-full bg-gradient-to-r from-black/82 via-black/42 to-transparent md:w-[72%]" />

      <div className="relative z-40 mx-auto flex h-[100svh] min-h-[640px] max-w-[1526px] items-end px-8 py-16 md:min-h-[720px] md:px-14 md:py-24">
        <div className="design-cinematic-copy max-w-[47rem] opacity-0">
          <p className="mb-5 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.34em] text-[#e82a2e] md:text-[11px]">
            <span className="h-px w-12 bg-[#e82a2e]" />
            {eyebrow}
          </p>
          <h2 className="font-serif text-[3.2rem] uppercase leading-[0.88] tracking-[-0.045em] text-white md:text-[5.4rem] lg:text-[7rem]">
            {title}
          </h2>
          <p className="mt-7 max-w-[33rem] text-[15px] leading-8 text-white/78 md:text-[17px]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

export { Feature };
