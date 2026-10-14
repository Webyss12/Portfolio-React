import { useEffect, useState, type RefObject } from 'react';

// Live version of "is this element on screen right now?"
export function useOnScreen(ref: RefObject<Element | null>) {
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return onScreen;
}
