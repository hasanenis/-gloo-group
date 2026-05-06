import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ImageSlider from './ImageSlider';
import {
  motionDuration,
  motionDurationFor,
  motionEase,
  motionStagger,
  usePrefersReducedMotion,
} from '../lib/motion';
import { companyProfile, projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const yearsRef = useRef<HTMLSpanElement>(null);
  const projectsRef = useRef<HTMLSpanElement>(null);
  const yearsActive = new Date().getFullYear() - companyProfile.foundedYear;

  useGSAP(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion) {
      gsap.set(['.about-title', '.about-text', '.stats-image', '.stat-item'], { clearProps: 'all', opacity: 1, x: 0, y: 0 });
      if (yearsRef.current) yearsRef.current.textContent = `${yearsActive}`;
      if (projectsRef.current) projectsRef.current.textContent = `${projects.length}`;
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    tl.fromTo('.about-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: motionDuration.slow, ease: motionEase.smooth })
      .fromTo(
        '.about-text',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: motionDuration.hero, stagger: motionStagger.loose, ease: motionEase.smooth },
        '-=0.7',
      );

    const statsTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 85%',
        once: true,
      },
    });

    statsTl
      .fromTo('.stats-image', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: motionDuration.slow, ease: motionEase.smooth })
      .fromTo(
        '.stat-item',
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: motionDuration.hero, stagger: 0.18, ease: motionEase.smooth },
        '-=0.8',
      );

    ScrollTrigger.create({
      trigger: '.stats-section',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (yearsRef.current) {
          gsap.to(yearsRef.current, {
            innerHTML: yearsActive,
            duration: motionDurationFor(2.2),
            snap: { innerHTML: 1 },
            ease: motionEase.soft,
          });
        }

        if (projectsRef.current) {
          gsap.to(projectsRef.current, {
            innerHTML: projects.length,
            duration: motionDurationFor(2.4),
            snap: { innerHTML: 1 },
            ease: motionEase.soft,
          });
        }
      },
    });
  }, { scope: containerRef, dependencies: [prefersReducedMotion, yearsActive] });

  return (
    <section ref={containerRef} className="w-full bg-white px-8 md:px-14 py-20 md:py-32 xl:py-40 font-sans">
      <div className="max-w-[1526px] mx-auto">
        <div className="flex flex-col md:flex-row items-center px-2 mb-20 md:mb-32">
          <div className="w-full md:w-[35%] relative mb-12 md:mb-0 flex justify-between items-start pr-12 xl:pr-24">
            <h2 className="about-title opacity-0 text-[34px] md:text-[42px] font-light text-[#c22026] leading-[1.1] tracking-[0.02em] pt-1">
              About Us
            </h2>
          </div>

          <div className="w-full md:w-[65%] lg:w-[50%] md:pl-4 lg:pl-8">
            <div className="flex flex-col space-y-7 text-[18px] md:text-[21px] leading-[1.62] text-black font-normal tracking-[-0.01em] max-w-[32rem] md:max-w-[34rem]">
              {companyProfile.overview.map((paragraph) => (
                <p key={paragraph} className="about-text opacity-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="stats-section flex flex-col md:flex-row items-stretch gap-12 lg:gap-24 px-2">
          <div className="stats-image opacity-0 w-full md:w-[60%] overflow-hidden">
            <ImageSlider />
          </div>

          <div className="w-full md:w-[40%] flex flex-col justify-center space-y-16">
            <div className="stat-item opacity-0">
              <div className="text-[120px] md:text-[140px] font-bold text-[#c22026] leading-none mb-4 -ml-1 flex items-start">
                <span ref={yearsRef}>0</span>
                <span className="text-[80px] md:text-[100px] align-top leading-[0.8]">+</span>
              </div>
              <div className="text-[28px] md:text-[32px] font-light text-black pb-8 border-b border-black/80">
                Years Active
              </div>
            </div>

            <div className="stat-item opacity-0">
              <div className="text-[120px] md:text-[140px] font-bold text-[#c22026] leading-none mb-4 -ml-1 flex items-start">
                <span ref={projectsRef}>0</span>
                <span className="text-[80px] md:text-[100px] align-top leading-[0.8]">+</span>
              </div>
              <div className="text-[28px] md:text-[32px] font-light text-black pb-8 border-b border-black/80">
                Projects Featured
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
