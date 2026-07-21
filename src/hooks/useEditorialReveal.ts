import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { usePrefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger, SplitText);

type EditorialRevealRole = 'display' | 'heading' | 'copy' | 'label' | 'stat' | 'panel' | 'action';
type EditorialGroupRole = 'copy' | 'stats' | 'steps' | 'cards' | 'columns';

const ROLE_START: Record<EditorialRevealRole, string> = {
  display: 'top 84%',
  heading: 'top 87%',
  copy: 'top 89%',
  label: 'top 91%',
  stat: 'top 90%',
  panel: 'top 88%',
  action: 'top 91%',
};

function numericData(element: HTMLElement, key: string, fallback = 0) {
  const value = Number(element.dataset[key]);
  return Number.isFinite(value) ? value : fallback;
}

function logicalOrigin() {
  return document.documentElement.dir === 'rtl' ? 'right bottom' : 'left bottom';
}

function revealSplitText(
  element: HTMLElement,
  role: 'display' | 'heading',
  splits: SplitText[],
) {
  const start = element.dataset.editorialRevealStart ?? ROLE_START[role];
  const delay = numericData(element, 'editorialRevealDelay');
  const isDisplay = role === 'display';

  const split = SplitText.create(element, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    aria: 'auto',
    linesClass: `editorial-reveal-${role}-line`,
    onSplit(self) {
      return gsap.fromTo(
        self.lines,
        {
          yPercent: isDisplay ? 108 : 92,
          autoAlpha: 0,
          rotateX: isDisplay ? -2.5 : 0,
          transformOrigin: logicalOrigin(),
          force3D: true,
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: isDisplay ? 1.06 : 0.82,
          delay,
          stagger: isDisplay ? 0.09 : 0.065,
          ease: isDisplay ? 'power4.out' : 'power3.out',
          scrollTrigger: {
            trigger: element,
            start,
            once: true,
          },
        },
      );
    },
  });

  splits.push(split);
}

function revealElement(element: HTMLElement, role: Exclude<EditorialRevealRole, 'display' | 'heading'>) {
  const start = element.dataset.editorialRevealStart ?? ROLE_START[role];
  const delay = numericData(element, 'editorialRevealDelay');
  const rtlDirection = document.documentElement.dir === 'rtl' ? 1 : -1;

  if (role === 'label') {
    return gsap.fromTo(
      element,
      { x: 14 * rtlDirection, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.52,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start, once: true },
      },
    );
  }

  if (role === 'copy') {
    return gsap.fromTo(
      element,
      { y: 14, autoAlpha: 0, filter: 'blur(2px)' },
      {
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start, once: true },
      },
    );
  }

  if (role === 'stat') {
    return gsap.fromTo(
      element,
      { y: 18, scale: 0.96, autoAlpha: 0, transformOrigin: logicalOrigin() },
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.72,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start, once: true },
      },
    );
  }

  if (role === 'panel') {
    return gsap.fromTo(
      element,
      { y: 24, autoAlpha: 0, clipPath: 'inset(7% 0 0 0)' },
      {
        y: 0,
        autoAlpha: 1,
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.88,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start, once: true },
      },
    );
  }

  return gsap.fromTo(
    element,
    { y: 10, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.58,
      delay,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start, once: true },
    },
  );
}

function groupMotion(role: EditorialGroupRole) {
  if (role === 'stats') {
    return {
      from: { y: 18, scale: 0.965, autoAlpha: 0 },
      to: { y: 0, scale: 1, autoAlpha: 1, duration: 0.72, ease: 'power3.out' },
    };
  }

  if (role === 'steps' || role === 'cards') {
    return {
      from: { y: role === 'steps' ? 30 : 24, autoAlpha: 0 },
      to: { y: 0, autoAlpha: 1, duration: 0.78, ease: 'power3.out' },
    };
  }

  if (role === 'columns') {
    return {
      from: { y: 18, autoAlpha: 0 },
      to: { y: 0, autoAlpha: 1, duration: 0.68, ease: 'power3.out' },
    };
  }

  return {
    from: { y: 12, autoAlpha: 0, filter: 'blur(2px)' },
    to: { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
  };
}

function revealGroup(group: HTMLElement) {
  const role = (group.dataset.editorialRevealGroup ?? 'cards') as EditorialGroupRole;
  const items = Array.from(group.querySelectorAll<HTMLElement>(':scope > [data-editorial-reveal-item]'));
  if (items.length === 0) return;

  const motion = groupMotion(role);

  gsap.set(items, motion.from);
  ScrollTrigger.batch(items, {
    start: group.dataset.editorialRevealStart ?? 'top 90%',
    once: true,
    interval: 0.08,
    batchMax: role === 'copy' ? 2 : 4,
    onEnter(batch) {
      gsap.to(batch, {
        ...motion.to,
        stagger: role === 'copy' ? 0.055 : 0.075,
        overwrite: 'auto',
      });
    },
  });
}

export function useEditorialReveal(
  rootRef: RefObject<HTMLElement | null>,
  dependencies: DependencyList = [],
) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return;

    const splits: SplitText[] = [];
    const context = gsap.context(() => {
      const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-editorial-reveal]'));
      const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-editorial-reveal-group]'));

      targets.forEach((element) => {
        const role = (element.dataset.editorialReveal ?? 'copy') as EditorialRevealRole;
        if (role === 'display' || role === 'heading') {
          revealSplitText(element, role, splits);
        } else {
          revealElement(element, role);
        }
      });

      groups.forEach(revealGroup);
    }, root);

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refresh);
      context.revert();
      splits.forEach((split) => split.revert());
      ScrollTrigger.refresh();
    };
  }, [rootRef, prefersReducedMotion, ...dependencies]);
}
