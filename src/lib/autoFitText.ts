/** Keep translated text in its existing boxes without rescanning the full
 * document after every render or forcing repeated layout per overflowing item. */
const TOLERANCE_PX = 1.5;
const MIN_SCALE = 0.62;
const DEBOUNCE_MS = 90;
const INLINE_TAGS = new Set(['SPAN', 'A', 'STRONG', 'EM', 'B', 'I', 'U', 'SMALL', 'SUP', 'SUB', 'BR', 'ABBR', 'TIME', 'MARK', 'CODE', 'WBR']);
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'IFRAME', 'CANVAS', 'VIDEO', 'AUDIO', 'IMG', 'SVG', 'PATH', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION']);

function hasDirectText(element: Element) {
  return Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
}

function isTextCandidate(element: HTMLElement) {
  if (SKIP_TAGS.has(element.tagName) || element.closest('[data-autofit-skip]')) return false;
  if (hasDirectText(element)) return true;
  return element.children.length > 0 && Array.from(element.children).every((child) => INLINE_TAGS.has(child.tagName)) && Boolean(element.textContent?.trim());
}

function restore(element: HTMLElement) {
  if (element.dataset.autofit !== '1') return;
  element.style.fontSize = element.dataset.autofitPrev ?? '';
  delete element.dataset.autofit;
  delete element.dataset.autofitPrev;
}

function addCandidates(root: Element, into: Set<HTMLElement>) {
  if (root instanceof HTMLElement && isTextCandidate(root)) into.add(root);
  root.querySelectorAll<HTMLElement>('*').forEach((element) => {
    if (isTextCandidate(element)) into.add(element);
  });
}

function fit(roots: Iterable<HTMLElement>, full = false) {
  const candidates = new Set<HTMLElement>();
  if (full) addCandidates(document.body, candidates);
  else for (const root of roots) addCandidates(root, candidates);
  const connected = [...candidates].filter((element) => element.isConnected && element.clientWidth > 0);

  // Batch all writes before measuring text in the next animation frame.
  connected.forEach(restore);
  requestAnimationFrame(() => {
    const writes: Array<{ element: HTMLElement; value: string }> = [];
    connected.forEach((element) => {
      const style = getComputedStyle(element);
      if (style.overflowX === 'auto' || style.overflowX === 'scroll') return;
      const width = element.clientWidth;
      const contentWidth = element.scrollWidth;
      const base = Number.parseFloat(style.fontSize);
      if (!base || contentWidth - width <= TOLERANCE_PX) return;
      const size = Math.max(base * MIN_SCALE, base * width / contentWidth * 0.995);
      if (size < base - 0.1) writes.push({ element, value: `${size.toFixed(2)}px` });
    });
    writes.forEach(({ element, value }) => {
      element.dataset.autofitPrev = element.style.fontSize;
      element.dataset.autofit = '1';
      element.style.fontSize = value;
    });
  });
}

export function initAutoFitText(): () => void {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return () => {};
  let timer = 0;
  let frame = 0;
  let initial = true;
  const roots = new Set<HTMLElement>();

  const schedule = (full = false) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        fit(roots, full || initial);
        initial = false;
        roots.clear();
      });
    }, DEBOUNCE_MS);
  };

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      const target = record.target instanceof HTMLElement ? record.target : record.target.parentElement;
      if (!target || target.closest('[data-autofit-skip]')) return;
      roots.add(target);
      let parent = target.parentElement;
      while (parent && parent !== document.body && INLINE_TAGS.has(parent.tagName)) {
        roots.add(parent);
        parent = parent.parentElement;
      }
      record.addedNodes.forEach((node) => { if (node instanceof HTMLElement) roots.add(node); });
    });
    schedule();
  });
  observer.observe(document.body, { childList: true, characterData: true, subtree: true });
  const onResize = () => schedule(true);
  window.addEventListener('resize', onResize, { passive: true });
  document.fonts?.ready.then(() => schedule(true)).catch(() => undefined);
  schedule(true);

  return () => {
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('resize', onResize);
  };
}
