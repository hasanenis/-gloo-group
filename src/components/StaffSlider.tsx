import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, FreeMode, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { motionDuration, motionEase, usePrefersReducedMotion } from '../lib/motion';
import 'swiper/css';
import 'swiper/css/free-mode';

gsap.registerPlugin(ScrollTrigger);

const STAFF = [
  {
    name: "Adem Talay",
    role: "CEO",
    image: "https://i.ibb.co/tWQ0L2T/Chat-GPT-mage-5-May-2026-21-58-50-inspyrenet.webp",
    bgColor: "#f4c6c7", // light red
    boxHeight: "220px",
    marginTop: "0px",
    imgClasses: "w-[120%] max-w-[120%] max-h-[380px]"
  },
  {
    name: "William Kissen",
    role: "Project Management",
    image: "https://derckx.nl/wp-content/uploads/2024/09/43992_Derckx_Personeel_368x512px_0042_William-Kissen.webp",
    bgColor: "#c22026", 
    boxHeight: "260px",
    marginTop: "60px"
  },
  {
    name: "Thijs Janssen",
    role: "ass. Projectleider",
    image: "https://derckx.nl/wp-content/uploads/2024/09/43992_Derckx_Personeel_368x512px_0004_Jakub.webp",
    bgColor: "#fce8e8", 
    boxHeight: "240px",
    marginTop: "0px"
  },
  {
    name: "Peter Hermans",
    role: "Montage",
    image: "https://derckx.nl/wp-content/uploads/2024/09/43992_Derckx_Personeel_368x512px_0025_Peter-Hermans.webp",
    bgColor: "#eaa4a6", 
    boxHeight: "250px",
    marginTop: "60px"
  },
  {
    name: "Marielle Moonen",
    role: "Administratie",
    image: "https://derckx.nl/wp-content/uploads/2024/09/43992_Derckx_Personeel_368x512px_0017_Marielle-Moonen.webp",
    bgColor: "#d36164",
    boxHeight: "210px",
    marginTop: "0px"
  },
  {
    name: "Laura De Bruyn",
    role: "Marketing",
    image: "https://derckx.nl/wp-content/uploads/2024/12/Piet-Hoolwerff-276x384.webp",
    bgColor: "#df8385",
    boxHeight: "260px",
    marginTop: "60px"
  }
];

export default function StaffSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [cursorDirection, setCursorDirection] = useState<'left' | 'right'>('right');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollable = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    setCanScrollLeft(!swiper.isBeginning);
    setCanScrollRight(!swiper.isEnd);
  };

  useEffect(() => {
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  const handleClick = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (cursorDirection === 'left') {
      swiper.slidePrev(prefersReducedMotion ? 0 : motionDuration.hover * 1000);
    } else {
      swiper.slideNext(prefersReducedMotion ? 0 : motionDuration.hover * 1000);
    }
    window.setTimeout(checkScrollable, prefersReducedMotion ? 0 : motionDuration.hover * 1000);
  };

  const handleMouseMoveContainer = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const isLeft = (e.clientX - rect.left) < (rect.width / 2);
    setCursorDirection(isLeft ? 'left' : 'right');
  };

  // Entrance animations
  useGSAP(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion) {
      gsap.set(['.staff-title', '.staff-img', '.staff-bg', '.staff-details'], { clearProps: 'all', opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    gsap.fromTo('.staff-title',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: motionDuration.hero,
        ease: motionEase.expo,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true
        }
      }
    );

    // Make sure ScrollTrigger freshes after initial layout
    ScrollTrigger.refresh();

    const cards = gsap.utils.toArray<HTMLElement>('.staff-card');
    cards.forEach((card, index) => {
      const q = gsap.utils.selector(card);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 76%',
          once: true,
        }
      });

      tl.fromTo(q('.staff-img'), 
        { opacity: 0, y: 40, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: motionDuration.section, ease: motionEase.expo, delay: index * 0.055 }
      )
      .fromTo(q('.staff-bg'), 
        { scaleY: 0, opacity: 0, transformOrigin: 'top' }, 
        { scaleY: 1, opacity: 1, duration: motionDuration.hover, ease: motionEase.expo },
        '-=0.5'
      )
      .fromTo(q('.staff-details'), 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: motionDuration.hover, ease: motionEase.expo }, 
        '-=0.4'
      );
    });

  }, { scope: sectionRef, dependencies: [prefersReducedMotion] });

  return (
    <section ref={sectionRef} className="py-24 bg-white relative w-full overflow-hidden font-sans border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 mb-16">
        <h2 className="staff-title text-[36px] md:text-[42px] text-[#c22026] font-light uppercase tracking-wide leading-none opacity-0">
          OUR TEAM
        </h2>
      </div>

      {/* Slider Container */}
      <div className="w-full max-w-[1200px] mx-auto">
        <div
          ref={sliderRef}
          className="w-full select-none"
          data-cursor-card
          data-cursor-variant="slider"
          data-cursor-label={cursorDirection === 'left' && canScrollLeft ? 'PREV' : cursorDirection === 'right' && canScrollRight ? 'NEXT' : 'SCROLL'}
          data-lenis-prevent
          onMouseMove={handleMouseMoveContainer}
          onClick={handleClick}
        >
          <Swiper
            modules={[A11y, FreeMode, Keyboard]}
            slidesPerView="auto"
            spaceBetween={32}
            freeMode={{ enabled: true, momentumRatio: 0.75 }}
            keyboard={{ enabled: true }}
            watchOverflow
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              checkScrollable();
              window.setTimeout(checkScrollable, 120);
            }}
            onSlideChange={checkScrollable}
            onProgress={checkScrollable}
            onReachBeginning={checkScrollable}
            onReachEnd={checkScrollable}
            onFromEdge={checkScrollable}
            onTouchEnd={checkScrollable}
            onTransitionEnd={checkScrollable}
            className="relative w-full px-4 md:px-8 pb-12"
          >
          {STAFF.map((member, index) => (
            <SwiperSlide key={index} className="!w-[240px] md:!w-[260px]">
              <div className="staff-card flex w-full flex-col items-center" style={{ marginTop: member.marginTop }}>
            
            {/* Image / Background Box */}
            <div className="relative w-full h-[360px] mb-5 flex items-end justify-center pointer-events-none">
              {/* Colored Background Box */}
              <div 
                className="staff-bg absolute bottom-0 left-0 w-full opacity-0" 
                style={{ backgroundColor: member.bgColor, height: member.boxHeight }}
              />
              {/* Photo */}
              <img 
                src={member.image} 
                alt={member.name}
                className={`staff-img relative z-10 h-auto object-contain object-bottom drop-shadow-xl opacity-0 ${member.imgClasses ? member.imgClasses : 'w-[95%] max-h-[340px]'}`} 
                draggable={false}
              />
            </div>

            {/* Text details */}
            <div className="staff-details w-full text-left opacity-0">
              <h3 className="text-black font-bold text-[20px] leading-tight mb-1">{member.name}</h3>
              <p className="text-[#c22026] font-medium text-[13px] tracking-[0.04em] uppercase mb-3">{member.role}</p>
              
              {/* Email Icon */}
              <button
                type="button"
                data-cursor-ignore
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/>
                  <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
                </svg>
              </button>
            </div>

              </div>
            </SwiperSlide>
        ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
