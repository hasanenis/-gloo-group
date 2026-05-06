import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { motionDuration, motionEase, usePrefersReducedMotion } from '../lib/motion';
import { homeProjectCards } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = homeProjectCards;

const ProjectCard: React.FC<{ project: (typeof PROJECTS)[number] }> = ({ project }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseEnter = () => {
    if (!cardRef.current || prefersReducedMotion) return;
    const q = gsap.utils.selector(cardRef.current);
    gsap.to(q('.project-img'), { scale: 1.03, duration: motionDuration.hover, ease: motionEase.soft });
    gsap.to(q('.overlay'), {
      y: '58%',
      backgroundColor: 'rgba(0,0,0,0.88)',
      duration: motionDuration.hover,
      ease: motionEase.soft,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || prefersReducedMotion) return;
    const q = gsap.utils.selector(cardRef.current);
    gsap.to(q('.project-img'), { scale: 1, duration: motionDuration.hover, ease: motionEase.soft });
    gsap.to(q('.overlay'), {
      y: '0%',
      backgroundColor: 'rgba(0,0,0,0.4)',
      duration: motionDuration.hover,
      ease: motionEase.soft,
    });
  };

  return (
    <Link
      ref={cardRef}
      to={`/projects#${project.slug}`}
      className="relative w-[80vw] sm:w-[400px] lg:w-[480px] h-[60vh] min-h-[300px] max-h-[600px] overflow-hidden cursor-pointer group flex-shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={project.images[0]} alt={project.title} className="project-img absolute inset-0 w-full h-full object-cover origin-center will-change-transform" />
      <div className="overlay absolute inset-0 bg-black/40 pointer-events-none" />

      <div className="absolute flex flex-col justify-end bottom-0 left-0 w-full h-[60%] p-6 md:p-8 pointer-events-none z-10">
        <span className="text-white/70 text-[11px] md:text-[12px] font-semibold tracking-[0.28em] uppercase mb-3">
          {project.chapterLabel}
        </span>
        <h3 className="text-white text-[20px] md:text-[22px] font-medium leading-[1.3] mb-3 font-sans max-w-[90%] drop-shadow-sm">
          {project.title}
        </h3>
        <p className="text-white/85 text-[13px] md:text-[14px] font-light leading-relaxed line-clamp-3">
          {project.summary}
        </p>
      </div>
    </Link>
  );
};

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    const strip = stripRef.current;
    if (!strip || !sectionRef.current || prefersReducedMotion) return;

    const getToValue = () => -(strip.scrollWidth - window.innerWidth);

    gsap.to(strip, {
      x: getToValue,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => '+=' + strip.scrollWidth,
        pin: true,
        scrub: 1.35,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] });

  return (
    <section ref={sectionRef} className="h-screen bg-white w-full font-sans flex flex-col overflow-hidden relative">
      <div className="w-full flex-shrink-0 flex items-end pt-20 md:pt-28 pb-6 md:pb-10 px-8 md:px-14">
        <div className="w-full max-w-[1526px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <h2 className="text-[34px] md:text-[42px] text-[#c22026] font-light uppercase tracking-[0.04em] leading-none">
            OUR PROJECTS
          </h2>
          <a
            href="/projects"
            className="text-[14px] md:text-[15px] font-medium text-black border-b border-black pb-1 hover:text-[#c22026] hover:border-[#c22026] transition-colors whitespace-nowrap"
          >
            View All Projects
          </a>
        </div>
      </div>

      <div className="flex-1 flex items-center overflow-hidden w-full relative mb-12">
        <div ref={stripRef} className="flex flex-nowrap gap-6 md:gap-8 px-8 md:px-14 w-max">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
