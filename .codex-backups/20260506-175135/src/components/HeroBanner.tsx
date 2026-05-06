import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, ChevronDown, Menu } from 'lucide-react';

const slides = [
  {
    image: 'https://infinityconstructions.com.au/wp-content/uploads/2023/11/infinity-home-banner-01.webp',
    caption: 'Punchbowl Mosque',
  },
  {
    image: 'https://infinityconstructions.com.au/wp-content/uploads/2023/11/infinity-home-banner-02.webp',
    caption: 'Scape Victoria Street',
  },
  {
    image: 'https://infinityconstructions.com.au/wp-content/uploads/2023/11/infinity-home-banner-03.webp',
    caption: 'GSA Pelham Street',
  },
  {
    image: 'https://infinityconstructions.com.au/wp-content/uploads/2023/11/infinity-home-banner-04.webp',
    caption: 'Dangrove Art Facility',
  },
  {
    image: 'https://infinityconstructions.com.au/wp-content/uploads/2023/11/infinity-home-banner-05.webp',
    caption: 'Bankstown RSL',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
  };

  // Autoplay
  useEffect(() => {
    setProgress(0);
    const interval = 8000;
    const step = 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
           setCurrentSlide((s) => (s + 1) % slides.length);
           return 0;
        }
        return prev + (step / interval) * 100;
      });
    }, step);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Initial Entry Animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Ensure initial states (to prevent flashing)
    gsap.set(['.scroll-indicator', '.bottom-controls'], { opacity: 0 });
    
    // Then main text
    if (textRef.current) {
      const words = gsap.utils.toArray('.word', textRef.current);
      tl.fromTo(
        words,
        { y: 60, opacity: 0, rotateX: -30 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.05 },
        0.8 // Start slightly after menus
      );
      tl.fromTo('.subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 1.2);
    }

    // Finally bottom controls and scroll indicator
    tl.fromTo('.scroll-indicator', { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 1.3);
    tl.fromTo('.bottom-controls', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 1.5);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-zinc-900">
      {/* Background Images with GSAP fade transition */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full"
          style={{
            zIndex: index === currentSlide ? 10 : 0,
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 8s ease-out',
            }}
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </div>
      ))}

      {/* Main Content Area */}
      <div className="relative z-20 h-full max-w-[90%] mx-auto flex items-center">
        <div className="max-w-3xl">
          <h1 
            ref={textRef} 
            className="font-medium overflow-hidden leading-[1.3]"
            style={{ 
              fontSize: '32px', 
              fontFamily: '"Times New Roman", Times, serif', 
              textAlign: 'left', 
              color: '#ffffff', 
              width: '725px', 
              maxWidth: '100%',
              height: 'auto' 
            }}
          >
            {/* Split text into words for animation */}
            {'Construire l’avenir avec précision et confiance'.split(' ').map((word, i) => (
               <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-top">
                 <span className="word inline-block">{word}</span>
               </span>
            ))}
          </h1>
          <p className="subtitle text-white/85 mt-3 pr-4 text-[16px] font-light opacity-0 max-w-2xl tracking-wide leading-relaxed drop-shadow-sm">
            Construction, rénovation et gestion de projets pour des espaces durables et modernes.
          </p>
        </div>
      </div>


      {/* Floating Red Accent */}
      <div className="absolute right-32 top-[18%] z-30 hidden md:block w-[10px] h-[10px] bg-[#c22026] rounded-full scroll-indicator opacity-0">
      </div>

      {/* Scroll indicator (Right side) */}
      <div className="absolute right-5 md:right-6 xl:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center scroll-indicator opacity-0">
        <span className="text-white text-[11px] font-medium tracking-[0.4em] font-sans leading-none" style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
        <div className="w-[1.5px] h-[55px] bg-white mt-4" />
      </div>

      {/* Bottom Controls */}
      <div 
        className="absolute bottom-[19px] right-[40px] z-30 bg-white flex items-center pl-[21px] pr-[27px] pt-0 bottom-controls opacity-0 shadow-2xl font-sans"
        style={{
          height: '48px',
          width: '448px',
          marginTop: '-6px',
          marginBottom: '-13px',
          marginRight: '-11px'
        }}
      >
        <div className="text-gray-400 text-[13px] font-medium mr-6">
          <span className="text-black font-bold">{currentSlide + 1}</span><span className="mx-1.5 text-gray-300">/</span>{slides.length}
        </div>
        <a href="#" className="text-black font-semibold text-[15px] flex-1 truncate tracking-tight hover:text-[#c22026] transition-colors">
          {slides[currentSlide].caption}
        </a>
        <div className="flex space-x-5 ml-6">
          <button onClick={prevSlide} className="text-gray-400 hover:text-[#c22026] transition-colors">
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button onClick={nextSlide} className="text-gray-400 hover:text-[#c22026] transition-colors">
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
        <div className="absolute top-0 left-0 h-[2px] bg-[#c22026] transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
