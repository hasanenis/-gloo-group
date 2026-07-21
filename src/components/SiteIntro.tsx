import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import introAnimation from '../assets/lottie/intro.json';
import iglooIntroLogo from '../assets/branding/igloo-intro-logo.png';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from '../lib/motion';

type SiteIntroProps = {
  onComplete: () => void;
};

export default function SiteIntro({ onComplete }: SiteIntroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (prefersReducedMotion) {
      const timer = window.setTimeout(onComplete, 700);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = previousOverflow;
      };
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete, prefersReducedMotion]);

  useGSAP(() => {
    if (prefersReducedMotion) return;

    gsap.set('.intro-igloo-lockup', {
      autoAlpha: 1,
      display: 'flex',
    });
    gsap.set('.intro-logo-image', {
      y: 28,
      scale: 0.96,
      autoAlpha: 0,
      filter: 'blur(4px)',
    });
    gsap.set('.intro-igloo-line', {
      scaleX: 0,
      autoAlpha: 0,
      transformOrigin: '50% 50%',
    });
    gsap.set('.intro-tag-build, .intro-tag-above', {
      yPercent: -115,
      autoAlpha: 0,
    });
    gsap.set('.intro-tag-beyond', {
      yPercent: 115,
      autoAlpha: 0,
    });
    gsap.set('.intro-tag-shell', {
      autoAlpha: 0,
    });
    gsap.set('.intro-tag-dot', {
      autoAlpha: 0,
      scale: 0.8,
    });

    const tl = gsap.timeline();

    tl.to('.intro-logo-image', {
      y: 0,
      scale: 1,
      autoAlpha: 1,
      filter: 'blur(0px)',
      duration: 1.3,
      ease: 'power3.out',
    })
      .to('.intro-igloo-line', {
        scaleX: 1,
        autoAlpha: 1,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.4')
      .to({}, { duration: 1.25 })
      .to('.intro-igloo-lockup', {
        y: -42,
        autoAlpha: 0,
        duration: 0.82,
        ease: 'power3.inOut',
      })
      .set('.intro-igloo-lockup', { display: 'none' })
      .to({}, { duration: 0.22 })
      .set('.intro-tag-shell', { autoAlpha: 1 })
      .to('.intro-tag-dot', {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
      .to('.intro-tag-build', {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power4.out',
      }, '-=0.1')
      .to('.intro-tag-above', {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power4.out',
      }, '-=0.7')
      .to('.intro-tag-beyond', {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.98,
        ease: 'power4.out',
      }, '-=0.76')
      .to({}, { duration: 0.55 })
      .to('.intro-tag-shell', {
        y: -10,
        autoAlpha: 0,
        duration: 0.75,
        ease: 'power2.out',
      })
      .to('.intro-tag-dot', {
        autoAlpha: 0,
        scale: 0.92,
        duration: 0.75,
        ease: 'power2.out',
      }, '<')
      .to({}, {
        duration: 0.3,
        onComplete: () => {
          requestAnimationFrame(() => {
            completeRef.current();
          });
        },
      });
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <div ref={containerRef} className="intro-backdrop fixed inset-0 z-[140] flex items-center justify-center bg-black">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-6">
        <div className="intro-igloo-lockup absolute inset-0 flex flex-col items-center justify-center">
          <img
            src={iglooIntroLogo}
            alt="igloo Construction"
            width={860}
            height={220}
            className="intro-logo-image mb-4 w-[min(48vw,430px)] min-w-[210px] max-w-[430px] object-contain"
          />
          <div className="intro-igloo-line h-px w-28 bg-white/22 md:w-40" />
        </div>

        <div className="intro-tag-shell absolute inset-x-5 top-1/2 flex w-[calc(100vw-2.5rem)] -translate-y-1/2 flex-col items-start justify-center gap-1 font-sans text-[clamp(3rem,15vw,4.75rem)] font-[350] leading-[0.88] tracking-normal text-white md:left-[3.6vw] md:right-auto md:w-auto md:max-w-none md:flex-row md:items-center md:justify-start md:gap-[0.16em] md:text-[clamp(2.7rem,7vw,5.8rem)] md:leading-none">
          <div className="overflow-hidden leading-none">
            <span className="intro-tag-build inline-block">Bâtir.</span>
          </div>
          <div className="overflow-hidden leading-none">
            <span className="intro-tag-above inline-block">Plus haut.</span>
          </div>
          <div className="overflow-hidden leading-none">
            <span className="intro-tag-beyond inline-block text-[#ff3b30]">Plus loin.</span>
          </div>
        </div>

        <div className="intro-tag-dot absolute bottom-[4.2vh] right-[4.2vw] h-4 w-4 rounded-full bg-[#ff3b30]" />

        <Lottie
          animationData={introAnimation}
          loop={false}
          autoplay
          className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid meet',
          }}
        />
      </div>
    </div>
  );
}
