import { useEffect, useRef, type RefObject } from 'react';
import { createHeroGL } from '../lib/heroGL';

interface HeroGLProps {
  src: string;
  heroRef: RefObject<HTMLElement | null>;
  ready: boolean;
  onReady: (ready: boolean) => void;
}

// Transparent canvas over the CSS portrait. It fades in only after the first real frame was drawn.
export function HeroGL({ src, heroRef, ready, onReady }: HeroGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const destroy = createHeroGL({ canvas, hero, src, onReady });
    return () => {
      destroy();
      onReady(false);
    };
  }, [src, heroRef, onReady]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 size-full transition-opacity duration-[450ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
