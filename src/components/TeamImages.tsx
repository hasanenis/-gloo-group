import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TEAM_IMAGES = [
  {
    src: "https://infinityconstructions.com.au/wp-content/uploads/2026/02/Experienced-construction-staff-meber-on-site-1024x683.jpg",
    alt: "Experienced construction staff member on site",
    position: "22% 11%"
  },
  {
    src: "https://infinityconstructions.com.au/wp-content/uploads/2026/02/INFINITY-x-NOV-18th-2025-163-1024x683.jpg",
    alt: "Infinity Construction professional profile",
    position: "30% 20%"
  },
  {
    src: "https://infinityconstructions.com.au/wp-content/uploads/2026/02/INFINITY-x-NOV-18th-2025-26-1024x683.jpg",
    alt: "Construction project delivery team",
    position: "21% 24%"
  }
];

export default function TeamImages() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.team-image-wrapper', 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        stagger: 0.2, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#0a0a0a] pt-[110px] pb-[90px] md:pt-[60px] md:pb-[40px]">
      <div className="max-w-[1470px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-[30px]">
          {TEAM_IMAGES.map((img, index) => (
            <div key={index} className="team-image-wrapper opacity-0 w-full aspect-square overflow-hidden shadow-lg border border-black/10">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                style={{ objectPosition: img.position }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
