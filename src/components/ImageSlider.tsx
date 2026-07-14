import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { imageSliderImages } from '../data/projects';
import { motionEase, usePrefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = imageSliderImages;
const HOLD_DURATION = 5.2;
const TRANSITION_DURATION = 1.25;

function getObjectPosition(image: string) {
  if (image.includes('04-final-4')) return 'center 44%';
  if (image.includes('01-final-1')) return 'center 42%';
  return 'center center';
}

type ImageSliderProps = {
  className?: string;
};

export default function ImageSlider({ className = '' }: ImageSliderProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    const root = frameRef.current;
    if (!root) return;

    const slides = Array.from(root.querySelectorAll<HTMLImageElement>('[data-image-slide]'));
    const parallaxLayer = root.querySelector<HTMLElement>('[data-image-parallax]');

    if (!slides.length) return;

    gsap.set(slides, { opacity: 0, scale: 1.08 });
    gsap.set(slides[0], { opacity: 1, scale: prefersReducedMotion ? 1 : 1.04 });

    if (prefersReducedMotion) {
      gsap.set(parallaxLayer, { clearProps: 'transform' });
      return;
    }

    const sliderTimeline = gsap.timeline({ repeat: -1, paused: true });

    slides.forEach((slide, index) => {
      const nextSlide = slides[(index + 1) % slides.length];
      const position = index * HOLD_DURATION;
      const transitionAt = position + HOLD_DURATION - TRANSITION_DURATION;

      sliderTimeline
        .to(slide, { scale: 1, duration: HOLD_DURATION, ease: 'none' }, position)
        .to(nextSlide, { opacity: 1, duration: TRANSITION_DURATION, ease: motionEase.inOut }, transitionAt)
        .fromTo(
          nextSlide,
          { scale: 1.08 },
          { scale: 1.04, duration: TRANSITION_DURATION, ease: 'none', immediateRender: false },
          transitionAt,
        )
        .to(slide, { opacity: 0, duration: TRANSITION_DURATION, ease: motionEase.inOut }, transitionAt);
    });

    if (parallaxLayer) {
      gsap.fromTo(
        parallaxLayer,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
    }

    ScrollTrigger.create({
      trigger: root,
      start: 'top 85%',
      once: true,
      onEnter: () => sliderTimeline.play(0),
    });
  }, { scope: frameRef, dependencies: [prefersReducedMotion] });

  return (
    <div
      ref={frameRef}
      className={['relative aspect-[16/10] w-full overflow-hidden bg-[#ebe7df] outline outline-1 -outline-offset-1 outline-[oklch(0_0_0_/_0.1)]', className].filter(Boolean).join(' ')}
    >
      <div data-image-parallax className="absolute inset-x-0 -inset-y-[6%]">
        {IMAGES.map((image, index) => (
          <img
            key={image}
            data-image-slide
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: index === 0 ? 1 : 0, objectPosition: getObjectPosition(image) }}
          />
        ))}
      </div>
    </div>
  );
}
