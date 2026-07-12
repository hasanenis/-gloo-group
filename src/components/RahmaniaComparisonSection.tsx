import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { motionDuration, motionEase, motionStagger, usePrefersReducedMotion } from '../lib/motion';
import type { Locale } from '../i18n';

gsap.registerPlugin(ScrollTrigger);

type TitleToken = {
  text: string;
  accent?: boolean;
};

type TitleLine = TitleToken[];

type CinematicCopy = {
  eyebrow: string;
  title: string;
  titleLines: TitleLine[];
  body: string;
  panelEyebrow: string;
  panelTitle: string;
  panelBody: string;
  panelPoints: string[];
  beforeLabel: string;
  afterLabel: string;
};

const copyByLocale: Record<'en' | 'fr', CinematicCopy> = {
  // Note: authored in en/fr only. For dz/tr we fall back to English (see below).
  en: {
    eyebrow: 'Rahmania / Douira',
    title: 'Commerce, services and everyday life brought together at the heart of a growing neighbourhood.',
    titleLines: [
      [{ text: 'Commerce, services and' }],
      [{ text: 'everyday life brought together' }],
      [{ text: 'at the ' }, { text: 'heart', accent: true }, { text: ' of a growing' }],
      [{ text: 'neighbourhood.' }],
    ],
    body: 'Inside, circulation runs around a central staircase while the pyramidal glass skylight lights the retail levels below. Both interiors were finished by Igloo as part of the secondary works — finishes, technical networks, and the details that make the difference.',
    panelEyebrow: 'Before / After',
    panelTitle: 'The glass pyramid',
    panelBody: 'The distinctive element of the project: a pyramidal glass skylight crowning the central atrium. Sketched first as a simple massing study, it was executed as a glazed structure that pours natural light onto the retail levels and the central staircase below.',
    panelPoints: [
      'Drawn as a massing study over the central atrium',
      'Executed by Igloo within the secondary works package',
      'Natural light across the retail levels',
    ],
    beforeLabel: 'Before',
    afterLabel: 'After',
  },
  fr: {
    eyebrow: 'Rahmania / Douira',
    title: "Commerces, services et vie quotidienne réunis au cœur d'un quartier en croissance.",
    titleLines: [
      [{ text: 'Commerces, services et' }],
      [{ text: 'vie quotidienne réunis' }],
      [{ text: 'au ' }, { text: 'cœur', accent: true }, { text: " d'un quartier" }],
      [{ text: 'en croissance.' }],
    ],
    body: "À l'intérieur, la circulation s'articule autour d'un escalier central tandis que la verrière pyramidale éclaire les niveaux commerciaux. Les intérieurs ont été achevés par Igloo dans le cadre des corps d'état secondaires : finitions, réseaux techniques et détails qui font la différence.",
    panelEyebrow: 'Avant / Après',
    panelTitle: 'La pyramide de verre',
    panelBody: "L'élément distinctif du projet : une verrière pyramidale en verre couronnant l'atrium central. D'abord esquissée comme une simple étude de volume, elle a été exécutée en structure vitrée qui diffuse la lumière naturelle sur les niveaux commerciaux et l'escalier central.",
    panelPoints: [
      "Esquissée comme étude de volume sur l'atrium central",
      "Exécutée par Igloo dans le cadre des corps d'état secondaires",
      'Lumière naturelle dans les niveaux commerciaux',
    ],
    beforeLabel: 'Avant',
    afterLabel: 'Après',
  },
};

type RahmaniaCinematicSectionProps = {
  locale: Locale;
  backgroundImage: string;
  beforeImage: string;
  afterImage: string;
};

function renderLine(line: TitleLine) {
  return line.map((token, index) =>
    token.accent ? (
      <span key={`${token.text}-${index}`} className="text-[#e82a2e]">
        {token.text}
      </span>
    ) : (
      <span key={`${token.text}-${index}`}>{token.text}</span>
    ),
  );
}

export default function RahmaniaComparisonSection({
  locale,
  backgroundImage,
  beforeImage,
  afterImage,
}: RahmaniaCinematicSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  // Authored content exists for en/fr only; for dz/tr fall back to English.
  const copy = copyByLocale[locale === 'fr' ? 'fr' : 'en'];

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const background = root.querySelector<HTMLElement>('.rahmania-cinematic__background');
      const eyebrow = root.querySelector<HTMLElement>('.rahmania-cinematic__eyebrow');
      const body = root.querySelector<HTMLElement>('.rahmania-cinematic__body');
      const accentDot = root.querySelector<HTMLElement>('.rahmania-cinematic__accent-dot');
      const lines = gsap.utils.toArray<HTMLElement>('.rahmania-cinematic__line', root);
      const panel = root.querySelector<HTMLElement>('.rahmania-comparison__panel');
      const panelSide = root.querySelector<HTMLElement>('.rahmania-comparison__side');
      const panelFrame = root.querySelector<HTMLElement>('.rahmania-comparison__frame');
      const panelTitle = root.querySelector<HTMLElement>('.rahmania-comparison__side-title');
      const panelBody = root.querySelector<HTMLElement>('.rahmania-comparison__side-body');
      const panelItems = gsap.utils.toArray<HTMLElement>('.rahmania-comparison__side-item', root);
      const panelMeta = gsap.utils.toArray<HTMLElement>('.rahmania-comparison__meta, .rahmania-comparison__label', root);

      const reduceTargets = [
        background,
        eyebrow,
        body,
        accentDot,
        panel,
        panelSide,
        panelFrame,
        panelTitle,
        panelBody,
        ...lines,
        ...panelMeta,
        ...panelItems,
      ].filter(
        Boolean,
      ) as HTMLElement[];

      if (prefersReducedMotion) {
        gsap.set(reduceTargets, {
          clearProps: 'all',
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        return;
      }

      if (background) {
        gsap.fromTo(
          background,
          { yPercent: -10, scale: 1.08 },
          {
            yPercent: 10,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.05,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 74%',
            once: true,
          },
          defaults: { ease: motionEase.soft },
        })
        .fromTo(eyebrow, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: motionDuration.fast }, 0)
        .fromTo(
          lines,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: motionDuration.slow,
            stagger: motionStagger.standard,
            ease: motionEase.expo,
          },
          0.08,
        )
        .fromTo(body, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: motionDuration.section }, 0.24)
        .fromTo(
          accentDot,
          { scale: 0.65, opacity: 0 },
          { scale: 1, opacity: 1, duration: motionDuration.fast, ease: motionEase.soft },
          0.34,
        );

      if (panel) {
        gsap.fromTo(
          panel,
          { y: 38, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionDuration.slow,
            ease: motionEase.expo,
            scrollTrigger: {
              trigger: panel,
              start: 'top 82%',
              once: true,
            },
          },
        );
      }

      if (panelSide) {
        gsap.fromTo(
          panelSide,
          { x: -22, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: motionDuration.section,
            ease: motionEase.soft,
            scrollTrigger: {
              trigger: panel,
              start: 'top 82%',
              once: true,
            },
          },
        );
      }

      if (panelFrame) {
        gsap.fromTo(
          panelFrame,
          { x: 18, opacity: 0, scale: 0.985 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: motionDuration.section,
            ease: motionEase.soft,
            scrollTrigger: {
              trigger: panelFrame,
              start: 'top 82%',
              once: true,
            },
          },
        );
      }

      if (panelTitle) {
        gsap.fromTo(
          panelTitle,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionDuration.section,
            ease: motionEase.soft,
            scrollTrigger: {
              trigger: panel,
              start: 'top 82%',
              once: true,
            },
          },
        );
      }

      if (panelBody) {
        gsap.fromTo(
          panelBody,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionDuration.section,
            ease: motionEase.soft,
            scrollTrigger: {
              trigger: panel,
              start: 'top 82%',
              once: true,
            },
          },
        );
      }

      if (panelItems.length) {
        gsap.fromTo(
          panelItems,
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionDuration.section,
            stagger: motionStagger.standard,
            ease: motionEase.soft,
            scrollTrigger: {
              trigger: panel,
              start: 'top 82%',
              once: true,
            },
          },
        );
      }

      if (panelMeta.length) {
        gsap.fromTo(
          panelMeta,
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionDuration.section,
            stagger: motionStagger.tight,
            ease: motionEase.soft,
            scrollTrigger: {
              trigger: panel,
              start: 'top 82%',
              once: true,
            },
          },
        );
      }

    },
    { scope: sectionRef, dependencies: [locale, prefersReducedMotion] },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white text-[#111]">
      <div className="rahmania-cinematic__hero relative isolate min-h-[92svh] overflow-hidden bg-black px-6 py-20 text-white md:min-h-[100svh] md:px-12 md:py-28 lg:px-20">
        <div
          className="rahmania-cinematic__background absolute inset-0"
          data-editorial-parallax-frame
          data-editorial-parallax-from={-10}
          data-editorial-parallax-to={10}
        >
          <img
            src={backgroundImage}
            alt={locale === 'fr' ? 'Centres commerciaux de Rahmania' : 'Rahmania commercial centres'}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            data-editorial-parallax-image
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.58)_45%,rgba(0,0,0,0.74)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.05),transparent_22%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(92svh-4rem)] max-w-[1526px] items-center md:min-h-[calc(100svh-7rem)]">
          <div className="max-w-[42rem]">
            <p className="rahmania-cinematic__eyebrow mb-5 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.34em] text-white/68 opacity-0">
              <span className="h-px w-10 bg-[#e82a2e]" />
              {copy.eyebrow}
            </p>

            <h2
              className="max-w-[15ch] text-[clamp(1.75rem,3vw,4rem)] font-light leading-[0.92] tracking-[-0.06em] text-white"
              aria-label={copy.title}
            >
              {copy.titleLines.map((line, lineIndex) => (
                <span key={`${copy.title}-${lineIndex}`} className="block overflow-hidden">
                  <span className="rahmania-cinematic__line block will-change-transform">
                    {renderLine(line)}
                  </span>
                </span>
              ))}
            </h2>

            <p className="rahmania-cinematic__body mt-7 max-w-[30rem] text-[13px] leading-7 text-white/72 opacity-0 md:text-[15px]">
              {copy.body}
            </p>

            <div className="rahmania-cinematic__accent-dot mt-10 h-2 w-2 rounded-full bg-[#e82a2e] opacity-0" />
          </div>
        </div>
      </div>

        <div className="border-t border-black/8 bg-white px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="rahmania-comparison__panel mx-auto grid max-w-[1526px] gap-10 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:items-center lg:gap-16">
          <div className="rahmania-comparison__side max-w-[30rem]">
            <p className="rahmania-comparison__meta mb-4 text-[10px] font-bold uppercase tracking-[0.34em] text-black/42">
              {copy.panelEyebrow}
            </p>
            <h3 className="rahmania-comparison__side-title max-w-[12ch] text-[clamp(2rem,3.8vw,3.35rem)] font-light leading-[0.95] tracking-[-0.055em] text-[#111]">
              {copy.panelTitle}
            </h3>
            <p className="rahmania-comparison__side-body mt-5 max-w-[28rem] text-[14px] leading-7 text-black/58 opacity-0 md:text-[15px]">
              {copy.panelBody}
            </p>

            <ol className="mt-10 grid gap-5">
              {copy.panelPoints.map((item) => (
                <li
                  key={item}
                  className="rahmania-comparison__side-item flex items-start gap-3 text-[14px] leading-7 text-black/72 opacity-0 md:text-[15px]"
                >
                  <span className="mt-0.5 h-px w-6 shrink-0 bg-black/20" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rahmania-comparison__frame relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.04)] lg:aspect-[16/9]">
            <img
              src={afterImage}
              alt={locale === 'fr' ? 'Image finale Rahmania' : 'Final Rahmania image'}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <img
              src={beforeImage}
              alt={locale === 'fr' ? 'Image conceptuelle Rahmania' : 'Rahmania concept image'}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                clipPath: 'inset(0 50% 0 0)',
                filter: 'grayscale(1) contrast(1.08) brightness(1.08)',
              }}
            />

            <div
              className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/18 shadow-[0_0_18px_rgba(0,0,0,0.08)]"
              aria-hidden="true"
            />

            <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-4">
              <span className="rahmania-comparison__label text-[10px] font-bold uppercase tracking-[0.24em] text-black/55">
                {copy.beforeLabel}
              </span>
              <span className="rahmania-comparison__label text-[10px] font-bold uppercase tracking-[0.24em] text-black/55">
                {copy.afterLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
