import { RefObject, useLayoutEffect } from 'react';

interface AutoFitOptions {
  min?: number;
  max?: number;
  step?: number;
}

export function useAutoFitText(
  textRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  deps: unknown[],
  opts: AutoFitOptions = {}
) {
  const { min = 12, max = 40, step = 0.5 } = opts;

  useLayoutEffect(() => {
    const text = textRef.current;
    const container = containerRef.current;
    if (!text || !container) return;

    const fit = () => {
      let size = max;
      text.style.fontSize = `${size}px`;
      while (
        size > min &&
        (text.scrollHeight > container.clientHeight ||
          text.scrollWidth > container.clientWidth)
      ) {
        size -= step;
        text.style.fontSize = `${size}px`;
      }
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, deps);
}
