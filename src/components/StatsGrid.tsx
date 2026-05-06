import React, { useRef } from 'react';
import { Building2, Presentation, Award, MapPinned, Star, RefreshCcw, HardHat, Wallet } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motionDuration, motionDurationFor, motionEase, motionStagger, usePrefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    id: 1,
    icon: Building2,
    value: 600,
    decimals: 0,
    suffix: "+",
    label: "Projects Built"
  },
  {
    id: 2,
    icon: Star,
    value: 4.5,
    decimals: 1,
    suffix: "-Star",
    label: "Gold iCIRT Rating"
  },
  {
    id: 3,
    icon: Presentation,
    prefix: "$",
    value: 2.5,
    decimals: 1,
    suffix: "B",
    label: "Combined Value"
  },
  {
    id: 4,
    icon: RefreshCcw,
    value: 90,
    decimals: 0,
    suffix: "%",
    label: "Repeat Clientele"
  },
  {
    id: 5,
    icon: Award,
    value: 33,
    decimals: 0,
    suffix: "+",
    label: "Years of Excellence"
  },
  {
    id: 6,
    icon: HardHat,
    value: 130,
    decimals: 0,
    suffix: "+",
    label: "Igloo Staff"
  },
  {
    id: 7,
    icon: MapPinned,
    value: 2,
    decimals: 0,
    label: "Office Locations (Sydney & Melbourne)"
  },
  {
    id: 8,
    icon: Wallet,
    prefix: "$",
    value: 0,
    decimals: 0,
    label: "No Bank Finance"
  }
];

export default function StatsGrid() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion) {
      gsap.set('.stat-item', { clearProps: 'all', opacity: 1, y: 0 });
      gsap.utils.toArray<HTMLElement>('.stat-val').forEach((item) => {
        item.innerText = Number(item.getAttribute('data-val') || '0').toString();
      });
      return;
    }
    
    // Entrance animation for items
    gsap.fromTo('.stat-item', 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: motionDuration.section, 
        stagger: motionStagger.standard, 
        ease: motionEase.smooth,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true
        }
      }
    );

    // Number counter animation
    const statItems = gsap.utils.toArray<HTMLElement>('.stat-val');
    statItems.forEach((item, index) => {
      const target = parseFloat(item.getAttribute('data-val') || "0");
      const decimals = parseInt(item.getAttribute('data-decimals') || "0");
      
      const obj = { val: 0 };
      
      gsap.to(obj, {
        val: target,
        duration: motionDurationFor(2),
        ease: motionEase.smooth,
        delay: index * 0.1, // sync with stagger
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true
        },
        onUpdate: () => {
          item.innerText = obj.val.toFixed(decimals);
        }
      });
    });
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-white w-full font-sans">
      <div className="max-w-[1440px] mx-auto px-8 md:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 xl:gap-x-24 gap-y-10 md:gap-y-12">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="stat-item flex items-center border-b border-[#c22026] pb-5 opacity-0">
                {/* Icon */}
                <div className="w-[70px] md:w-[90px] flex justify-start text-black/60 shrink-0">
                  <Icon strokeWidth={0.7} className="w-[45px] h-[45px] md:w-[55px] md:h-[55px]" />
                </div>
                
                {/* Value */}
                <div className="w-[140px] md:w-[180px] flex items-start shrink-0">
                  <span className="text-[34px] md:text-[44px] font-medium text-[#c22026] leading-none flex items-start -mt-1">
                    {stat.prefix && (
                      <span className="text-[20px] md:text-[24px] font-medium mt-1 mr-0.5 leading-none">
                        {stat.prefix}
                      </span>
                    )}
                    <span 
                      className="stat-val" 
                      data-val={stat.value} 
                      data-decimals={stat.decimals}
                    >
                      0
                    </span>
                    {stat.suffix && (
                      <span className="text-[20px] md:text-[24px] font-medium mt-1.5 ml-0.5 leading-none">
                        {stat.suffix}
                      </span>
                    )}
                  </span>
                </div>
                
                {/* Label */}
                <div className="flex-1 flex items-center pr-4">
                  <span className="text-[16px] md:text-[18px] font-medium text-black leading-snug">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
