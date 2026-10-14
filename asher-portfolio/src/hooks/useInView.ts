import { useEffect, useRef, useState } from 'react';

// Returns [ref, inView]. inView turns true once the element is `threshold` visible and stays true.
export function useInView<T extends Element>(threshold: number) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        // On very tall sections a phone may never show `threshold` of the whole thing,
        // so also accept "a big part of the screen is filled by it".
        const fillsScreen = entry.intersectionRect.height >= window.innerHeight * 0.6;
        if (entry.isIntersecting && (entry.intersectionRatio >= threshold || fillsScreen)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: [0, threshold / 2, threshold, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}
