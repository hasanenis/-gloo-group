import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motionDuration, motionEase, usePrefersReducedMotion } from '../lib/motion';

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
  const cursorRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Cursor & Click to scroll state
  const [cursorDirection, setCursorDirection] = useState<'left' | 'right'>('right');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollable = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  // Custom Cursor
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && isHovered) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: motionDuration.fast,
          ease: motionEase.soft
        });
      }
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [isHovered]);

  useEffect(() => {
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  const handleClick = () => {
    if (!sliderRef.current || prefersReducedMotion) return;
    const cardWidth = 260 + 32; // Approx 260px card + 32px gap
    const scrollAmount = cardWidth;
    const targetScroll = sliderRef.current.scrollLeft + (cursorDirection === 'left' ? -scrollAmount : scrollAmount);
    
    gsap.to(sliderRef.current, { 
      scrollLeft: targetScroll, 
      duration: motionDuration.hover, 
      ease: motionEase.soft,
      onUpdate: checkScrollable
    });
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
    cards.forEach((card) => {
      const q = gsap.utils.selector(card);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          scroller: sliderRef.current,
          horizontal: true,
          start: 'left right', 
          end: 'right left', 
          toggleActions: 'play reverse play reverse',
        }
      });

      tl.fromTo(q('.staff-img'), 
        { opacity: 0, y: 40, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: motionDuration.section, ease: motionEase.expo }
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
      
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-12 h-12 rounded-full bg-white flex items-center justify-center pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-[-6px] border border-dashed border-black/40 rounded-full animate-spin-slow"></div>
        {cursorDirection === 'left' ? (
          <ArrowLeft className={`w-5 h-5 transition-colors duration-300 ${!canScrollLeft ? 'text-gray-300' : 'text-black'}`} strokeWidth={1.5} />
        ) : (
          <ArrowRight className={`w-5 h-5 transition-colors duration-300 ${!canScrollRight ? 'text-gray-300' : 'text-black'}`} strokeWidth={1.5} />
        )}
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 mb-16">
        <h2 className="staff-title text-[36px] md:text-[42px] text-[#c22026] font-light uppercase tracking-wide leading-none opacity-0">
          OUR TEAM
        </h2>
      </div>

      {/* Slider Container */}
      <div className="w-full max-w-[1200px] mx-auto">
        <div 
          className="w-full flex overflow-x-auto space-x-6 md:space-x-8 px-4 md:px-8 pb-12 cursor-none hide-scrollbar select-none"
          onMouseEnter={() => setIsHovered(!prefersReducedMotion)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMoveContainer}
          onClick={handleClick}
          onScroll={checkScrollable}
          ref={sliderRef}
        >
          {STAFF.map((member, index) => (
            <div key={index} className="staff-card flex-shrink-0 w-[240px] md:w-[260px] flex flex-col items-center" style={{ marginTop: member.marginTop }}>
            
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
              <div 
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setIsHovered(false)}
                onMouseLeave={() => setIsHovered(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/>
                  <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
                </svg>
              </div>
            </div>

          </div>
        ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
