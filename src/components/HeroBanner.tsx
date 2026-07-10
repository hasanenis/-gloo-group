import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motionDuration, motionEase, usePrefersReducedMotion } from '../lib/motion';
import { heroSlides } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const HERO_VIDEO_URL = '/projects/Untitled%20Project.mp4';
const HERO_POSTER = heroSlides[0]?.image;
const HERO_LOOP_WORDS = ['Building', 'Crafting', 'Dreaming'];
const HERO_LOOP_SUFFIX = 'Futures';

function getHeroVideoParallaxRange(width = typeof window === 'undefined' ? 1280 : window.innerWidth) {
  if (width >= 1536) {
    return { from: -14, to: 14, scaleFrom: 1.14, scaleTo: 1.08 };
  }

  if (width >= 768) {
    return { from: -11, to: 11, scaleFrom: 1.12, scaleTo: 1.06 };
  }

  return { from: -8, to: 8, scaleFrom: 1.1, scaleTo: 1.04 };
}

export default function HeroBanner() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaParallaxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const posterReady = prefersReducedMotion;
  const heroTitle = `${HERO_LOOP_WORDS[0]} ${HERO_LOOP_SUFFIX}`;

  useEffect(() => {
    if (prefersReducedMotion) {
      setVideoReady(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Some mobile browsers only honour autoplay when `muted` is set as a
    // live property (not just the JSX attribute) before the first play()
    // call — cheap to re-assert defensively.
    video.muted = true;

    const tryPlay = () => {
      video.muted = true;
      void video.play().catch(() => {
        // Autoplay can be blocked on some browsers; muted playback usually succeeds.
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    // Backgrounded/hidden tabs can suspend the hero video at the browser
    // level without ever firing our `pause` handler in a way we requested —
    // it just sits frozen on the last frame. Resume it whenever the page
    // becomes visible again (covers tab-switching and route navigations
    // that briefly hide the document).
    const resumeIfNeeded = () => {
      if (document.visibilityState === 'visible' && video.paused) {
        tryPlay();
      }
    };

    document.addEventListener('visibilitychange', resumeIfNeeded);
    video.addEventListener('pause', resumeIfNeeded);

    // Some mobile browsers silently reject the very first autoplay attempt
    // (no error we can act on, it just never starts) and only allow
    // playback once tied to a genuine user gesture. Catch the first touch/
    // scroll/click anywhere on the page and nudge playback if it's still
    // sitting paused.
    const retryOnFirstGesture = () => {
      if (video.paused) tryPlay();
    };
    const gestureEvents: Array<keyof DocumentEventMap> = ['touchstart', 'pointerdown', 'scroll'];
    gestureEvents.forEach((eventName) =>
      document.addEventListener(eventName, retryOnFirstGesture, { once: true, passive: true }),
    );

    return () => {
      video.removeEventListener('canplay', tryPlay);
      document.removeEventListener('visibilitychange', resumeIfNeeded);
      video.removeEventListener('pause', resumeIfNeeded);
      gestureEvents.forEach((eventName) =>
        document.removeEventListener(eventName, retryOnFirstGesture),
      );
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Safety net: the GSAP intro tween that fades the headline in can be
    // killed before it ever renders a frame (React StrictMode's mount→
    // cleanup→remount reverts it mid-flight; a backgrounded tab can also
    // starve GSAP's rAF ticker). If that happens the headline is left
    // stuck at opacity 0 forever, so force it visible shortly after mount
    // regardless of what happened to the animation.
    const revealFallback = window.setTimeout(() => {
      const el = textRef.current;
      if (el && getComputedStyle(el).opacity === '0') {
        gsap.set(el, { opacity: 1, y: 0 });
      }
    }, 1800);

    return () => window.clearTimeout(revealFallback);
  }, [prefersReducedMotion]);

  useGSAP(() => {
    const loopWords = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>('[data-hero-loop-word]') ?? [],
    );

    if (prefersReducedMotion) {
      gsap.set('.hero-loop-title', { clearProps: 'all', opacity: 1, y: 0 });
      gsap.set(loopWords, {
        clearProps: 'transform,filter,clipPath',
        autoAlpha: 0,
      });
      gsap.set(loopWords[0], {
        autoAlpha: 1,
        yPercent: 0,
      });
      if (mediaParallaxRef.current) {
        gsap.set(mediaParallaxRef.current, { clearProps: 'transform' });
      }
      if (videoRef.current) {
        gsap.set(videoRef.current, { clearProps: 'opacity,transform' });
      }
      return;
    }

    gsap.set('.hero-loop-mask', {
      perspective: 900,
      transformStyle: 'preserve-3d',
    });
    gsap.set(loopWords, {
      yPercent: -108,
      autoAlpha: 0,
      filter: 'blur(12px)',
      rotateX: -7,
      scale: 0.985,
      transformOrigin: '50% 50%',
    });
    gsap.set(loopWords[0], {
      yPercent: 0,
      autoAlpha: 1,
      filter: 'blur(0px)',
      rotateX: 0,
      scale: 1,
    });

    if (mediaParallaxRef.current) {
      const parallaxRange = getHeroVideoParallaxRange();

      gsap.fromTo(
        mediaParallaxRef.current,
        {
          yPercent: parallaxRange.from,
          scale: parallaxRange.scaleFrom,
          transformOrigin: '50% 50%',
          force3D: true,
        },
        {
          yPercent: parallaxRange.to,
          scale: parallaxRange.scaleTo,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        },
      );
    }

    const introTl = gsap.timeline({ defaults: { ease: motionEase.smooth } });

    if (textRef.current) {
      introTl.fromTo(
        textRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: motionDuration.hero },
        0.18,
      );
    }

    if (loopWords.length < 2) return;

    const loopTl = gsap.timeline({
      repeat: -1,
      delay: 1.05,
      defaults: { duration: 1.12, ease: 'expo.inOut' },
    });

    loopWords.forEach((word, index) => {
      const nextWord = loopWords[(index + 1) % loopWords.length];

      loopTl
        .to(
          word,
          {
            yPercent: 108,
            autoAlpha: 0,
            filter: 'blur(10px)',
            rotateX: 7,
            scale: 0.992,
          },
          '+=1.75',
        )
        .fromTo(
          nextWord,
          {
            yPercent: -108,
            autoAlpha: 0,
            filter: 'blur(12px)',
            rotateX: -7,
            scale: 0.985,
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            rotateX: 0,
            scale: 1,
            // Without this, fromTo's default immediateRender fires the
            // moment the timeline is built (not when it plays). Since the
            // last word wraps to loopWords[0], that eagerly re-hides the
            // word the initial gsap.set() had just made visible.
            immediateRender: false,
          },
          '<',
        );
    });
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-x-clip ${prefersReducedMotion ? 'min-h-[100svh]' : 'min-h-[104svh] md:min-h-[106svh] lg:min-h-[108svh]'}`}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-zinc-900">
        <div
          ref={mediaParallaxRef}
          className="pointer-events-none absolute inset-x-0 -inset-y-[10%] will-change-transform md:-inset-y-[12%] lg:-inset-y-[14%]"
          aria-hidden="true"
        >
          {posterReady ? (
            <img
              src={HERO_POSTER}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[66%_50%] sm:object-center"
            />
          ) : (
            <video
              ref={videoRef}
              className={`hero-media-kenburns absolute inset-0 h-full w-full object-cover object-[66%_50%] transition-opacity duration-700 sm:object-center ${videoReady ? 'opacity-100' : 'opacity-0'}`}
              src={HERO_VIDEO_URL}
              poster={HERO_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoReady(true)}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 bg-[radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.84)_22%,rgba(0,0,0,0.28)_54%,rgba(0,0,0,0)_78%)] md:h-32 md:w-32"
        />

        <div className="relative z-20 flex h-[100svh] w-full items-center justify-center px-4 py-28 text-center">
          <h1
            ref={textRef}
            aria-label={heroTitle}
            className="hero-loop-title inline-flex max-w-[calc(100vw-2rem)] items-center justify-center gap-x-[0.18em] font-nav text-[clamp(2.28rem,0.8rem+7.4vw,3.75rem)] font-light leading-none tracking-normal text-white sm:text-[5rem] md:text-[7.25rem] lg:text-[8.75rem] xl:text-[9.5rem] 2xl:text-[10rem]"
          >
            <span
              className="hero-loop-mask relative inline-block h-[1.06em] min-w-[4.22em] overflow-hidden align-baseline"
              aria-hidden="true"
            >
              {HERO_LOOP_WORDS.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="absolute inset-x-0 top-0 block whitespace-nowrap text-center will-change-[transform,opacity,filter,clip-path]"
                  data-hero-loop-word
                  style={{
                    opacity: index === 0 ? 1 : 0,
                    visibility: index === 0 ? 'visible' : 'hidden',
                  }}
                >
                  {word}
                </span>
              ))}
            </span>
            <span className="inline-block shrink-0" aria-hidden="true">
              {HERO_LOOP_SUFFIX}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
