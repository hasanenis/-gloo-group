import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    number: '01',
    title: 'Foundation',
    eyebrow: 'Built to begin.',
    body: 'Every lasting structure starts with one deliberate decision. The first line is quiet, precise, and set with intent.',
  },
  {
    number: '02',
    title: 'Structure',
    eyebrow: 'Form takes hold.',
    body: 'Systems, rhythm, and material logic begin to align. What starts as direction becomes something load-bearing and clear.',
  },
  {
    number: '03',
    title: 'Evolution',
    eyebrow: 'Built to adapt.',
    body: 'A project strengthens through refinement. It evolves with use, context, and the realities of the people it serves.',
  },
  {
    number: '04',
    title: 'Legacy',
    eyebrow: 'Beyond completion',
    body: 'A project does not end when construction is complete. Its value continues through the people, places, and generations it serves.',
  },
] as const;

const phaseThresholds = [0.24, 0.5, 0.76];
const accent = '#8f1d1f';

const getActivePhase = (progress: number) => {
  if (progress < phaseThresholds[0]) return 0;
  if (progress < phaseThresholds[1]) return 1;
  if (progress < phaseThresholds[2]) return 2;
  return 3;
};

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activePhase, setActivePhase] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    if (!isDesktop || prefersReducedMotion || !containerRef.current || !pinRef.current) {
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinRef.current,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
      ScrollTrigger.refresh();
    };
  }, [isDesktop, prefersReducedMotion]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setActivePhase(getActivePhase(latest));
  });

  const infinityLength = useTransform(scrollYProgress, [0.08, 0.58], prefersReducedMotion ? [1, 1] : [0, 1]);
  const infinityFillOpacity = useTransform(scrollYProgress, [0.34, 0.72], prefersReducedMotion ? [1, 1] : [0, 1]);
  const infinityStrokeOpacity = useTransform(scrollYProgress, [0.54, 0.78], prefersReducedMotion ? [0, 0] : [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#f7f6f2] font-sans text-[#161616] lg:h-[340vh]"
    >
      <div
        ref={pinRef}
        className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-center px-6 py-20 md:px-10 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(26rem,0.85fr)] lg:items-center lg:gap-14 lg:px-16 lg:py-0"
      >
        <div className="relative order-2 flex min-h-[24rem] items-center lg:order-1 lg:min-h-screen">
          <div className="w-full">
            <div className="mb-8 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#6f6a60] md:mb-10">
              <span className="h-px w-12 bg-black/12" />
              <span>Continuous Process</span>
            </div>

            <div className="relative h-[18rem] sm:h-[20rem] md:h-[23rem] lg:h-[28rem]">
              <svg
                viewBox="2 5 20 14"
                className="h-full w-full overflow-hidden"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <motion.path
                  d="M20.288 9.463a4.856 4.856 0 0 0-4.336-2.3 4.586 4.586 0 0 0-3.343 1.767c.071.116.148.226.212.347l.879 1.652.134-.254a2.71 2.71 0 0 1 2.206-1.519 2.845 2.845 0 1 1 0 5.686 2.708 2.708 0 0 1-2.205-1.518L13.131 12l-1.193-2.26a4.709 4.709 0 0 0-3.89-2.581 4.845 4.845 0 1 0 0 9.682 4.586 4.586 0 0 0 3.343-1.767c-.071-.116-.148-.226-.212-.347l-.879-1.656-.134.254a2.71 2.71 0 0 1-2.206 1.519 2.855 2.855 0 0 1-2.559-1.369 2.825 2.825 0 0 1 0-2.946 2.862 2.862 0 0 1 2.442-1.374h.121a2.708 2.708 0 0 1 2.205 1.518l.7 1.327 1.193 2.26a4.709 4.709 0 0 0 3.89 2.581h.209a4.846 4.846 0 0 0 4.127-7.378z"
                  fill="#e82a2e"
                  style={{ opacity: infinityFillOpacity }}
                />
                <motion.path
                  d="M20.288 9.463a4.856 4.856 0 0 0-4.336-2.3 4.586 4.586 0 0 0-3.343 1.767c.071.116.148.226.212.347l.879 1.652.134-.254a2.71 2.71 0 0 1 2.206-1.519 2.845 2.845 0 1 1 0 5.686 2.708 2.708 0 0 1-2.205-1.518L13.131 12l-1.193-2.26a4.709 4.709 0 0 0-3.89-2.581 4.845 4.845 0 1 0 0 9.682 4.586 4.586 0 0 0 3.343-1.767c-.071-.116-.148-.226-.212-.347l-.879-1.656-.134.254a2.71 2.71 0 0 1-2.206 1.519 2.855 2.855 0 0 1-2.559-1.369 2.825 2.825 0 0 1 0-2.946 2.862 2.862 0 0 1 2.442-1.374h.121a2.708 2.708 0 0 1 2.205 1.518l.7 1.327 1.193 2.26a4.709 4.709 0 0 0 3.89 2.581h.209a4.846 4.846 0 0 0 4.127-7.378z"
                  fill="transparent"
                  stroke={accent}
                  strokeWidth="0.22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pathLength: infinityLength, opacity: infinityStrokeOpacity }}
                />
              </svg>
            </div>

            <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#8b8577]">
              <span className="h-px w-10 bg-black/12" />
              <span>Scroll to reveal the loop</span>
            </div>
          </div>
        </div>

        <div className="order-1 mb-14 flex flex-col justify-center lg:order-2 lg:mb-0 lg:min-h-screen">
          <div className="max-w-[34rem]">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#8f1d1f]">
              Designed to endure
            </p>
            <h2 className="font-sans text-[2.7rem] font-bold leading-[0.95] tracking-[-0.05em] text-[#111] sm:text-[3.6rem] lg:text-[4.85rem]">
              Designed to endure.
            </h2>
            <p className="mt-6 max-w-[31rem] text-base leading-8 text-[#5f6470] sm:text-lg">
              From the first idea to the final structure, every stage is part of a continuous
              process built to evolve, adapt, and remain.
            </p>

            <div className="mt-10 flex items-center gap-4 border-t border-black/10 pt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-[#595349]">
              {phases.map((phase, index) => (
                <div
                  key={phase.number}
                  className={`transition-colors duration-300 ${
                    activePhase === index ? 'text-[#111]' : 'text-black/28'
                  }`}
                >
                  {phase.number}
                </div>
              ))}
            </div>

            <div className="relative mt-8 min-h-[17rem] sm:min-h-[15rem]">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.number}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: activePhase === index ? 1 : 0,
                    y: activePhase === index ? 0 : 18,
                  }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.45, ease: 'easeOut' }}
                  style={{ pointerEvents: activePhase === index ? 'auto' : 'none' }}
                >
                  <div className="flex items-start gap-5">
                    <div className="text-[3rem] font-light leading-none tracking-[-0.08em] text-[#d6d0c4] sm:text-[3.75rem]">
                      {phase.number}
                    </div>
                    <div className="pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8f1d1f]">
                        {phase.eyebrow}
                      </p>
                      <h3 className="mt-3 font-serif text-[2rem] uppercase leading-[0.95] tracking-[-0.04em] text-[#111] sm:text-[2.8rem]">
                        {phase.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 max-w-[30rem] text-[15px] leading-8 text-[#60656f] sm:text-base">
                    {phase.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
