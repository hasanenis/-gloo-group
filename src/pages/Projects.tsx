import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Mail, Sun, Moon, ChevronDown, Leaf, Building2, HardHat, MapPin, Calendar } from 'lucide-react';
import { motionDuration, motionDurationFor, motionEase, motionStagger, usePrefersReducedMotion } from '../lib/motion';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const projectNameRef = useRef<HTMLSpanElement>(null);
  const menuProjectNameRef = useRef<HTMLSpanElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();
  const menuTl = useRef<gsap.core.Timeline>();
  const firstProject = projects[0];
  const secondProject = projects[1];
  const thirdProject = projects[2];
  const fourthProject = projects[4];

  const getProjectIndexFromSlug = (slug: string) => {
    if (slug === firstProject.slug) return 0;
    if (slug === secondProject.slug) return 1;
    if (slug === thirdProject.slug) return 2;
    if (slug === fourthProject.slug) return 3;
    return 0;
  };

  const getProjectProgress = (index: number) => {
    if (index === 1) return 30.5 / 79;
    if (index === 2) return 47.5 / 79;
    if (index === 3) return 64.5 / 79;
    return 0;
  };

  const goToProject = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: scrollHeight * getProjectProgress(index),
      behavior,
    });
  };

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(['.bg-image', '.top-header', '.title-serif', '.title-script', '.bottom-menu', '.full-menu', '.menu-item', '.scroll-cue', '.scroll-cue-shell', '.scroll-wheel', '.scroll-arrow'], {
        clearProps: 'all',
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      });
      return;
    }

    const tl = gsap.timeline();

    gsap.set('.bg-image', { scale: 1.1 });
    gsap.set(['.top-header', '.title-serif', '.title-script', '.bottom-menu'], { 
      y: 30, 
      opacity: 0 
    });
    gsap.set('.content-canvas', {
      opacity: 0.42
    });
    gsap.set('.scroll-cue', {
      y: 22,
      opacity: 0
    });

    tl.to('.bg-image', {
      scale: 1,
      duration: motionDurationFor(2.6),
      ease: motionEase.soft
    })
    .to('.top-header', {
      y: 0,
      opacity: 1,
      duration: motionDuration.hero,
      ease: motionEase.soft
    }, '-=2.5')
    .to('.title-serif', {
      y: 0,
      opacity: 1,
      duration: motionDuration.slow,
      ease: motionEase.smooth
    }, '-=2.0')
    .to('.title-script', {
      y: 0,
      opacity: 1,
      duration: motionDuration.slow,
      ease: motionEase.smooth
    }, '-=1.6')
    .to('.bottom-menu', {
      y: 0,
      opacity: 1,
      duration: motionDuration.hero,
      ease: motionEase.soft
    }, '-=1.2')
    .to('.scroll-cue', {
      y: 0,
      opacity: 1,
      duration: motionDuration.hero,
      ease: motionEase.soft
    }, '-=1.2');

    gsap.timeline({
      repeat: -1,
      defaults: {
        ease: 'power2.inOut'
      }
    })
      .to('.scroll-cue-shell', {
        y: 8,
        duration: 1.2,
        yoyo: true,
        repeat: 1
      }, 0)
      .fromTo('.scroll-wheel',
        { y: 0, opacity: 1 },
        { y: 12, opacity: 0, duration: 0.9, ease: 'power2.in' },
        0.15
      )
      .set('.scroll-wheel', { y: -4, opacity: 0 }, 1.08)
      .to('.scroll-wheel', { y: 0, opacity: 1, duration: 0.28 }, 1.14)
      .to('.scroll-arrow', {
        y: 8,
        opacity: 0.3,
        stagger: 0.08,
        duration: 0.45,
        yoyo: true,
        repeat: 1
      }, 0.2);

    gsap.to('.scroll-cue', {
      opacity: 0,
      y: -16,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top top',
        end: '+=220',
        scrub: true
      }
    });

    // Menu timeline
    gsap.set('.full-menu', { y: '100%', opacity: 0, pointerEvents: 'none' });
    menuTl.current = gsap.timeline({ paused: true })
      .to('.full-menu', {
        y: '0%',
        opacity: 1,
        pointerEvents: 'auto',
        duration: motionDuration.section,
        ease: motionEase.inOut
      })
      .fromTo('.menu-item', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: motionStagger.standard, duration: motionDuration.hover, ease: motionEase.soft },
        '-=0.4'
      );

    // Scroll animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.9,
        onUpdate: (self) => {
          let currentProject = "DOUAOUDA HOUSING";
          if (self.progress > 0.81) currentProject = "SAID HAMDINE";
          else if (self.progress > 0.6) currentProject = "STAOUELI VILLAS";
          else if (self.progress > 0.38) currentProject = "SIDI ABDALLAH";
          if (projectNameRef.current) projectNameRef.current.innerText = currentProject;
          if (menuProjectNameRef.current) menuProjectNameRef.current.innerText = currentProject;
        }
      }
    });

    scrollTl
      // === PROJECT 1 ===
      .to('.top-header', {
        x: '8vw',
        ease: 'power1.inOut',
        duration: 1.35
      }, 0)
      .to('.top-header', {
        opacity: 0,
        ease: 'power1.out',
        duration: 1.9
      }, 0.35)
      .to('.content-canvas', {
        x: '-50vw',
        ease: 'power1.inOut',
        duration: 2
      }, 0)
      .to('.content-canvas', {
        opacity: 1,
        ease: 'power1.out',
        duration: 1.85
      }, 0.15)
      .to('.title-content', {
        x: '-60vw',
        ease: 'power1.inOut',
        duration: 2
      }, 0)
      .to('.title-content', {
        opacity: 0,
        ease: 'power1.out',
        duration: 2.25
      }, 0.55)
      .to('.content-canvas', {
        x: '-100vw',
        ease: 'power1.inOut',
        duration: 2
      }, 2)
      // Paris Commercial Element Animations (replaces diagonal scroll)
      .fromTo('.p-anim-redline', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1, ease: 'power2.out' }, 2.5)
      .fromTo('.p-anim-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1.5, ease: 'power3.out' }, 2.8)
      .fromTo('.p-anim-stat', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power2.out' }, 3.2)
      .fromTo('.p-anim-quote', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, ease: 'power2.out' }, 3.5)
      .fromTo('.p-anim-img', { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' }, 3.8)
      .fromTo('.p-anim-green', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, ease: 'power2.out' }, 4)

      .to('.diagonal-container', {
        x: '-80vw',
        y: '-80vh',
        ease: 'none',
        duration: 2.28
      }, 5)
      .to('.diagonal-container', {
        x: '-280vw',
        y: '-80vh',
        ease: 'none',
        duration: 5.72
      }, 7.28)
      .to('.project-photos-header', {
        x: '200vw',
        ease: 'none',
        duration: 5.72
      }, 7.28)
      .to('.diagonal-container', {
        x: '-500vw',
        y: '-300vh',
        ease: 'none',
        duration: 6.29
      }, 13.0)
      .to('.diagonal-container', {
        x: '-700vw',
        ease: 'none',
        duration: 5.71
      }, 19.29)

      // PAUSE on P1 ending slide
      .to('.panel-1-final-img', {
        scale: 1.035,
        ease: 'none',
        duration: 3
      }, 25.0)

      // === TRANSITION P1 -> P2 ===
      .to('.content-canvas', {
        x: '-200vw', // slide out to left
        ease: 'power2.inOut',
        duration: 2.2
      }, 28.0) // 0.5s pause after P1 ends
      .to('.project-2-cover', {
        x: '-100vw', // slide in from right
        ease: 'power2.inOut',
        duration: 2.2
      }, 28.0)
      
      // === PROJECT 2 (AlgÃ©rie Tower) ===
      .to('.project-2-canvas', {
        x: '50vw', // slide in from left
        ease: 'power2.inOut',
        duration: 1.85
      }, 31.0) // 0.5s pause after cover slides in
      .to('.project-2-cover-title', {
        x: '60vw',
        opacity: 0,
        ease: 'power2.inOut',
        duration: 1.35
      }, 31.0)
      .to('.project-2-canvas', {
        x: '100vw', // fully cover
        ease: 'power2.inOut',
        duration: 1.5
      }, 32.5) // ends at 34.0

      .to('.project-2-diagonal', {
        x: '120vw', // move content right
        y: '-120vh',
        ease: 'none',
        duration: 4
      }, 34.0)
      .to('.project-2-diagonal', {
        x: '220vw', // further right
        ease: 'none',
        duration: 4
      }, 38.0) // ends at 42.0

      // PAUSE on P2 ending slide
      .to('.panel-2-final-img', {
        scale: 1.035,
        ease: 'none',
        duration: 3
      }, 42.0)
      
      // === TRANSITION P2 -> P3 ===
      .to('.project-2-canvas', {
        x: '200vw', // slide out to right
        ease: 'power2.inOut',
        duration: 2.2
      }, 45.0) // 0.5s pause after P2 ends
      .to('.project-3-cover', {
        x: '100vw', // slide in from left (starting at -100vw)
        ease: 'power2.inOut',
        duration: 2.2
      }, 45.0)
      
      // === PROJECT 3 (Lyon Complex) ===
      .to('.project-3-canvas', {
        x: '-50vw', // slide in from right (starting at 100vw)
        ease: 'power2.inOut',
        duration: 1.85
      }, 48.0) // 0.5s pause on P3 cover
      .to('.project-3-cover-title', {
        x: '-60vw',
        opacity: 0,
        ease: 'power2.inOut',
        duration: 1.35
      }, 48.0)
      .to('.project-3-canvas', {
        x: '-100vw', // fully cover
        ease: 'power2.inOut',
        duration: 1.5
      }, 49.5) // ends at 51.0

      .to('.project-3-diagonal', {
        x: '-120vw', // move content left
        y: '-120vh',
        ease: 'none',
        duration: 4
      }, 51.0)
      .to('.project-3-diagonal', {
        x: '-220vw', // further left
        ease: 'none',
        duration: 4
      }, 55.0) // ends at 59.0

      // PAUSE on P3 ending slide
      .to('.panel-3-final-img', {
        scale: 1.035,
        ease: 'none',
        duration: 3
      }, 59.0)

      // === TRANSITION P3 -> P4 ===
      .to('.project-3-canvas', {
        x: '-200vw',
        ease: 'power2.inOut',
        duration: 2.2
      }, 62.0)
      .to('.project-4-cover', {
        x: '-100vw',
        ease: 'power2.inOut',
        duration: 2.2
      }, 62.0)

      // === PROJECT 4 (Said Hamdine) ===
      .to('.project-4-canvas', {
        x: '50vw',
        ease: 'power2.inOut',
        duration: 1.85
      }, 65.0)
      .to('.project-4-cover-title', {
        x: '60vw',
        opacity: 0,
        ease: 'power2.inOut',
        duration: 1.35
      }, 65.0)
      .to('.project-4-canvas', {
        x: '100vw',
        ease: 'power2.inOut',
        duration: 1.5
      }, 66.5)
      .to('.project-4-diagonal', {
        x: '120vw',
        y: '-120vh',
        ease: 'none',
        duration: 4
      }, 68.0)
      .to('.project-4-diagonal', {
        x: '220vw',
        ease: 'none',
        duration: 4
      }, 72.0)
      .to('.panel-4-final-img', {
        scale: 1.035,
        ease: 'none',
        duration: 3
      }, 76.0); // ends at 79.0

  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (menuOpen) {
      menuTl.current?.play();
    } else {
      menuTl.current?.reverse();
    }
  }, [menuOpen, prefersReducedMotion]);

  const scrollToProject = (index: number) => {
    setMenuOpen(false);
    
    // We delay the scroll by a small amount to allow the menu animation to start closing
    setTimeout(() => {
      goToProject(index, prefersReducedMotion ? 'auto' : 'smooth');
    }, 400); 
  };

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const slug = location.hash.replace('#', '');
    const behavior = prefersReducedMotion ? 'auto' : 'auto';

    const syncScroll = () => {
      if (!slug) {
        window.scrollTo({ top: 0, behavior });
        return;
      }

      goToProject(getProjectIndexFromSlug(slug), behavior);
    };

    syncScroll();

    return undefined;
  }, [location.key, location.hash, prefersReducedMotion]);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [isLightMode]);

  return (
    <main className="bg-black text-white w-full relative scroll-container h-[10000vh]" ref={containerRef}>
      
      {/* Fixed Bottom Menu */}
      <div className={`bottom-menu fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-[40] pb-6 md:pb-10 px-4 pointer-events-auto flex items-center justify-center ${isLightMode ? 'max-w-[400px] md:max-w-[460px] gap-0' : 'max-w-[380px] md:max-w-[500px] gap-2'}`}>
        
        {isLightMode ? (
          <div className="flex items-center w-full bg-[#f9f9f9]/95 backdrop-blur-xl shadow-[0px_10px_30px_rgba(0,0,0,0.06)] rounded-full px-2 py-2 border border-black/5">
             <Link to="/" className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-black hover:text-[#e82a2e] transition-colors shrink-0">
               <Home className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
             </Link>
             
             <div className="flex-1 px-2 border-l border-r border-black/10 mx-2">
                 <button 
                  onClick={() => setMenuOpen(true)}
                  className="w-full h-10 md:h-11 px-2 flex items-center justify-center gap-3 text-black transition-colors uppercase tracking-[0.1em] text-[8.5px] md:text-[10px] font-bold font-sans cursor-pointer hover:text-[#e82a2e]"
                 >
                    <div className="flex flex-col gap-[2px] md:gap-[2.5px] w-2.5 md:w-3 shrink-0 text-[#e82a2e]">
                      <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                      <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                      <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                    </div>
                    <span className="text-center whitespace-nowrap overflow-hidden text-ellipsis pt-[1px] text-[9px] md:text-[10px] tracking-[0.14em]" ref={projectNameRef}>DOUAOUDA HOUSING</span>
                    <div className="flex flex-col gap-[2px] md:gap-[2.5px] w-2.5 md:w-3 shrink-0 text-[#e82a2e]">
                      <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                      <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                      <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                    </div>
                 </button>
             </div>

             <Link to="/contact" className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-black hover:text-[#e82a2e] transition-colors shrink-0">
               <Mail className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
             </Link>
          </div>
        ) : (
          <>
            <Link to="/" className="bg-[#1a1a1a]/80 backdrop-blur-md text-white shadow-2xl border border-white/10 h-11 md:h-12 w-11 md:w-12 flex items-center justify-center hover:bg-black hover:text-[#e82a2e] transition-colors rounded-none shrink-0 cursor-pointer">
              <Home className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
            
            <div className="flex-1 w-full max-w-[220px] md:max-w-[320px]">
              <button 
                onClick={() => setMenuOpen(true)}
                className="bg-[#1a1a1a]/80 backdrop-blur-md text-[#e82a2e] shadow-2xl border border-white/10 w-full h-11 md:h-12 px-4 md:px-8 flex items-center justify-between hover:bg-black transition-colors uppercase tracking-[0.2em] text-[9px] md:text-xs font-bold font-sans rounded-none cursor-pointer"
              >
                <div className="flex flex-col gap-[2px] md:gap-[3px] w-3 md:w-4 shrink-0">
                  <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                  <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                  <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                </div>
                <span className="text-white text-center flex-1 px-2 whitespace-nowrap overflow-hidden text-ellipsis text-[9px] md:text-[11px] tracking-[0.16em]" ref={projectNameRef}>DOUAOUDA HOUSING</span>
                <div className="flex flex-col gap-[2px] md:gap-[3px] w-3 md:w-4 shrink-0">
                  <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                  <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                  <span className="w-full h-[1px] md:h-[1.5px] bg-current"></span>
                </div>
              </button>
            </div>

            <Link to="/contact" className="bg-[#1a1a1a]/80 backdrop-blur-md text-white shadow-2xl border border-white/10 h-11 md:h-12 w-11 md:w-12 flex items-center justify-center hover:bg-black hover:text-[#e82a2e] transition-colors rounded-none shrink-0 cursor-pointer">
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </>
        )}
      </div>

      <div className="w-full h-[100dvh] overflow-hidden sticky top-0">
      
        <div className="relative w-full h-full">
          {/* Background Image */}
          <div className="bg-image absolute inset-0 z-0 overflow-hidden">
            {isLightMode ? (
              <div className="absolute inset-0 z-10 bg-[#f8f9fa]">
                 <div className="absolute top-0 right-0 w-full md:w-[75%] h-full pointer-events-none opacity-90">
                    <div className="absolute top-0 bottom-0 left-0 w-[60vw] md:w-[45vw] bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa]/95 to-transparent z-10"></div>
                    <img src={firstProject.images[0]} className="w-full h-full object-cover object-right md:object-left mix-blend-multiply" alt={firstProject.title}/>
                 </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://infinityconstructions.com.au/wp-content/uploads/2023/11/infinity-home-banner-01.webp")' }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
              </div>
            )}
          </div>

          {/* Top Header */}
          <div className={`top-header absolute top-0 left-0 w-full flex flex-col items-center pointer-events-none transition-opacity duration-300 ${isLightMode ? 'z-30 pt-6 md:pt-10' : 'z-10 pt-8 opacity-0'}`}>
            {!isLightMode ? (
              <>
                <div className="w-full border-t border-b border-white/20 py-4 flex justify-between items-center px-6 md:px-24 max-w-7xl">
                  <span className="text-[9px] md:text-xs tracking-[0.2em] uppercase text-white/80">Housing</span>
                  <h1 className="font-serif text-3xl md:text-5xl tracking-[0.15em] text-white px-4 md:px-8 uppercase">Igloo</h1>
                  <span className="text-[9px] md:text-xs tracking-[0.2em] uppercase text-white/80">Programme</span>
                </div>
                
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-[#e82a2e] text-sm">â–</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase bg-white text-black px-4 py-1 font-bold">Douaouda Housing</span>
                  <span className="text-[#e82a2e] text-sm">â–</span>
                </div>
              </>
            ) : (
              <div className="w-full flex justify-between items-start px-8 md:px-16 pointer-events-auto">
                 <div className="w-24 md:w-32 flex flex-col items-start shrink-0 pt-2 -ml-2 mix-blend-multiply opacity-90">
                    <img src="https://i.ibb.co/84bV50SH/Chat-GPT-mage-5-May-2026-21-16-47-removebg-preview.png" alt="igloo" className="w-full object-contain" />
                 </div>
                 
                 <div className="flex flex-col items-center">
                    <h1 className="font-serif text-[1.75rem] md:text-[2.2rem] tracking-[0.2em] text-black uppercase mb-3 mr-[-0.2em] font-medium">Igloo</h1>
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 bg-[#e82a2e] rotate-45 border border-[#e82a2e]/20 outline outline-1 outline-offset-[1px] outline-black/5"></div>
                       <div className="bg-[#fcfcfc] border border-black/5 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] px-5 py-[5px]">
                        <span className="text-[7.5px] md:text-[8.5px] tracking-[0.2em] uppercase font-bold text-black" style={{ wordSpacing: "1px" }}>{firstProject.menuTitle}</span>
                       </div>
                       <div className="w-1.5 h-1.5 bg-[#e82a2e] rotate-45 border border-[#e82a2e]/20 outline outline-1 outline-offset-[1px] outline-black/5"></div>
                    </div>
                 </div>

                 <div className="w-24 md:w-32 flex justify-end shrink-0 pointer-events-auto">
                 </div>
              </div>
            )}
          </div>

          {/* Center Text Overlays */}
          <div className="title-content relative z-10 flex flex-col justify-center w-full h-full pointer-events-none transition-transform px-8 md:px-20">
            {!isLightMode ? (
              <div className="text-center relative mt-12 md:mt-0 mx-auto">
                <h2 className="title-serif font-serif text-[15vw] xl:text-[220px] leading-none text-white tracking-[0.05em] drop-shadow-2xl opacity-0 uppercase">
                  Igloo
                </h2>
                <h3 className="title-script font-script text-[22vw] xl:text-[280px] leading-none text-[#e82a2e] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap mt-8 opacity-0 z-20 drop-shadow-lg transform -rotate-2">
                  Our Projects
                </h3>
              </div>
            ) : (
              <div className="flex flex-col items-start justify-center h-full max-w-xl text-black mt-16 md:mt-24 md:pl-4">
                 <h2 className="font-serif text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.85] text-[#111] font-normal mb-0 tracking-tight ml-[-2px]">
                    OUR
                 </h2>
                 <h3 className="font-serif text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.85] text-[#111] font-normal mb-8 tracking-tight ml-[-2px]">
                    PROJECTS
                 </h3>

                 <p className="text-[#e82a2e] font-sans font-bold tracking-[0.1em] text-[9.5px] md:text-[10px] uppercase mb-5 md:mb-8">
                    Built to endure. Designed to inspire.
                 </p>

                 <p className="text-[#333] font-sans text-xs md:text-sm leading-relaxed md:leading-[1.7em] max-w-[20rem] md:max-w-[24rem] mb-16 md:mb-24 mix-blend-multiply font-medium">
                    Explore the current showcase system with Douaouda Housing now placed into the original opening chapter.
                 </p>

                 <div className="flex flex-col w-full max-w-[14rem] md:max-w-[18rem] mix-blend-multiply mt-auto md:mt-0">
                    <div className="flex items-end gap-1.5 mb-1">
                       <span className="text-black font-medium text-2xl md:text-3xl leading-none">01</span>
                       <span className="text-black/30 text-xs mb-[0.15rem] font-bold uppercase">/ 03</span>
                    </div>
                    <div className="w-full h-[1px] bg-black/10"></div>
                 </div>

                 <div className="scroll-cue mt-4 flex items-center gap-3 mix-blend-multiply">
                    <div className="scroll-cue-shell relative flex h-14 w-10 items-start justify-center rounded-full border border-black/15 bg-white/60 pt-2 shadow-[0_10px_25px_rgba(0,0,0,0.06)] backdrop-blur-sm">
                       <div className="scroll-wheel h-3.5 w-1 rounded-full bg-[#e82a2e]"></div>
                       <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center text-[#e82a2e]">
                          <ChevronDown className="scroll-arrow h-3.5 w-3.5" strokeWidth={2.2} />
                          <ChevronDown className="scroll-arrow -mt-1.5 h-3.5 w-3.5 opacity-60" strokeWidth={2.2} />
                       </div>
                    </div>
                    <div className="pt-1">
                       <span className="block text-black/45 text-[8px] md:text-[9px] uppercase tracking-[0.22em] font-bold">Scroll to explore</span>
                       <span className="block text-black/30 text-[9px] md:text-[10px] italic tracking-[0.04em] mt-1">Follow the project story downward</span>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Diagonal Scrolling Canvas -> Single Spread Canvas now */}
        <div className="content-canvas absolute top-0 left-[100vw] w-[100vw] h-[100dvh] text-black z-20 overflow-hidden bg-white">
          {/* Background Split Images requested by user */}
          <div className="absolute inset-0 pointer-events-none flex">
            <div className="w-1/2 h-full">
              <img src="https://i.ibb.co/cKq8kTsV/sol.png" alt="Left Pattern" className="w-full h-full object-cover object-right" />
            </div>
            <div className="w-1/2 h-full">
              <img src="https://i.ibb.co/4RgvQW9q/sa.png" alt="Right Pattern" className="w-full h-full object-cover object-left" />
            </div>
          </div>
          {/* White layer with 60% opacity */}
          <div className="absolute inset-0 pointer-events-none bg-white/60"></div>
          {/* Grain texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

          <div className="diagonal-container absolute top-0 left-0 w-[900vw] h-[500vh]">
            {/* Block 1 */}
            <div className="absolute top-0 left-0 w-[100vw] h-[100dvh] overflow-hidden">
              {/* Left Main Image - Diagonally Cut */}
              <div 
                className="absolute top-0 left-0 w-[55vw] h-[60vh] p-anim-img opacity-0"
              >
                {/* Image Decorators */}
                <div className="absolute top-8 -right-8 w-16 h-16 border-t border-r border-[#e82a2e] z-0"></div>
                <div className="absolute -bottom-8 left-12 w-[1px] h-16 bg-[#e82a2e] z-0"></div>
                
                <div className="w-full h-full overflow-hidden shadow-[10px_10px_30px_rgba(0,0,0,0.15)] relative z-10" style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)' }}>
                    <img src={firstProject.images[0]} className="w-full h-full object-cover" alt={firstProject.title} />
                </div>
                {/* Decorative Red rectangle */}
                <div className="absolute -bottom-4 right-12 w-24 h-1 bg-[#e82a2e] p-anim-redline z-20"></div>
              </div>

              {/* Right Title Section */}
              <div className="absolute top-[18vh] left-[62vw] flex flex-col items-start w-[32vw]">
                 <div className="flex items-end gap-1 mb-2 p-anim-title opacity-0">
                    <span className="text-[#888] font-light text-2xl leading-none">01</span>
                    <span className="text-[#bbb] text-[10px] mb-[2px] font-bold uppercase">/ 03</span>
                 </div>
                 <div className="w-48 h-[1px] bg-black/10 mb-2 p-anim-title opacity-0"></div>
                 <span className="text-[#aaa] text-[9px] uppercase tracking-[0.15em] font-bold mb-14 p-anim-title opacity-0">Scroll to explore</span>

                 <div className="flex items-center gap-4 mb-4 p-anim-title opacity-0">
                    <span className="text-[#e82a2e] text-[10px] font-bold tracking-[0.2em] uppercase">Project Overview</span>
                    <div className="w-8 h-[1px] bg-[#e82a2e]"></div>
                 </div>

                 <h2 className="font-sans text-5xl lg:text-[4rem] font-black text-[#111] uppercase leading-[0.95] tracking-tight mb-8 p-anim-title opacity-0">
                    Douaouda<br/>Housing
                 </h2>

                 <p className="text-[#555] text-xs lg:text-[13px] leading-relaxed max-w-[24vw] font-medium p-anim-title opacity-0">
                    {firstProject.summary}
                 </p>
              </div>

              {/* Stats Grid */}
              <div className="absolute top-[65vh] left-[6vw] flex items-center">
                 {/* Decorative Red Line/Dot */}
                 <div className="relative h-20 w-[1px] bg-[#e82a2e]/30 mr-[4vw] flex flex-col items-center p-anim-stat opacity-0">
                    <div className="absolute -top-1 w-2 h-2 rounded-full bg-[#e82a2e]"></div>
                    <ChevronDown className="absolute -bottom-2 text-[#e82a2e] w-3 h-3" strokeWidth={3} />
                 </div>

                 <div className="flex gap-8 lg:gap-14">
                    <div className="flex flex-col gap-1.5 p-anim-stat opacity-0">
                       <MapPin className="text-[#e82a2e] w-5 h-5 mb-1" strokeWidth={1.5} />
                       <span className="text-[#e82a2e] text-[9px] uppercase font-bold tracking-widest">Location</span>
                       <span className="text-[#222] text-[11px] font-semibold">Douaouda, Algeria</span>
                    </div>
                    <div className="w-[1px] h-12 bg-black/10 self-center p-anim-stat opacity-0"></div>
                    <div className="flex flex-col gap-1.5 p-anim-stat opacity-0">
                       <Building2 className="text-[#e82a2e] w-5 h-5 mb-1" strokeWidth={1.5} />
                       <span className="text-[#e82a2e] text-[9px] uppercase font-bold tracking-widest">Type</span>
                       <span className="text-[#222] text-[11px] font-semibold">300/500 Assisted<br/>Housing</span>
                    </div>
                    <div className="w-[1px] h-12 bg-black/10 self-center p-anim-stat opacity-0"></div>
                    <div className="flex flex-col gap-1.5 p-anim-stat opacity-0">
                       <Calendar className="text-[#e82a2e] w-5 h-5 mb-1" strokeWidth={1.5} />
                       <span className="text-[#e82a2e] text-[9px] uppercase font-bold tracking-widest">Completion</span>
                       <span className="text-[#222] text-[11px] font-semibold">Completed</span>
                    </div>
                    <div className="w-[1px] h-12 bg-black/10 self-center p-anim-stat opacity-0"></div>
                    <div className="flex flex-col gap-1.5 w-44 p-anim-stat opacity-0">
                       <HardHat className="text-[#e82a2e] w-5 h-5 mb-1" strokeWidth={1.5} />
                       <span className="text-[#e82a2e] text-[9px] uppercase font-bold tracking-widest">Scope</span>
                       <span className="text-[#222] text-[11px] font-semibold">Secondary state body works,<br/>housing delivery, site coordination</span>
                    </div>
                 </div>
              </div>

              {/* Bottom Quote & Sub-images */}
              <div className="absolute bottom-[4vh] left-[6vw] flex gap-4 w-[25vw] p-anim-quote opacity-0">
                <div className="text-[#e82a2e] font-sans font-black text-[3.5rem] leading-[0.8] mt-1 pt-1">“</div>
                 <div className="flex flex-col gap-4">
                    <p className="text-[#444] font-serif text-[13px] leading-relaxed italic">
                      "We build more than structures—<br/>we shape environments that inspire<br/>and endure."
                    </p>
                    <span className="text-[#e82a2e] text-[8px] font-bold uppercase tracking-[0.15em]">Igloo Construction</span>
                 </div>
              </div>

              {/* Bottom Right Image */}
              <div 
                className="absolute right-0 bottom-0 w-[18vw] h-[28vh] p-anim-img opacity-0 relative"
              >
                  <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-[#e82a2e] z-0"></div>
                  <div className="w-full h-full overflow-hidden relative z-10" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' }}>
                     <img src={firstProject.images[1]} className="w-full h-full object-cover" alt="Douaouda housing detail" />
                  </div>
              </div>
            </div>

            {/* Block 2: Diagonal entry 1 */}
            <div className="project-photos-header absolute top-[80vh] left-[80vw] w-[100vw] flex items-center gap-8 pl-12 pt-12 z-50">
                 <div className="text-8xl font-serif text-[#111] opacity-10 leading-none tracking-tighter">02</div>
                 <div className="w-1/3 h-[1px] bg-[#e82a2e]"></div>
                 <span className="shrink-0 text-[#e82a2e] uppercase tracking-[0.3em] font-bold text-[10px] mt-2">PROJECT PHOTOS</span>
            </div>

            {/* Project Photos Horizontal Scroll */}
            <div className="absolute top-[100vh] left-[120vw] w-[45vw] h-[60vh] shadow-xl z-20">
                 <img src={firstProject.images[2]} className="w-full h-full object-cover" alt="Douaouda project view 1" />
            </div>
            
            <div className="absolute top-[100vh] left-[180vw] w-[45vw] h-[60vh] shadow-xl z-10 transition-transform hover:scale-105 gap-5">
                 <img src={firstProject.images[0]} className="w-full h-full object-cover" alt="Douaouda project view 2" />
            </div>

            <div className="absolute top-[100vh] left-[240vw] w-[45vw] h-[60vh] shadow-xl z-30 transition-transform hover:scale-105">
                 <img src={firstProject.images[1]} className="w-full h-full object-cover" alt="Douaouda project view 3" />
            </div>

            <div className="absolute top-[100vh] left-[300vw] w-[20vw] h-[50vh] shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t border-r border-[#e82a2e] z-0"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b border-l border-[#e82a2e] z-0"></div>
                <div className="w-full h-full overflow-hidden relative z-10" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' }}>
                  <img src={firstProject.images[2]} className="w-full h-full object-cover grayscale mix-blend-multiply opacity-50" alt="Douaouda transition fragment" />
                </div>
            </div>

            <div className="absolute top-[125vh] left-[325vw] flex flex-col justify-center max-w-[20vw]">
               <div className="w-8 h-8 rounded-full border border-[#e82a2e] flex items-center justify-center mb-6">
                  <div className="w-1.5 h-1.5 bg-[#e82a2e] rounded-full"></div>
               </div>
               <p className="text-[#555] font-serif italic text-lg leading-relaxed">
                  "From coordinated site works to enduring residential delivery in Douaouda."
               </p>
            </div>

            {/* Block 3: Diagonal entry 2 */}
            <div className="absolute top-[180vh] left-[365vw] w-[30vw] flex flex-col z-10">
               {/* UI decorators based on image */}
               <div className="absolute -top-6 -left-6 w-8 h-8 border-t border-l border-[#e82a2e]"></div>
               <div className="absolute -bottom-16 -left-6 w-[1px] h-32 bg-[#e82a2e]"></div>
               <div className="absolute -bottom-16 -left-[26px] text-[#e82a2e] text-[8px]">â†“</div>
               
               <h3 className="font-sans font-black text-6xl uppercase tracking-tighter text-[#111] mb-6 leading-[0.9]">SHAPING<br/>ENVIRONMENTS</h3>
               <p className="text-[#555] text-lg leading-relaxed font-serif max-w-sm mb-16">
                  Our projects are not mere interventions, they are a dialogue between history and future, form and function.
               </p>

               <div className="flex items-start gap-3">
                  <div className="text-[#e82a2e] font-light text-xl mt-[-6px]">+</div>
                  <div className="flex flex-col">
                     <span className="font-mono text-[10px] text-[#555] tracking-widest uppercase">BUILT FOR CONTEXT.</span>
                     <span className="font-mono text-[10px] text-[#555] tracking-widest uppercase border-b border-[#ccc] pb-1">DESIGNED FOR LIFE.</span>
                  </div>
               </div>
            </div>

            <div className="absolute top-[165vh] left-[400vw] w-[35vw] h-[50vh]">
                {/* Image Decorators */}
                <div className="absolute -top-6 right-0 w-[1px] h-16 bg-[#e82a2e] z-0"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b border-l border-[#e82a2e] z-0"></div>
                
                <div className="w-full h-full overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-10 relative" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)' }}>
                    <img src={firstProject.images[0]} className="w-full h-full object-cover" alt="Douaouda housing detail" />
                </div>
            </div>

            {/* Block 3.5: Diagonal entry 3 */}
            <div className="absolute top-[230vh] left-[435vw] w-[45vw] h-[65vh]">
                <div className="absolute -bottom-8 -right-8 w-16 h-16 border-b border-r border-[#e82a2e] z-0"></div>
                <div className="absolute -top-8 left-8 w-[1px] h-16 bg-[#e82a2e] z-0"></div>
                
                <div className="w-full h-full overflow-hidden shadow-2xl relative z-10" style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)' }}>
                    <img src={firstProject.images[1]} className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply" alt="Douaouda facade" />
                </div>
            </div>

            <div className="absolute top-[260vh] left-[490vw] w-[25vw] flex flex-col pt-4 z-10 bg-[#f8f9fa] p-8 !bg-opacity-80 backdrop-blur-sm">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-[1px] bg-[#e82a2e]"></div>
                  <span className="text-[#e82a2e] text-[11px] font-bold tracking-[0.2em] uppercase">Materiality</span>
               </div>
               <p className="text-[#333] text-2xl font-serif italic mb-6 leading-relaxed">
                  "The Douaouda programme combines coordinated building works, housing delivery, and controlled site execution."
               </p>
               <span className="font-mono text-xs text-[#999] uppercase tracking-widest">Igloo Archives</span>
            </div>

            {/* Block 4: Le Lieu Des Commencements (End of diagonal) */}
            <div className="absolute top-[300vh] left-[500vw] w-[100vw] h-[100vh] flex flex-col md:flex-row gap-12 items-center justify-center px-12">
              <div className="w-full md:w-[25vw] shrink-0">
                <div className="border-b-[1.5px] border-[#e82a2e] mb-6 text-left pb-4">
                  <h3 className="font-sans font-bold text-2xl md:text-3xl uppercase tracking-wider text-[#111]">Le Lieu Des<br/>Commencements</h3>
                </div>
                <p className="text-[#555] text-sm md:text-base leading-relaxed font-serif text-justify font-medium">The Douaouda housing programme brings together assisted promotional housing, coordinated site services, and disciplined execution across the full residential plot.</p>
              </div>
              <div className="w-full md:w-[30vw] h-[40vh] md:h-[60vh] overflow-hidden relative shrink-0 shadow-2xl">
                <img src={firstProject.images[2]} className="w-full h-full object-cover" alt="Douaouda housing site" />
              </div>
            </div>

            {/* Horizontal Panel 1 */}
            <div className="absolute top-[300vh] left-[600vw] w-[100vw] h-[100vh] flex flex-col md:flex-row items-center justify-center p-0 md:p-12 gap-12">
               <div className="w-full md:w-[60vw] h-[50vh] md:h-[80vh] shrink-0 overflow-hidden shadow-xl clip-path-slant relative">
                  <img src={firstProject.images[0]} className="w-full h-full object-cover" alt="Douaouda housing blocks" />
                  <div className="absolute inset-0 bg-black/10"></div>
               </div>
               <div className="w-full md:w-[30vw] flex flex-col justify-center text-left">
                  <div className="flex items-center gap-4 mb-4">
                     <span className="text-[#e82a2e] text-[10px] font-bold tracking-[0.2em] uppercase">Core Concept</span>
                     <div className="w-8 h-[1px] bg-[#e82a2e]"></div>
                  </div>
                  <h3 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tight text-[#111] mb-6 leading-none">Housing<br/>At Scale</h3>
                  <p className="text-[#555] text-sm md:text-lg leading-relaxed font-serif text-justify">
                    Secondary state body works, structural coordination, and residential delivery are combined here into one continuous programme built for long-term occupancy.
                  </p>
               </div>
            </div>

            {/* Horizontal Panel 2 */}
            <div className="absolute top-[300vh] left-[700vw] w-[100vw] h-[100vh] flex justify-center items-center p-12">
               <div className="w-full h-[80vh] relative overflow-hidden shadow-2xl">
                  <img src={firstProject.images[2]} className="w-full h-full object-cover panel-1-final-img origin-center" alt={firstProject.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>
                  <div className="absolute left-8 right-8 bottom-8 md:left-12 md:right-auto md:bottom-12 md:max-w-[32rem] bg-white/88 backdrop-blur-md border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.18)] px-6 py-5 md:px-8 md:py-7">
                     <div className="flex items-center gap-3 mb-3">
                        <span className="w-10 h-px bg-[#e82a2e]"></span>
                        <span className="text-[#e82a2e] font-bold uppercase tracking-[0.28em] text-[10px] md:text-xs">{firstProject.chapterLabel} Project</span>
                     </div>
                     <h3 className="font-serif text-[#111] text-3xl md:text-5xl leading-[0.9] uppercase tracking-tight">
                       {firstProject.coverLines[0]}<br />{firstProject.coverLines[1]}
                     </h3>
                     <p className="mt-4 text-[#444] text-xs md:text-sm leading-relaxed font-medium max-w-[28rem]">
                       {firstProject.scope}
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Project 2 Cover */}
        <div className="project-2-cover absolute top-0 left-[100vw] w-full h-full z-10 bg-white">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-multiply"
            style={{ backgroundImage: `url("${secondProject.images[0]}")` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent z-0"></div>
          
          <div className="project-2-cover-title relative z-10 w-full h-full flex flex-col justify-center px-4 md:px-20 text-right md:text-left md:items-end">
            <h4 className="text-[#e82a2e] font-sans font-bold tracking-[0.3em] text-xs md:text-sm uppercase mb-4 md:mb-8 mr-1 md:mr-12">02 - Completed Project</h4>
            <div className="overflow-hidden">
              <h2 className="font-serif text-[4rem] text-4xl md:text-[8rem] lg:text-[10rem] font-normal text-[#111] uppercase leading-[0.85] tracking-tighter mr-2 md:mr-8">
                Sidi Abdallah
              </h2>
            </div>
            <div className="overflow-hidden">
              <h3 className="font-serif text-[3rem] md:text-[6rem] lg:text-[8rem] font-normal text-[#333] uppercase leading-[0.85] tracking-tight mr-4 md:mr-0">
                Public Housing
              </h3>
            </div>
          </div>
        </div>

        {/* Project 2 Canvas */}
        <div className="project-2-canvas absolute top-0 left-[-100vw] w-[100vw] h-[100dvh] bg-white text-black z-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex">
            <div className="w-1/2 h-full">
              <img src="https://i.ibb.co/cKq8kTsV/sol.png" alt="Left Pattern" className="w-full h-full object-cover object-right" />
            </div>
            <div className="w-1/2 h-full">
              <img src="https://i.ibb.co/4RgvQW9q/sa.png" alt="Right Pattern" className="w-full h-full object-cover object-left" />
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

          <div className="project-2-diagonal absolute top-0 right-0 w-[500vw] h-[400vh] flex">
             {/* Block 1 */}
             <div className="absolute top-[10vh] right-[10vw] w-[80vw] md:w-[60vw] flex flex-col md:flex-row-reverse gap-12 items-start text-right">
                <div className="w-full md:w-[35vw] h-[50vh] md:h-[70vh] relative shrink-0">
                    <div className="absolute -top-6 -right-6 w-12 h-12 border-t border-r border-[#e82a2e] z-0"></div>
                    <div className="absolute -bottom-6 right-8 w-[1px] h-16 bg-[#e82a2e] z-0"></div>
                    
                    <div className="w-full h-full overflow-hidden relative z-10 shadow-xl" style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)' }}>
                       <img src={secondProject.images[0]} className="w-full h-full object-cover" alt={secondProject.title} />
                    </div>
                </div>
                <div className="w-full md:w-[25vw] shrink-0 pt-8">
                   <div className="border-b-[1.5px] border-t-[1.5px] border-[#e82a2e]/30 py-2 mb-6">
                      <h3 className="font-sans font-bold text-xl md:text-2xl uppercase tracking-widest text-[#e82a2e]">Delivery Story</h3>
                   </div>
                   <h2 className="font-serif text-3xl md:text-5xl text-[#111] mb-6 leading-tight uppercase font-black">Structured<br/>Delivery</h2>
                   <p className="text-[#333] font-medium text-sm md:text-base leading-relaxed font-serif text-justify" style={{textAlignLast: "right"}}>A major public housing programme in Sidi Abdallah shaped as a disciplined delivery package, with coordinated state body works and a strong residential footprint.</p>
                </div>
             </div>

             {/* Block 2 */}
             <div className="absolute top-[70vh] right-[70vw] w-[80vw] md:w-[60vw] flex flex-col-reverse md:flex-row-reverse gap-12 items-start text-right">
                 <div className="w-full md:w-[25vw] shrink-0 pt-8">
                   <div className="border-b-[1.5px] border-[#e82a2e]/30 pb-4 mb-6">
                      <h3 className="font-sans font-bold text-2xl md:text-3xl uppercase tracking-wider text-[#111]">Programme<br/>Coordination</h3>
                   </div>
                   <p className="text-[#333] font-medium text-sm md:text-base leading-relaxed font-serif text-justify" style={{textAlignLast: "right"}}>Secondary works, structural sequencing, and site-wide coordination come together here to support a substantial public housing operation at full scale.</p>
                 </div>
                 <div className="w-full md:w-[30vw] h-[40vh] md:h-[60vh] relative shrink-0">
                    <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b border-l border-[#e82a2e] z-0"></div>
                    <div className="absolute -top-6 left-8 w-[1px] h-16 bg-[#e82a2e] z-0"></div>
                    
                    <div className="w-full h-full overflow-hidden relative z-10 shadow-xl" style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)' }}>
                       <img src={secondProject.images[1]} className="w-full h-full object-cover" alt="Sidi Abdallah structure" />
                    </div>
                 </div>
             </div>

             {/* Horizontal Panel 1 */}
             <div className="absolute top-[120vh] right-[120vw] w-[100vw] h-[100vh] flex flex-col md:flex-row-reverse items-center gap-0">
                 <div className="w-full md:w-[60vw] h-[50vh] md:h-[100vh] shrink-0 border-l border-white/20 overflow-hidden shadow-2xl z-10">
                    <img src={secondProject.images[2]} className="w-full h-full object-cover" alt="Sidi Abdallah facade" />
                 </div>
                 <div className="w-full md:w-[40vw] h-[50vh] md:h-[100vh] flex flex-col justify-center text-right px-8 md:px-16 bg-[#f8f9fa] shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20">
                    <div className="border-b-[1.5px] border-t-[1.5px] border-[#e82a2e]/20 py-4 mb-4 md:mb-8">
                       <h3 className="font-sans font-black text-2xl md:text-5xl uppercase tracking-widest text-[#111]">Housing &<br/>Support Works</h3>
                    </div>
                    <p className="text-[#555] font-medium text-sm md:text-xl leading-relaxed font-serif text-justify" style={{textAlignLast: "right"}}>
                      The Sidi Abdallah programme balances housing density, supporting works, and delivery control in a way that reads clearly inside the existing showcase rhythm.
                    </p>
                 </div>
             </div>

             {/* Horizontal Panel 2 */}
             <div className="absolute top-[120vh] right-[220vw] w-[100vw] h-[100vh] flex justify-center items-center">
                 <div className="w-full h-[80vh] relative overflow-hidden shadow-2xl">
                    <img src={secondProject.images[2]} className="w-full h-full object-cover panel-2-final-img origin-center" alt={secondProject.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-white/10"></div>
                    <div className="absolute left-8 right-8 bottom-8 md:right-12 md:left-auto md:bottom-12 md:max-w-[30rem] bg-[#f8f6f2]/88 backdrop-blur-md border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.16)] px-6 py-5 md:px-8 md:py-7 text-right">
                       <div className="flex items-center justify-end gap-3 mb-3">
                          <span className="text-[#e82a2e] font-bold uppercase tracking-[0.28em] text-[10px] md:text-xs">{secondProject.chapterLabel} Project</span>
                          <span className="w-10 h-px bg-[#e82a2e]"></span>
                       </div>
                       <h3 className="font-serif text-[#111] text-3xl md:text-5xl leading-[0.9] uppercase tracking-tight">
                         {secondProject.coverLines[0]}<br />{secondProject.coverLines[1]}
                       </h3>
                       <p className="mt-4 text-[#444] text-xs md:text-sm leading-relaxed font-medium">
                         {secondProject.scope}
                       </p>
                    </div>
                 </div>
             </div>
          </div>
        </div>

        {/* Project 3 Cover */}
        <div className="project-3-cover absolute top-0 left-[-100vw] w-full h-full z-[15] bg-white">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-multiply"
            style={{ backgroundImage: `url("${thirdProject.images[0]}")` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-l from-white/90 via-white/50 to-transparent z-0"></div>
          
          <div className="project-3-cover-title relative z-10 w-full h-full flex flex-col justify-center px-4 md:px-20 text-left md:items-start">
            <h4 className="text-[#e82a2e] font-sans font-bold tracking-[0.3em] text-xs md:text-sm uppercase mb-4 md:mb-8 ml-1 md:ml-12">03 - Completed Project</h4>
            <div className="overflow-hidden w-full text-left">
              <h2 className="font-serif text-[4rem] text-4xl md:text-[8rem] lg:text-[10rem] font-normal text-[#111] uppercase leading-[0.85] tracking-tighter ml-2 md:ml-8">
                Staoueli
              </h2>
            </div>
            <div className="overflow-hidden w-full text-left">
              <h3 className="font-serif text-[3rem] md:text-[6rem] lg:text-[8rem] font-normal text-[#333] uppercase leading-[0.85] tracking-tight ml-4 md:ml-0">
                11/41 Villas
              </h3>
            </div>
          </div>
        </div>

        {/* Project 3 Canvas */}
        <div className="project-3-canvas absolute top-0 left-[100vw] w-[100vw] h-[100dvh] bg-white text-black z-30 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex">
            <div className="w-1/2 h-full">
              <img src="https://i.ibb.co/cKq8kTsV/sol.png" alt="Left Pattern" className="w-full h-full object-cover object-right" />
            </div>
            <div className="w-1/2 h-full">
              <img src="https://i.ibb.co/4RgvQW9q/sa.png" alt="Right Pattern" className="w-full h-full object-cover object-left" />
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

          <div className="project-3-diagonal absolute top-0 left-0 w-[500vw] h-[400vh] flex">
            {/* Block 1 */}
            <div className="absolute top-[10vh] left-[10vw] w-[80vw] md:w-[60vw] flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-[35vw] h-[50vh] md:h-[70vh] relative shrink-0">
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b border-r border-[#e82a2e] z-0"></div>
                <div className="absolute -top-6 left-8 w-[1px] h-16 bg-[#e82a2e] z-0"></div>
                
                <div className="w-full h-full overflow-hidden relative z-10 shadow-xl" style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)' }}>
                  <img src={thirdProject.images[0]} className="w-full h-full object-cover" alt={thirdProject.title} />
                </div>
              </div>
              <div className="w-full md:w-[25vw] shrink-0 pt-8">
                <div className="border-b-[1.5px] border-t-[1.5px] border-[#e82a2e]/30 py-2 mb-6 text-left">
                  <h3 className="font-sans font-bold text-xl md:text-2xl uppercase tracking-widest text-[#e82a2e]">Villa Programme</h3>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl text-[#111] mb-6 leading-tight uppercase font-black text-left">Roads &<br/>Networks</h2>
                <p className="text-[#333] font-medium text-sm md:text-base leading-relaxed font-serif text-justify">The Staoueli package combines villa construction with roads and network works, creating a cleaner, more complete residential site story for the showcase.</p>
              </div>
            </div>

            {/* Block 2 */}
            <div className="absolute top-[70vh] left-[70vw] w-[80vw] md:w-[60vw] flex flex-col-reverse md:flex-row gap-12 items-start">
              <div className="w-full md:w-[25vw] shrink-0 pt-8">
                <div className="border-b-[1.5px] border-[#e82a2e]/30 pb-4 mb-6 text-left">
                  <h3 className="font-sans font-bold text-2xl md:text-3xl uppercase tracking-wider text-[#111]">Residential<br/>Readiness</h3>
                </div>
                <p className="text-[#333] font-medium text-sm md:text-base leading-relaxed font-serif text-justify">The supporting network works are treated here as part of the built outcome itself, helping the full 11/41 villa programme read as one coordinated environment.</p>
              </div>
              <div className="w-full md:w-[30vw] h-[40vh] md:h-[60vh] relative shrink-0">
                <div className="absolute -top-6 -left-6 w-12 h-12 border-t border-l border-[#e82a2e] z-0"></div>
                <div className="absolute -bottom-6 right-8 w-[1px] h-16 bg-[#e82a2e] z-0"></div>
                
                <div className="w-full h-full overflow-hidden relative z-10 shadow-xl" style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)' }}>
                  <img src={thirdProject.images[1]} className="w-full h-full object-cover" alt="Staoueli network works" />
                </div>
              </div>
            </div>

            {/* Horizontal Panel 1 */}
            <div className="absolute top-[120vh] left-[120vw] w-[100vw] h-[100vh] flex flex-col md:flex-row items-center gap-0">
               <div className="w-full md:w-[60vw] h-[50vh] md:h-[100vh] shrink-0 border-r border-[#8b181c] overflow-hidden shadow-2xl z-10">
                  <img src={thirdProject.images[2]} className="w-full h-full object-cover" alt="Staoueli villas" />
               </div>
               <div className="w-full md:w-[40vw] h-[50vh] md:h-[100vh] flex flex-col justify-center text-left px-8 md:px-16 bg-[#f8f9fa] shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20">
                  <div className="border-b-[1.5px] border-t-[1.5px] border-[#e82a2e]/20 py-4 mb-4 md:mb-8">
                    <h3 className="font-sans font-black text-2xl md:text-5xl uppercase tracking-widest text-[#111]">Villas &<br/>Infrastructure</h3>
                  </div>
                  <p className="text-[#555] font-medium text-sm md:text-xl leading-relaxed font-serif text-justify">
                    Staoueli is framed here as a composed residential delivery: villas, roads, and network systems aligned under one practical construction sequence.
                  </p>
               </div>
            </div>

            {/* Horizontal Panel 2 */}
            <div className="absolute top-[120vh] left-[220vw] w-[100vw] h-[100vh] flex justify-center items-center">
               <div className="w-full h-[80vh] relative overflow-hidden shadow-2xl">
                  <img src={thirdProject.images[2]} className="w-full h-full object-cover panel-3-final-img origin-center" alt={thirdProject.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                  <div className="absolute left-8 right-8 bottom-8 md:left-12 md:right-auto md:bottom-12 md:max-w-[31rem] bg-white/88 backdrop-blur-md border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.16)] px-6 py-5 md:px-8 md:py-7">
                     <div className="flex items-center gap-3 mb-3">
                        <span className="w-10 h-px bg-[#e82a2e]"></span>
                        <span className="text-[#e82a2e] font-bold uppercase tracking-[0.28em] text-[10px] md:text-xs">{thirdProject.chapterLabel} Project</span>
                     </div>
                     <h3 className="font-serif text-[#111] text-3xl md:text-5xl leading-[0.9] uppercase tracking-tight">
                       {thirdProject.coverLines[0]}<br />{thirdProject.coverLines[1]}
                     </h3>
                     <p className="mt-4 text-[#444] text-xs md:text-sm leading-relaxed font-medium max-w-[28rem]">
                       {thirdProject.scope}
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Project 4 Cover */}
        <div className="project-4-cover absolute top-0 left-[100vw] w-full h-full z-[35] bg-white">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-multiply"
            style={{ backgroundImage: `url("${fourthProject.images[0]}")` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent z-0"></div>

          <div className="project-4-cover-title relative z-10 w-full h-full flex flex-col justify-center px-4 md:px-20 text-right md:text-left md:items-end">
            <h4 className="text-[#e82a2e] font-sans font-bold tracking-[0.3em] text-xs md:text-sm uppercase mb-4 md:mb-8 mr-1 md:mr-12">04 - Completed Project</h4>
            <div className="overflow-hidden">
              <h2 className="font-serif text-[4rem] text-4xl md:text-[8rem] lg:text-[10rem] font-normal text-[#111] uppercase leading-[0.85] tracking-tighter mr-2 md:mr-8">
                Said Hamdine
              </h2>
            </div>
            <div className="overflow-hidden">
              <h3 className="font-serif text-[3rem] md:text-[6rem] lg:text-[8rem] font-normal text-[#333] uppercase leading-[0.85] tracking-tight mr-4 md:mr-0">
                Mixed Complex
              </h3>
            </div>
          </div>
        </div>

        {/* Project 4 Canvas */}
        <div className="project-4-canvas absolute top-0 left-[-100vw] w-[100vw] h-[100dvh] bg-white text-black z-40 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex">
            <div className="w-1/2 h-full">
              <img src="https://i.ibb.co/cKq8kTsV/sol.png" alt="Left Pattern" className="w-full h-full object-cover object-right" />
            </div>
            <div className="w-1/2 h-full">
              <img src="https://i.ibb.co/4RgvQW9q/sa.png" alt="Right Pattern" className="w-full h-full object-cover object-left" />
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

          <div className="project-4-diagonal absolute top-0 right-0 w-[500vw] h-[400vh] flex">
            <div className="absolute top-[10vh] right-[10vw] w-[80vw] md:w-[60vw] flex flex-col md:flex-row-reverse gap-12 items-start text-right">
              <div className="w-full md:w-[35vw] h-[50vh] md:h-[70vh] relative shrink-0">
                <div className="absolute -top-6 -right-6 w-12 h-12 border-t border-r border-[#e82a2e] z-0"></div>
                <div className="absolute -bottom-6 right-8 w-[1px] h-16 bg-[#e82a2e] z-0"></div>

                <div className="w-full h-full overflow-hidden relative z-10 shadow-xl" style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)' }}>
                  <img src={fourthProject.images[0]} className="w-full h-full object-cover" alt={fourthProject.title} />
                </div>
              </div>
              <div className="w-full md:w-[25vw] shrink-0 pt-8">
                <div className="border-b-[1.5px] border-t-[1.5px] border-[#e82a2e]/30 py-2 mb-6">
                  <h3 className="font-sans font-bold text-xl md:text-2xl uppercase tracking-widest text-[#e82a2e]">Mixed-Use Scale</h3>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl text-[#111] mb-6 leading-tight uppercase font-black">Residential<br/>With Retail</h2>
                <p className="text-[#333] font-medium text-sm md:text-base leading-relaxed font-serif text-justify" style={{ textAlignLast: "right" }}>
                  Said Hamdine brings housing, basement parking, and active street-level uses into one compact urban composition with a more premium finish language.
                </p>
              </div>
            </div>

            <div className="absolute top-[70vh] right-[70vw] w-[80vw] md:w-[60vw] flex flex-col-reverse md:flex-row-reverse gap-12 items-start text-right">
              <div className="w-full md:w-[25vw] shrink-0 pt-8">
                <div className="border-b-[1.5px] border-[#e82a2e]/30 pb-4 mb-6">
                  <h3 className="font-sans font-bold text-2xl md:text-3xl uppercase tracking-wider text-[#111]">Detail &<br/>Common Areas</h3>
                </div>
                <p className="text-[#333] font-medium text-sm md:text-base leading-relaxed font-serif text-justify" style={{ textAlignLast: "right" }}>
                  The chapter shifts from exterior massing to crafted details, rooftop elements, and interior arrival zones that make the complex feel complete rather than purely structural.
                </p>
              </div>
              <div className="w-full md:w-[30vw] h-[40vh] md:h-[60vh] relative shrink-0">
                <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b border-l border-[#e82a2e] z-0"></div>
                <div className="absolute -top-6 left-8 w-[1px] h-16 bg-[#e82a2e] z-0"></div>

                <div className="w-full h-full overflow-hidden relative z-10 shadow-xl" style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)' }}>
                  <img src={fourthProject.images[1]} className="w-full h-full object-cover" alt="Said Hamdine skylight detail" />
                </div>
              </div>
            </div>

            <div className="absolute top-[120vh] right-[120vw] w-[100vw] h-[100vh] flex flex-col md:flex-row-reverse items-center gap-0">
              <div className="w-full md:w-[60vw] h-[50vh] md:h-[100vh] shrink-0 border-l border-white/20 overflow-hidden shadow-2xl z-10">
                <img src={fourthProject.images[2]} className="w-full h-full object-cover" alt="Said Hamdine lobby finish" />
              </div>
              <div className="w-full md:w-[40vw] h-[50vh] md:h-[100vh] flex flex-col justify-center text-right px-8 md:px-16 bg-[#f8f9fa] shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20">
                <div className="border-b-[1.5px] border-t-[1.5px] border-[#e82a2e]/20 py-4 mb-4 md:mb-8">
                  <h3 className="font-sans font-black text-2xl md:text-5xl uppercase tracking-widest text-[#111]">Arrival &<br/>Interior Finish</h3>
                </div>
                <p className="text-[#555] font-medium text-sm md:text-xl leading-relaxed font-serif text-justify" style={{ textAlignLast: "right" }}>
                  Common areas, lobbies, and circulation points are treated as part of the architectural identity, giving this chapter a more polished and urban character.
                </p>
              </div>
            </div>

            <div className="absolute top-[120vh] right-[220vw] w-[100vw] h-[100vh] flex justify-center items-center">
              <div className="w-full h-[80vh] relative overflow-hidden shadow-2xl">
                <img src={fourthProject.images[3]} className="w-full h-full object-cover panel-4-final-img origin-center" alt={fourthProject.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"></div>
                <div className="absolute left-8 right-8 bottom-8 md:right-12 md:left-auto md:bottom-12 md:max-w-[30rem] bg-[#f8f6f2]/88 backdrop-blur-md border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.16)] px-6 py-5 md:px-8 md:py-7 text-right">
                  <div className="flex items-center justify-end gap-3 mb-3">
                    <span className="text-[#e82a2e] font-bold uppercase tracking-[0.28em] text-[10px] md:text-xs">{fourthProject.chapterLabel} Project</span>
                    <span className="w-10 h-px bg-[#e82a2e]"></span>
                  </div>
                  <h3 className="font-serif text-[#111] text-3xl md:text-5xl leading-[0.9] uppercase tracking-tight">
                    {fourthProject.coverLines[0]}<br />{fourthProject.coverLines[1]}
                  </h3>
                  <p className="mt-4 text-[#444] text-xs md:text-sm leading-relaxed font-medium">
                    {fourthProject.scope}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Full Screen Menu Overlay */}
      <div className="full-menu fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col items-center justify-start pt-16 pb-12 px-6">
        
        {/* Decorative background logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
           <span className="font-serif text-[40vw] text-white whitespace-nowrap">IGLOO</span>
        </div>

        {/* Logo / Header inside menu */}
        <div className="menu-item relative z-10 flex flex-col items-center mb-10 md:mb-12 shrink-0">
          <img 
            src="https://i.ibb.co/fY50LKcW/Chat-GPT-mage-5-May-2026-21-15-03-removebg-preview.png" 
            alt="Igloo" 
            className="h-10 md:h-12 object-contain mb-4 filter brightness-0 invert"
          />
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.2em] text-white uppercase text-center">
            Igloo
          </h2>
          <p className="font-script text-xl md:text-2xl text-[#e82a2e] mt-2 md:mt-3 italic">
            Project Showcase
          </p>
          <div className="w-12 h-px bg-[#e82a2e] mt-6"></div>
        </div>

        {/* Menu Links */}
        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 w-full max-w-2xl shrink-0 overflow-visible">
          
          <div className="menu-item flex flex-col items-center group cursor-pointer" onClick={() => scrollToProject(0)}>
            <div className="flex items-center gap-4 mb-2 md:mb-3 text-[#e82a2e]">
              <span className="text-sm opacity-100 group-hover:opacity-100 transition-opacity">â–</span>
              <span className="text-white text-[10px] md:text-[12px] tracking-[0.3em] font-bold uppercase transition-colors group-hover:text-[#e82a2e]">Douaouda Housing</span>
              <span className="text-sm opacity-100 group-hover:opacity-100 transition-opacity">â–</span>
            </div>
            <span className="text-white text-lg md:text-2xl font-serif tracking-widest uppercase transition-colors relative">
              <span className="border-b border-white/50 group-hover:border-[#e82a2e] pb-1">Housing</span>
            </span>
          </div>

          <div className="menu-item flex flex-col items-center group cursor-pointer" onClick={() => scrollToProject(1)}>
             <div className="flex items-center gap-4 mb-2 md:mb-3 text-[#e82a2e]">
               <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">â–</span>
               <span className="text-white/50 text-[10px] md:text-[12px] tracking-[0.3em] font-bold uppercase transition-colors group-hover:text-[#e82a2e]">Sidi Abdallah</span>
               <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">â–</span>
             </div>
             <span className="text-white/70 text-lg md:text-2xl font-serif tracking-widest uppercase group-hover:text-white transition-colors relative">
               <span className="border-b border-transparent group-hover:border-[#e82a2e] pb-1">Public Housing</span>
             </span>
          </div>

          <div className="menu-item flex flex-col items-center group cursor-pointer" onClick={() => scrollToProject(2)}>
             <div className="flex items-center gap-4 mb-2 md:mb-3 text-[#e82a2e]">
               <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">â–</span>
               <span className="text-white/50 text-[10px] md:text-[12px] tracking-[0.3em] font-bold uppercase transition-colors group-hover:text-[#e82a2e]">Staoueli Villas</span>
               <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">â–</span>
             </div>
             <span className="text-white/70 text-lg md:text-2xl font-serif tracking-widest uppercase group-hover:text-white transition-colors relative">
               <span className="border-b border-transparent group-hover:border-[#e82a2e] pb-1">Villa Works</span>
             </span>
          </div>

          <div className="menu-item flex flex-col items-center group cursor-pointer" onClick={() => scrollToProject(3)}>
             <div className="flex items-center gap-4 mb-2 md:mb-3 text-[#e82a2e]">
               <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">â–</span>
               <span className="text-white/50 text-[10px] md:text-[12px] tracking-[0.3em] font-bold uppercase transition-colors group-hover:text-[#e82a2e]">Said Hamdine</span>
               <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">â–</span>
             </div>
             <span className="text-white/70 text-lg md:text-2xl font-serif tracking-widest uppercase group-hover:text-white transition-colors relative">
               <span className="border-b border-transparent group-hover:border-[#e82a2e] pb-1">Mixed Complex</span>
             </span>
          </div>

        </div>

        {/* Close Button at bottom */}
        <div className="menu-item relative z-10 w-full max-w-[320px] mt-auto border-t border-b border-white/10 flex justify-between items-center py-3">
          <button onClick={() => setMenuOpen(false)} className="text-white/50 hover:text-white transition-colors p-2 font-sans font-light text-xl mt-[-4px]">
            âœ•
          </button>
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white font-bold" ref={menuProjectNameRef}>DOUAOUDA HOUSING</span>
          <button onClick={() => setMenuOpen(false)} className="text-white/50 hover:text-white transition-colors p-2 font-sans font-light text-xl mt-[-4px]">
            âœ•
          </button>
        </div>

      </div>

    </main>
  );
}
