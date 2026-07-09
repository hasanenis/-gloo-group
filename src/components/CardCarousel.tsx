import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import gsap from 'gsap';
import { motionDuration, usePrefersReducedMotion } from '../lib/motion';
import 'swiper/css';

export type CardCarouselState = {
  prev: () => void;
  next: () => void;
  canPrev: boolean;
  canNext: boolean;
  activeIndex: number;
  count: number;
  progress: number;
};

type CardCarouselProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  ariaLabel: string;
  spaceBetween?: number;
  slideClassName?: string;
  trackClassName?: string;
  controls?: (state: CardCarouselState) => ReactNode;
};

/**
 * Button-driven card carousel — replaces scroll-hijacking horizontal panning
 * with an explicit prev/next interaction (plus native drag/touch via Swiper).
 * Shared by the home page's featured-projects strip and a project detail
 * page's related-projects rail so both browse the same way.
 */
export default function CardCarousel<T>({
  items,
  renderItem,
  getKey,
  ariaLabel,
  spaceBetween = 24,
  slideClassName = '',
  trackClassName = '',
  controls,
}: CardCarouselProps<T>) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState({ activeIndex: 0, canPrev: false, canNext: items.length > 1, progress: 0 });

  const sync = (swiper: SwiperInstance) => {
    setState({
      activeIndex: swiper.activeIndex,
      canPrev: !swiper.isBeginning,
      canNext: !swiper.isEnd,
      progress: Number.isFinite(swiper.progress) ? Math.min(1, Math.max(0, swiper.progress)) : 0,
    });
  };

  const carouselState: CardCarouselState = {
    prev: () => swiperRef.current?.slidePrev(prefersReducedMotion ? 0 : motionDuration.hover * 1000),
    next: () => swiperRef.current?.slideNext(prefersReducedMotion ? 0 : motionDuration.hover * 1000),
    canPrev: state.canPrev,
    canNext: state.canNext,
    activeIndex: state.activeIndex,
    count: items.length,
    progress: state.progress,
  };

  return (
    <div role="group" aria-label={ariaLabel}>
      <Swiper
        modules={[A11y, Keyboard]}
        slidesPerView="auto"
        spaceBetween={spaceBetween}
        keyboard={{ enabled: true }}
        watchOverflow
        className={trackClassName}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          sync(swiper);
        }}
        onSlideChange={sync}
        onProgress={sync}
        onReachBeginning={sync}
        onReachEnd={sync}
        onFromEdge={sync}
        onTouchEnd={sync}
        onTransitionEnd={sync}
      >
        {items.map((item, index) => (
          <SwiperSlide key={getKey(item, index)} className={slideClassName}>
            {renderItem(item, index)}
          </SwiperSlide>
        ))}
      </Swiper>
      {controls?.(carouselState)}
    </div>
  );
}

export function CarouselProgressBar({
  progress,
  className = '',
  barClassName = 'bg-[#c22026]',
}: {
  progress: number;
  className?: string;
  barClassName?: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!barRef.current) return;
    if (prefersReducedMotion) {
      barRef.current.style.transform = `scaleX(${Math.max(0.03, progress)})`;
      return;
    }

    gsap.to(barRef.current, {
      scaleX: Math.max(0.03, progress),
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [prefersReducedMotion, progress]);

  return (
    <div className={`relative h-px overflow-hidden ${className}`}>
      <div ref={barRef} className={`absolute inset-y-0 left-0 w-full origin-left scale-x-0 ${barClassName}`} />
    </div>
  );
}
