import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motionDuration, motionEase, motionStagger, usePrefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    id: 1,
    name: "Jean-Pierre Laurent - Directeur Général - Groupe Bâtiment Frères",
    quote: "The Igloo Team truly excel in every aspect of their work and have delivered an exceptional level of quality throughout this build. Their integrity, unwavering commitment to safety, efficiency, and innovation without compromise instilled confidence and trust from day one. From initial discussions to project updates, they maintained open and transparent lines of communication and kept us well-informed along the way. Igloo is a builder you can rely on without question and we recommend them for any project, big or small."
  },
  {
    id: 2,
    name: "Sylvie Dubois - Architecte Principale - Studio Lumière Paris",
    quote: "Igloo Constructions brings a high level of professionalism and technical nuance to their work. We highly appreciate their dedication and their precise attention to detail on complex structural challenges."
  },
  {
    id: 3,
    name: "Luc Martin - Directeur de la Construction - Châteaux & Domaines",
    quote: "Their commitment to delivering complicated builds on time is truly impressive, setting a benchmark for the industry. Working with Igloo was a seamless experience."
  },
  {
    id: 4,
    name: "Amélie Lefèvre - Directrice de Projet Nationale - Colliers France",
    quote: "It was a pleasure working with Igloo, their team is highly communicative, supportive, and exceptionally results-oriented."
  },
  {
    id: 5,
    name: "Antoine Moreau - Gestionnaire de Portefeuille - Investissements Horizon",
    quote: "Great performance across the board. Quality, safety, and delivery were exceptional. Igloo exceeded our expectations at every phase."
  },
  {
    id: 6,
    name: "Camille Bernard - Présidente et Directrice Générale - Société Hôtelière de Lyon",
    quote: "A dependable partner in our growth and development. Igloo's commitment to our vision made all the difference in realizing our latest resort."
  },
  {
    id: 7,
    name: "Mathieu Girard - Responsable de Développement",
    quote: "Consistently delivering high-grade results on complex sites. Igloo's operational efficiency is unmatched in the French market."
  },
  {
    id: 8,
    name: "Julien Roux - Président Exécutif - Les Éditions Mont Blanc",
    quote: "An outstanding result delivered by a highly capable team. We look forward to partnering with Igloo on our future expansions."
  }
];

export default function Testimonials() {
  const [openId, setOpenId] = useState<number | null>(1);
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion) {
      gsap.set(['.testimonial-header', '.testimonial-item'], { clearProps: 'all', opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo('.testimonial-header',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: motionDuration.section,
        ease: motionEase.smooth,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true
        }
      }
    );

    gsap.fromTo('.testimonial-item',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: motionDuration.hover,
        stagger: motionStagger.standard,
        ease: motionEase.smooth,
        scrollTrigger: {
          trigger: '.testimonial-list',
          start: 'top 85%',
          once: true
        }
      }
    );
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section ref={containerRef} className="py-20 md:py-28 bg-white w-full font-sans">
      <div className="max-w-[1440px] mx-auto px-8 md:px-14">
        <h2 className="testimonial-header opacity-0 text-[32px] md:text-[36px] text-[#c22026] font-light tracking-[0.03em] mb-12 uppercase">
          Client Testimonials
        </h2>

        <div className="testimonial-list flex flex-col border-t border-gray-200">
          {TESTIMONIALS.map((testimonial) => {
            const isOpen = openId === testimonial.id;
            return (
              <div key={testimonial.id} className="testimonial-item opacity-0 border-b border-gray-100">
                <button
                  onClick={() => toggleOpen(testimonial.id)}
                  className="w-full py-5 flex justify-between items-center text-left transition-colors"
                >
                  <span className="text-[16px] md:text-[18px] font-normal leading-[1.45] text-[#222] pr-8">
                    {testimonial.name}
                  </span>
                  <span className="text-black flex-shrink-0">
                    {isOpen ? <X className="w-4 h-4" strokeWidth={1.5} /> : <Plus className="w-4 h-4" strokeWidth={1.5} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 pt-4 pr-4 md:pr-12 pl-[18px]">
                        <div className="border-l-[3px] border-[#c22026] pl-5 md:pl-7 py-1">
                          <p className="text-[15px] md:text-[16px] text-black italic leading-[1.85] font-medium">
                            "{testimonial.quote}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
