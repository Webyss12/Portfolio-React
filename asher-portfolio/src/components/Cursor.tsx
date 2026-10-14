import { useEffect, useRef, useState } from 'react';
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery';

// 20px follower ring, which becomes a 100px "View case study" bubble over the featured card.
export function Cursor({ projectMode }: { projectMode: boolean }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
      setVisible(true);
      document.documentElement.dataset.customCursor = 'true'; // hide the system cursor only now that this works
    };
    const hide = () => setVisible(false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      delete document.documentElement.dataset.customCursor;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[300]">
      <div
        className={`absolute left-0 top-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white/20 transition-opacity duration-200 ${
          visible && !projectMode ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute left-0 top-0 flex size-[100px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-center font-utility text-[13px] leading-tight text-black transition-[opacity,scale] duration-300 ease-out-quint ${
          visible && projectMode ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <span>
          View
          <br />
          case study.
        </span>
      </div>
    </div>
  );
}
