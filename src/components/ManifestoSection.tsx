import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motionDuration, motionEase, motionStagger, usePrefersReducedMotion } from '../lib/motion';
import { homepageContent, localize } from '../data/homepageContent';
import { useLocale } from '../i18n';
import { Badge } from './ui/badge';

gsap.registerPlugin(ScrollTrigger);

export default function ManifestoSection() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { locale } = useLocale();
  const content = homepageContent.manifesto;
  const title = localize(content.title, locale);
  const titleWords = title.split(' ');

  useGSAP(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion) {
      gsap.set(['.manifesto-kicker', '.manifesto-words span', '.manifesto-body', '.manifesto-divider', '.manifesto-metric'], {
        clearProps: 'all',
        opacity: 1,
        y: 0,
        x: 0,
      });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        once: true,
      },
    });

    tl.fromTo(
      '.manifesto-kicker',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: motionDuration.section, ease: motionEase.smooth },
    )
      .fromTo(
        '.manifesto-divider',
        { scaleX: 0 },
        { scaleX: 1, duration: motionDuration.section, ease: motionEase.smooth, transformOrigin: 'left center' },
        '-=0.3',
      )
      .fromTo(
        '.manifesto-words span',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: motionDuration.hero, stagger: motionStagger.tight, ease: motionEase.smooth },
        '-=0.4',
      )
      .fromTo(
        '.manifesto-body',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: motionDuration.section, ease: motionEase.smooth },
        '-=0.5',
      )
      .fromTo(
        '.manifesto-metric',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: motionDuration.section, stagger: 0.08, ease: motionEase.smooth },
        '-=0.35',
      );
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <section
      ref={containerRef}
      className="w-full bg-[#0d0d0d] px-6 py-24 md:px-14 md:py-36"
      aria-label="Company proof and manifesto"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-14 flex flex-wrap items-center gap-4 md:gap-6">
          <Badge
            variant="outline"
            className="manifesto-kicker border-white/12 bg-white/6 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-white/46 opacity-0"
          >
            {localize(content.eyebrow, locale)}
          </Badge>
          <div className="manifesto-divider h-[1px] min-w-[80px] flex-1 origin-left scale-x-0 bg-white/15" />
          <Badge
            variant="outline"
            className="manifesto-kicker border-white/12 bg-white/6 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-white/46 opacity-0"
          >
            {localize(content.credential, locale)}
          </Badge>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.72fr)] lg:items-end">
          <div>
            <h2 className="manifesto-words max-w-[15ch] font-sans text-[2.55rem] font-semibold leading-[1.02] tracking-normal text-white sm:text-[3.15rem] md:text-[4.2rem] lg:text-[5.15rem]">
              {titleWords.map((word, i) => (
                <span key={`${word}-${i}`}>
                  <span className="inline-block overflow-hidden align-top">
                    <span className="inline-block opacity-0">{word}</span>
                  </span>
                  {i < titleWords.length - 1 ? ' ' : null}
                </span>
              ))}
            </h2>

            <p className="manifesto-body mt-9 max-w-[58ch] font-sans text-[16px] leading-[1.75] tracking-normal text-white/58 opacity-0 md:text-[18px]">
              {localize(content.body, locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {content.metrics.map((metric) => (
              <div key={metric.value} className="manifesto-metric border border-white/10 bg-white/[0.035] p-5 opacity-0">
                <div className="text-[34px] font-semibold leading-none text-[#e82a2e] md:text-[44px]">{metric.value}</div>
                <div className="mt-3 text-[13px] font-semibold uppercase leading-snug tracking-[0.13em] text-white/72">
                  {localize(metric.label, locale)}
                </div>
                {metric.detail && (
                  <div className="mt-2 text-[13px] leading-relaxed text-white/42">
                    {localize(metric.detail, locale)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
