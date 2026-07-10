/**
 * Global "auto-fit" for translated text.
 *
 * Translations (FR/TR/AR) routinely run 20-35% longer than the English the
 * layout was designed around. When a text element can no longer fit its box
 * horizontally (uppercase tracked labels, display headings, nowrap lines,
 * single unbreakable words), we progressively reduce that element's
 * font-size until it fits, instead of letting it overflow or clip.
 *
 * How it stays cheap and safe:
 * - Only elements that actually carry text (direct text nodes, or exclusively
 *   inline children) are considered — structural wrappers, parallax frames,
 *   carousels and media boxes are never touched.
 * - Detection is a read-only pass (one layout), shrinking then only runs on
 *   the handful of elements that genuinely overflow.
 * - We only react to childList/characterData mutations (text/DOM changes,
 *   e.g. locale switches and route changes) — style/attribute churn from
 *   GSAP animations does not re-trigger fitting.
 * - Every pass first restores the previous inline font-size, so responsive
 *   `clamp()` sizes keep working across viewport resizes and locale flips.
 *
 * Opt-out: add `data-autofit-skip` to an element to exclude its subtree.
 */

const TOLERANCE_PX = 1.5;
const MIN_SCALE = 0.62;
const SHRINK_STEP = 0.94;
const MAX_ITERATIONS = 14;
const DEBOUNCE_MS = 280;

const INLINE_TAGS = new Set([
  'SPAN', 'A', 'STRONG', 'EM', 'B', 'I', 'U', 'SMALL', 'SUP', 'SUB', 'BR',
  'ABBR', 'TIME', 'MARK', 'CODE', 'WBR',
]);

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'IFRAME', 'CANVAS', 'VIDEO',
  'AUDIO', 'IMG', 'SVG', 'PATH', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION',
]);

function hasDirectText(element: Element): boolean {
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) return true;
  }
  return false;
}

/** Text-bearing leaf-ish elements: direct text, or only inline children. */
function isTextCandidate(element: HTMLElement): boolean {
  if (SKIP_TAGS.has(element.tagName)) return false;
  if (hasDirectText(element)) return true;

  const children = element.children;
  if (!children.length) return false;
  for (const child of children) {
    if (!INLINE_TAGS.has(child.tagName)) return false;
  }
  return Boolean(element.textContent?.trim());
}

function restorePreviousSize(element: HTMLElement) {
  element.style.fontSize = element.dataset.autofitPrev ?? '';
  delete element.dataset.autofit;
  delete element.dataset.autofitPrev;
}

function shrinkToFit(element: HTMLElement) {
  const computed = getComputedStyle(element);
  // Intentional scrollers manage their own overflow.
  if (computed.overflowX === 'auto' || computed.overflowX === 'scroll') return;

  const basePx = parseFloat(computed.fontSize);
  if (!basePx || Number.isNaN(basePx)) return;

  const previousInline = element.style.fontSize;
  const minPx = basePx * MIN_SCALE;
  let size = basePx;
  let iterations = 0;
  let touched = false;

  while (
    element.scrollWidth - element.clientWidth > TOLERANCE_PX &&
    size > minPx &&
    iterations < MAX_ITERATIONS
  ) {
    size = Math.max(minPx, size * SHRINK_STEP);
    if (!touched) {
      // A later convergence round may shrink an already-fitted element
      // further — keep the original pre-fit inline value, not round 1's px.
      if (!element.dataset.autofit) {
        element.dataset.autofitPrev = previousInline;
        element.dataset.autofit = '1';
      }
      touched = true;
    }
    element.style.fontSize = `${size.toFixed(2)}px`;
    iterations += 1;
  }
}

function collectOverflowing(root: HTMLElement): HTMLElement[] {
  const overflowing: HTMLElement[] = [];
  const all = root.querySelectorAll<HTMLElement>('*');
  for (const element of all) {
    if (element.closest('[data-autofit-skip]')) continue;
    if (!isTextCandidate(element)) continue;
    if (!element.clientWidth) continue;
    if (element.scrollWidth - element.clientWidth > TOLERANCE_PX) {
      overflowing.push(element);
    }
  }
  return overflowing;
}

function runFitPass(root: HTMLElement) {
  // Phase A: undo previous fits so measurements start from CSS-driven sizes
  // (keeps clamp()/media-query sizing honest after resizes and re-renders).
  root.querySelectorAll<HTMLElement>('[data-autofit]').forEach(restorePreviousSize);

  // Shrinking one element can change em-based sibling/ancestor geometry, so
  // run detect→shrink rounds until the page settles (bounded, usually 1).
  for (let round = 0; round < 3; round += 1) {
    // Phase B: read-only sweep collecting genuinely overflowing text elements.
    const overflowing = collectOverflowing(root);
    if (!overflowing.length) break;

    // Phase C: shrink just the overflowing handful, deepest elements first —
    // fixing a child often resolves its ancestors for free.
    for (let index = overflowing.length - 1; index >= 0; index -= 1) {
      const element = overflowing[index];
      if (element.scrollWidth - element.clientWidth <= TOLERANCE_PX) continue;
      shrinkToFit(element);
    }
  }
}

/**
 * Installs the global auto-fit behaviour. Returns a cleanup function.
 * Re-runs (debounced) on DOM/text mutations, viewport resizes and once
 * webfonts finish loading.
 */
export function initAutoFitText(): () => void {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }

  let timer = 0;
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => runFitPass(document.body), DEBOUNCE_MS);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  window.addEventListener('resize', schedule);
  document.fonts?.ready.then(schedule).catch(() => undefined);
  schedule();

  return () => {
    window.clearTimeout(timer);
    observer.disconnect();
    window.removeEventListener('resize', schedule);
  };
}
