import React, { useRef } from 'react';
import { Building2, Award, MapPinned, HardHat } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motionDuration, motionDurationFor, motionEase, motionStagger, usePrefersReducedMotion } from '../lib/motion';
import { useLocale } from '../i18n';
import { Card } from './ui/card';
import { SectionHeader } from './ui/section-header';

gsap.registerPlugin(ScrollTrigger);

type StatItem = {
  id: number;
  icon: typeof Award;
  value: number;
  decimals: number;
  label: { en: string; fr: string };
  prefix?: string;
  suffix?: string;
};

const STATS: StatItem[] = [
  {
    id: 1,
    icon: Award,
    value: 8,
    decimals: 0,
    suffix: '+',
    label: { en: 'Years of experience', fr: "Années d’expérience" },
  },
  {
    id: 2,
    icon: Building2,
    value: 11,
    decimals: 0,
    label: { en: 'Projects in portfolio', fr: 'Projets au portefeuille' },
  },
  {
    id: 3,
    icon: HardHat,
    value: 2500,
    decimals: 0,
    suffix: '+',
    label: { en: 'Housing units delivered', fr: 'Logements livrés' },
  },
  {
    id: 4,
    icon: MapPinned,
    value: 4,
    decimals: 0,
    label: { en: 'Wilayas covered', fr: 'Wilayas couvertes' },
  },
];

export default function StatsGrid() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { locale } = useLocale();

  useGSAP(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion) {
      gsap.set('.stat-item', { clearProps: 'all', opacity: 1, y: 0 });
      gsap.utils.toArray<HTMLElement>('.stat-val').forEach((item) => {
        item.innerText = Number(item.getAttribute('data-val') || '0').toString();
      });
      return;
    }

    gsap.fromTo(
      '.stat-item',
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
          once: true,
        },
      },
    );

    const statItems = gsap.utils.toArray<HTMLElement>('.stat-val');
    statItems.forEach((item, index) => {
      const target = parseFloat(item.getAttribute('data-val') || '0');
      const decimals = parseInt(item.getAttribute('data-decimals') || '0', 10);

      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: motionDurationFor(2),
        ease: motionEase.smooth,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
        onUpdate: () => {
          item.innerText = obj.val.toFixed(decimals);
        },
      });
    });
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <section ref={containerRef} className="w-full bg-white px-8 py-16 font-sans md:px-14 md:py-20">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader
          className="mb-10 md:mb-14"
          eyebrowLabel={locale === 'fr' ? 'Performance' : 'Performance'}
          title={locale === 'fr' ? 'Chiffres clés' : 'Key figures'}
          description={
            locale === 'fr'
              ? 'Une lecture rapide de la portée du travail et du rythme de livraison de l’entreprise.'
              : 'A quick read on delivery scope and the pace of the business.'
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-5">
          {STATS.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.id}
                padding="compact"
                className="stat-item flex items-start gap-4 opacity-0"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-black/5 text-black/60">
                  <Icon strokeWidth={1.4} className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-baseline gap-1.5">
                    <span className="text-[34px] font-medium leading-none text-[#c22026] md:text-[44px]">
                      {stat.prefix && <span className="mr-0.5 text-[20px] md:text-[24px]">{stat.prefix}</span>}
                      <span className="stat-val" data-val={stat.value} data-decimals={stat.decimals}>
                        0
                      </span>
                      {stat.suffix && <span className="ml-0.5 text-[20px] md:text-[24px]">{stat.suffix}</span>}
                    </span>
                  </div>
                  <span className="block max-w-[20ch] text-[15px] font-medium leading-snug text-black md:text-[17px]">
                    {stat.label[locale]}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
