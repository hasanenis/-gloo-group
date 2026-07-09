import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionEase, usePrefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

type RevealMode = 'line' | 'block';

type RevealRecord = {
  element: HTMLElement;
  html: string;
  style: string | null;
  mode: RevealMode;
  tween: gsap.core.Tween | null;
};

const DEFAULT_START = 'top 88%';
const DEFAULT_LINE_DURATION = 1.12;
const DEFAULT_BLOCK_DURATION = 0.92;
const DEFAULT_LINE_STAGGER = 0.08;
const DEFAULT_LINE_Y_PERCENT = 112;
const DEFAULT_BLOCK_Y = 18;

function restoreRevealRecord(record: RevealRecord) {
  record.tween?.scrollTrigger?.kill();
  record.tween?.kill();

  record.element.innerHTML = record.html;

  if (record.style === null) {
    record.element.removeAttribute('style');
  } else {
    record.element.setAttribute('style', record.style);
  }
}

function splitElementIntoLines(element: HTMLElement): HTMLElement[] {
  const sourceText = (element.dataset.homeTextRevealText ?? element.textContent ?? '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!sourceText) return [];

  const words = sourceText.split(' ');
  const measureSpans: HTMLSpanElement[] = [];

  element.textContent = '';

  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.display = 'inline-block';
    span.style.position = 'relative';
    span.style.whiteSpace = 'pre';
    element.appendChild(span);
    measureSpans.push(span);

    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });

  const lines: string[][] = [];
  let currentTop: number | null = null;
  let currentLine: string[] = [];

  measureSpans.forEach((span) => {
    const top = span.offsetTop;
    if (currentTop === null || Math.abs(top - currentTop) > 2) {
      if (currentLine.length) lines.push(currentLine);
      currentLine = [span.textContent ?? ''];
      currentTop = top;
      return;
    }

    currentLine.push(span.textContent ?? '');
  });

  if (currentLine.length) {
    lines.push(currentLine);
  }

  element.textContent = '';

  const lineNodes: HTMLElement[] = [];
  lines.forEach((lineWords) => {
    const wrapper = document.createElement('span');
    wrapper.className = 'home-text-reveal-line-wrapper';
    wrapper.style.display = 'block';
    wrapper.style.overflow = 'hidden';

    const line = document.createElement('span');
    line.className = 'home-text-reveal-line';
    line.style.display = 'block';
    line.style.whiteSpace = 'nowrap';
    line.textContent = lineWords.join(' ');

    wrapper.appendChild(line);
    element.appendChild(wrapper);
    lineNodes.push(line);
  });

  return lineNodes;
}

function revealTarget(element: HTMLElement): RevealRecord | null {
  const mode = (element.dataset.homeTextRevealMode as RevealMode | undefined) ?? 'line';
  const start = element.dataset.homeTextRevealStart ?? DEFAULT_START;
  const delay = Number(element.dataset.homeTextRevealDelay ?? '0');
  const stagger = Number(
    element.dataset.homeTextRevealStagger ?? (mode === 'line' ? String(DEFAULT_LINE_STAGGER) : '0'),
  );
  const duration = Number(
    element.dataset.homeTextRevealDuration ?? (mode === 'line' ? String(DEFAULT_LINE_DURATION) : String(DEFAULT_BLOCK_DURATION)),
  );
  const html = element.innerHTML;
  const style = element.getAttribute('style');

  if (mode === 'line') {
    const lines = splitElementIntoLines(element);
    if (!lines.length) {
      return null;
    }

    gsap.set(lines, {
      yPercent: DEFAULT_LINE_Y_PERCENT,
      opacity: 0,
      force3D: true,
    });

    return {
      element,
      html,
      style,
      mode,
      tween: gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: motionEase.smooth,
        scrollTrigger: {
          trigger: element,
          start,
          once: true,
        },
      }),
    };
  }

  gsap.set(element, {
    y: DEFAULT_BLOCK_Y,
    opacity: 0,
    force3D: true,
  });

  return {
    element,
    html,
    style,
    mode,
    tween: gsap.to(element, {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: motionEase.smooth,
      scrollTrigger: {
        trigger: element,
        start,
        once: true,
      },
    }),
  };
}

export function useHomeTextReveal(
  rootRef: RefObject<HTMLElement | null>,
  dependencies: DependencyList = [],
) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targetSelector = '[data-home-text-reveal]';
    const targets = Array.from(root.querySelectorAll<HTMLElement>(targetSelector));
    if (!targets.length || prefersReducedMotion) return;

    const records: RevealRecord[] = [];
    let rebuildTimer = 0;
    let active = true;
    let lastWidth = root.getBoundingClientRect().width;

    const build = () => {
      if (!active || !root.isConnected) return;

      while (records.length) {
        const record = records.pop();
        if (record) restoreRevealRecord(record);
      }

      const nextTargets = Array.from(root.querySelectorAll<HTMLElement>(targetSelector));

      nextTargets.forEach((element) => {
        const record = revealTarget(element);
        if (record) {
          records.push(record);
        }
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    build();

    if (document.fonts?.status !== 'loaded') {
      void document.fonts.ready.then(() => {
        if (!active || !root.isConnected) return;
        build();
      });
    }

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver((entries) => {
        const nextWidth = entries[0]?.contentRect.width ?? root.getBoundingClientRect().width;
        if (Math.abs(nextWidth - lastWidth) < 1) return;

        lastWidth = nextWidth;
        window.clearTimeout(rebuildTimer);
        rebuildTimer = window.setTimeout(() => {
          if (!active) return;
          build();
        }, 140);
      });

      observer.observe(root);

      return () => {
        active = false;
        window.clearTimeout(rebuildTimer);
        observer.disconnect();

        while (records.length) {
          const record = records.pop();
          if (record) restoreRevealRecord(record);
        }

        ScrollTrigger.refresh();
      };
    }

    return () => {
      active = false;
      window.clearTimeout(rebuildTimer);

      while (records.length) {
        const record = records.pop();
        if (record) restoreRevealRecord(record);
      }

      ScrollTrigger.refresh();
    };
  }, [rootRef, prefersReducedMotion, ...dependencies]);
}
