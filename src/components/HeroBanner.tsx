import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  motionDuration,
  motionDurationFor,
  motionEase,
  motionStagger,
  usePrefersReducedMotion,
} from '../lib/motion';
import { heroSlides } from '../data/projects';

const slides = heroSlides;

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(100);
      return;
    }

    setProgress(0);
    const interval = 8000;
    const step = 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((value) => (value + 1) % slides.length);
          return 0;
        }
        return prev + (step / interval) * 100;
      });
    }, step);
    return () => clearInterval(timer);
  }, [currentSlide, prefersReducedMotion]);

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(['.scroll-indicator', '.bottom-controls', '.word', '.subtitle'], {
        clearProps: 'all',
        opacity: 1,
        x: 0,
        y: 0,
        rotateX: 0,
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: motionEase.smooth } });
    gsap.set(['.scroll-indicator', '.bottom-controls'], { opacity: 0 });

    if (textRef.current) {
      const words = gsap.utils.toArray('.word', textRef.current);
      tl.fromTo(
        words,
        { y: 60, opacity: 0, rotateX: -30 },
        { y: 0, opacity: 1, rotateX: 0, duration: motionDuration.hero, stagger: motionStagger.tight },
        0.8,
      );
      tl.fromTo('.subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: motionDuration.section }, 1.12);
    }

    tl.fromTo('.scroll-indicator', { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: motionDuration.section }, 1.22);
    tl.fromTo('.bottom-controls', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: motionDuration.section }, 1.38);
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-zinc-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full"
          style={{
            zIndex: index === currentSlide ? 10 : 0,
            opacity: index === currentSlide ? 1 : 0,
            transition: `opacity ${motionDurationFor(motionDuration.hero)}s ease-in-out`,
          }}
        >
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
              transition: `transform ${prefersReducedMotion ? 0.01 : 8}s ease-out`,
            }}
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </div>
      ))}

      <div className="relative z-20 h-full max-w-[90%] mx-auto flex items-center">
        <div className="max-w-3xl">
          <h1
            ref={textRef}
            className="font-serif overflow-hidden leading-[1.12] text-[1.85rem] sm:text-[2.2rem] md:text-[2.85rem] lg:text-[3.35rem] max-w-[13ch]"
            style={{ textAlign: 'left', color: '#ffffff', maxWidth: '100%', height: 'auto' }}
          >
            {'L’empreinte de demain, pensée pour durer'.split(' ').map((word, index) => (
              <span key={index} className="inline-block overflow-hidden mr-[0.25em] align-top">
                <span className="word inline-block">{word}</span>
              </span>
            ))}
          </h1>
          <p className="subtitle text-white/85 mt-4 pr-4 text-[15px] md:text-[17px] font-light opacity-0 max-w-[42rem] tracking-[0.01em] leading-[1.7] drop-shadow-sm">
            Igloo shapes residential and mixed-use places with measured execution, architectural clarity, and a lasting sense of presence.
          </p>
        </div>
      </div>

      <div className="absolute right-5 md:right-6 xl:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center scroll-indicator opacity-0">
        <span className="text-white text-[11px] font-semibold tracking-[0.3em] font-sans leading-none" style={{ writingMode: 'vertical-rl' }}>
          SCROLL
        </span>
        <div className="w-[1.5px] h-[55px] bg-white mt-4" />
      </div>

      <div
        className="absolute bottom-[19px] right-[40px] z-30 bg-white flex items-center pl-[21px] pr-[27px] pt-0 bottom-controls opacity-0 shadow-2xl font-sans max-md:left-6 max-md:right-6 max-md:w-auto"
        style={{
          height: '48px',
          width: '448px',
          marginTop: '-6px',
          marginBottom: '-13px',
          marginRight: '-11px',
        }}
      >
        <div className="text-gray-400 text-[12px] md:text-[13px] font-medium mr-5 md:mr-6">
          <span className="text-black font-bold">{currentSlide + 1}</span>
          <span className="mx-1.5 text-gray-300">/</span>
          {slides.length}
        </div>
        <span className="text-black font-semibold text-[14px] md:text-[15px] flex-1 truncate tracking-tight">
          {slides[currentSlide].caption}
        </span>
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
