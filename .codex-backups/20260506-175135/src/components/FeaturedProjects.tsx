import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: "Scape Champs-Élysées – Paris",
    description: "Mixture lobby student communal space retail back of house areas and commercial kitchens, landscape rooftop terrace, pool, BBQ area.",
    image: "https://infinityconstructions.com.au/wp-content/uploads/2026/03/Scape-Victoria-Street-1024x683.jpg"
  },
  {
    title: "El Biar Tower – Algiers",
    description: "Igloo Construction has just completed an outstanding ten storey commercial structure for Marshall Investment Group and Abadeen Group at",
    image: "https://infinityconstructions.com.au/wp-content/uploads/2023/11/infinity-home-banner-02.webp"
  },
  {
    title: "Mayflower – Aged Care Construction Lyon",
    description: "A two-stage redevelopment of a 110-room, residential aged care dementia-friendly facility with car parking and associated landscaping.",
    image: "https://infinityconstructions.com.au/wp-content/uploads/2026/02/Experienced-construction-staff-meber-on-site-1024x683.jpg"
  },
  {
    title: "Scape Oran – Algeria",
    description: "Scape Oran Student Accommodation Project featuring premium living spaces and comprehensive communal facilities.",
    image: "https://infinityconstructions.com.au/wp-content/uploads/2026/03/Scape-Kensington-1024x683.jpg"
  },
  {
    title: "Bordeaux Student Accommodation",
    description: "Premium student accommodation offering diverse common amenities, central courtyard, and skyline views.",
    image: "https://infinityconstructions.com.au/wp-content/uploads/2026/03/Infinty_Pelican-St-2-1024x683.jpg"
  },
  {
    title: "GSA La Défense",
    description: "Modern facility offering high quality student apartments equipped with study rooms, game areas, and outdoor terraces.",
    image: "https://infinityconstructions.com.au/wp-content/uploads/2026/03/GSA-Pelham-Street-1024x683.jpg"
  },
  {
    title: "Scape Saint-Denis",
    description: "Iconic student living with over 400 beds, premium social spaces, and intricate facade design.",
    image: "https://infinityconstructions.com.au/wp-content/uploads/2026/03/Scape-Lachlan-1024x683.jpg"
  }
];

const ProjectCard: React.FC<{ project: typeof PROJECTS[number] }> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    const q = gsap.utils.selector(cardRef.current);
    gsap.to(q('.project-img'), { scale: 1.05, duration: 0.6, ease: 'power2.out' });
    gsap.to(q('.overlay'), { 
      y: '65%', 
      backgroundColor: 'rgba(0,0,0,1)', 
      duration: 0.5, 
      ease: 'power2.out' 
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const q = gsap.utils.selector(cardRef.current);
    gsap.to(q('.project-img'), { scale: 1, duration: 0.6, ease: 'power2.out' });
    gsap.to(q('.overlay'), { 
      y: '0%', 
      backgroundColor: 'rgba(0,0,0,0.4)', 
      duration: 0.5, 
      ease: 'power2.out' 
    });
  };

  return (
    <div 
      ref={cardRef} 
      className="relative w-[80vw] sm:w-[400px] lg:w-[480px] h-[60vh] min-h-[300px] max-h-[600px] overflow-hidden cursor-pointer group flex-shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img 
        src={project.image} 
        alt={project.title}
        className="project-img absolute inset-0 w-full h-full object-cover origin-center will-change-transform" 
      />
      
      {/* Sliding overlay: starts covering the image, slides down to cover only text on hover */}
      <div className="overlay absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Content wrapper */}
      <div className="absolute flex flex-col justify-end bottom-0 left-0 w-full h-[60%] p-6 md:p-8 pointer-events-none z-10">
        <h3 className="text-white text-[20px] md:text-[22px] font-medium leading-[1.3] mb-3 font-sans max-w-[90%] drop-shadow-sm">
          {project.title}
        </h3>
        <p className="text-white/85 text-[13px] md:text-[14px] font-light leading-relaxed line-clamp-3">
          {project.description}
        </p>
      </div>
    </div>
  );
};

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const strip = stripRef.current;
    if (!strip || !sectionRef.current) return;

    let getToValue = () => -(strip.scrollWidth - window.innerWidth);

    gsap.to(strip, {
      x: getToValue,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top", // Pin when section hits top of viewport
        end: () => "+=" + strip.scrollWidth, // Unpin after scrolling horizontal width
        pin: true,
        scrub: 1, // Smooth scrub
        invalidateOnRefresh: true, // Recalculate on resize
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="h-screen bg-white w-full font-sans flex flex-col overflow-hidden relative">
      <div className="w-full flex-shrink-0 flex items-end pt-20 md:pt-28 pb-6 md:pb-10 px-8 md:px-14">
        {/* Header */}
        <div className="w-full max-w-[1526px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <h2 className="text-[36px] md:text-[42px] text-[#c22026] font-light uppercase tracking-wide leading-none">
            FEATURED PROJECTS
          </h2>
          <a 
            href="#" 
            className="text-[15px] md:text-[16px] text-black border-b border-black pb-1 hover:text-[#c22026] hover:border-[#c22026] transition-colors whitespace-nowrap"
          >
            View All Projects
          </a>
        </div>
      </div>

      {/* Scrolling slider container */}
      <div className="flex-1 flex items-center overflow-hidden w-full relative mb-12">
        <div ref={stripRef} className="flex flex-nowrap gap-6 md:gap-8 px-8 md:px-14 w-max">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
