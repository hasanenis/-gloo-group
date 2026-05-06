import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { usePrefersReducedMotion } from '../lib/motion';

const steps = [
  {
    title: "Phase 1",
    heading: "Endless Vision",
    desc: "Every project begins with a vision that looks beyond the present. We design structures with infinite possibilities, making sure the foundation is as strong as your aspirations."
  },
  {
    title: "Phase 2",
    heading: "Continuous Innovation",
    desc: "Technology and engineering never stop evolving, and neither do we. We apply an endless cycle of modernization, using cutting-edge BIM and smart construction practices."
  },
  {
    title: "Phase 3",
    heading: "Unbreakable Trust",
    desc: "Trust is a continuous loop. We maintain complete transparency throughout the lifecycle of the project, establishing bonds with our clients that last forever."
  },
  {
    title: "Phase 4",
    heading: "Timeless Legacy",
    desc: "We don't just build for tomorrow; we build for eternity. Our commitment to sustainability ensures that our structures provide value for generations to come."
  }
];

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeStep, setActiveStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update active step based on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.25) setActiveStep(0);
    else if (latest < 0.5) setActiveStep(1);
    else if (latest < 0.75) setActiveStep(2);
    else setActiveStep(3);
  });

  // Draw progression (finishes perfectly right before the end)
  const drawProgress = useTransform(scrollYProgress, [0, 0.8], prefersReducedMotion ? [1.05, 1.05] : [0, 1.05]);
  
  // Fade in original red fill when drawing reaches the end
  const fillOpacity = useTransform(scrollYProgress, [0.8, 1], prefersReducedMotion ? [1, 1] : [0, 1]);
  
  // Fade out black stroke just slightly at the very end
  const strokeOpacity = useTransform(scrollYProgress, [0.8, 1], prefersReducedMotion ? [0, 0] : [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-white text-black font-sans">
      <div className="sticky top-0 h-screen w-full flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 overflow-hidden pt-20 lg:pt-28">
        
        {/* Animated Logo */}
        <div className="w-full lg:w-1/2 h-[40%] lg:h-full flex items-center justify-center lg:justify-start relative">
          <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[350px] md:h-[350px] lg:w-[480px] lg:h-[480px] xl:w-[580px] xl:h-[580px] relative pointer-events-none lg:-ml-8 xl:-ml-16">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-sm"
            >
              <defs>
                 <linearGradient id="redGradInf" x1="0" y1="0" x2="1" y2="0">
                   <stop offset="0%" stopColor="#b30000"/>
                   <stop offset="50%" stopColor="#ff3333"/>
                   <stop offset="100%" stopColor="#e82a2e"/>
                 </linearGradient>
              </defs>

              {/* Animated stroke drawing */}
              <motion.path 
                d="M20.288 9.463a4.856 4.856 0 0 0-4.336-2.3 4.586 4.586 0 0 0-3.343 1.767c.071.116.148.226.212.347l.879 1.652.134-.254a2.71 2.71 0 0 1 2.206-1.519 2.845 2.845 0 1 1 0 5.686 2.708 2.708 0 0 1-2.205-1.518L13.131 12l-1.193-2.26a4.709 4.709 0 0 0-3.89-2.581 4.845 4.845 0 1 0 0 9.682 4.586 4.586 0 0 0 3.343-1.767c-.071-.116-.148-.226-.212-.347l-.879-1.656-.134.254a2.71 2.71 0 0 1-2.206 1.519 2.855 2.855 0 0 1-2.559-1.369 2.825 2.825 0 0 1 0-2.946 2.862 2.862 0 0 1 2.442-1.374h.121a2.708 2.708 0 0 1 2.205 1.518l.7 1.327 1.193 2.26a4.709 4.709 0 0 0 3.89 2.581h.209a4.846 4.846 0 0 0 4.127-7.378z" 
                fill="transparent" 
                stroke="#1a1a1a"
                strokeWidth="0.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: drawProgress, opacity: strokeOpacity }}
              />
              
              {/* Red original fill that fades in at end */}
              <motion.path 
                d="M20.288 9.463a4.856 4.856 0 0 0-4.336-2.3 4.586 4.586 0 0 0-3.343 1.767c.071.116.148.226.212.347l.879 1.652.134-.254a2.71 2.71 0 0 1 2.206-1.519 2.845 2.845 0 1 1 0 5.686 2.708 2.708 0 0 1-2.205-1.518L13.131 12l-1.193-2.26a4.709 4.709 0 0 0-3.89-2.581 4.845 4.845 0 1 0 0 9.682 4.586 4.586 0 0 0 3.343-1.767c-.071-.116-.148-.226-.212-.347l-.879-1.656-.134.254a2.71 2.71 0 0 1-2.206 1.519 2.855 2.855 0 0 1-2.559-1.369 2.825 2.825 0 0 1 0-2.946 2.862 2.862 0 0 1 2.442-1.374h.121a2.708 2.708 0 0 1 2.205 1.518l.7 1.327 1.193 2.26a4.709 4.709 0 0 0 3.89 2.581h.209a4.846 4.846 0 0 0 4.127-7.378z" 
                fill="url(#redGradInf)" 
                style={{ opacity: fillOpacity }}
              />
            </svg>
          </div>
        </div>

        {/* Right Side: Text & Tabs */}
        <div className="w-full lg:w-1/2 h-[60%] lg:h-full flex flex-col justify-start lg:justify-center p-6 lg:p-0 lg:pl-12 xl:pl-16 relative z-10">
          <div className="max-w-xl mx-auto lg:mx-0 w-full relative z-10 bg-white/80 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none p-4 lg:p-0 rounded-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight text-black">
              Together to <span className="text-[#e82a2e]">eternity</span>
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-10 text-base sm:text-lg">
              Our process is an ongoing cycle of innovation, quality, and trust. We push boundaries to deliver timeless structures that stand strong forever.
            </p>

            {/* Step Tabs */}
            <div className="flex space-x-4 sm:space-x-8 mb-6 sm:mb-8 text-sm sm:text-base font-medium relative border-b border-gray-200">
              {steps.map((step, i) => (
                <div 
                  key={i} 
                  className={`pb-3 sm:pb-4 transition-colors duration-300 relative z-10 cursor-pointer ${activeStep >= i ? 'text-black font-bold' : 'text-gray-400 font-medium'}`}
                  onClick={() => setActiveStep(i)}
                >
                  {step.title}
                  {activeStep === i && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e82a2e]"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="relative h-48 sm:h-44 md:h-48 overflow-hidden">
              {steps.map((step, i) => (
                <motion.div 
                  key={i} 
                  className="absolute top-0 left-0 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: activeStep === i ? 1 : 0, y: activeStep === i ? 0 : 20 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
                  style={{ pointerEvents: activeStep === i ? 'auto' : 'none' }}
                >
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-black">
                    {step.heading}
                  </h3>
                  <p className="text-gray-600 leading-[1.72] text-sm sm:text-base md:text-lg font-normal max-w-[34rem]">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-2 text-gray-400 text-xs sm:text-sm flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gray-300"></span>
              keep scrolling
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
