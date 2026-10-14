import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { ImageStatus } from './useImageStatus';

export type Phase = 'idle' | 'playing' | 'done';

const TOTAL_MS = 2800; // longest animation (CTA at 2.075s + 0.5s) plus a little slack
const MAX_WAIT_MS = 1800; // never keep the visitor waiting longer than this for the portrait/fonts

/**
 * Drives the monogram / name entrance.
 *  idle    -> letters are hidden
 *  playing -> animation classes are on
 *  done    -> classes removed, everything visible
 * Plays on load, then again when the hero fully leaves the screen and comes back (20% visible).
 */
export function useHeroSequence(
  heroRef: RefObject<HTMLElement | null>,
  imageStatus: ImageStatus,
  onFirstStart?: () => void,
) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [fontsReady, setFontsReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const started = useRef(false);
  const doneTimer = useRef(0);
  const onFirstStartRef = useRef(onFirstStart);
  useEffect(() => {
    onFirstStartRef.current = onFirstStart;
  });

  // Wait for fonts, but give up after MAX_WAIT_MS.
  useEffect(() => {
    let alive = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => alive && setFontsReady(true));
    const t = window.setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, []);

  const play = useCallback(() => {
    window.clearTimeout(doneTimer.current);
    setPhase('idle');
    // two frames so the browser really paints the hidden state before restarting
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setPhase('playing');
        doneTimer.current = window.setTimeout(() => setPhase('done'), TOTAL_MS);
      }),
    );
  }, []);

  // First play
  const ready = timedOut || (fontsReady && imageStatus !== 'loading');
  useEffect(() => {
    if (!ready || started.current) return;
    started.current = true;
    const id = requestAnimationFrame(() => {
      play();
      onFirstStartRef.current?.();
    });
    return () => cancelAnimationFrame(id);
  }, [ready, play]);

  // Replay after the hero has fully left the viewport
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let hasLeft = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          hasLeft = true;
          return;
        }
        const needed = Math.min(entry.boundingClientRect.height, window.innerHeight) * 0.2;
        if (hasLeft && started.current && entry.intersectionRect.height >= needed) {
          hasLeft = false;
          play();
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [heroRef, play]);

  useEffect(() => () => window.clearTimeout(doneTimer.current), []);

  return phase;
}
