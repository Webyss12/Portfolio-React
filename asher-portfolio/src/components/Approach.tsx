import { useEffect, useRef } from 'react';
import { PERSONA } from '../data/content';
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery';
import { useInView } from '../hooks/useInView';
import { Artwork } from './Artwork';

// On hover over the statement, a research sheet trails the pointer (difference blend).
function useTrailingImage(enabled: boolean) {
  const areaRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const area = areaRef.current;
    const img = imgRef.current;
    if (!enabled || !area || !img) return;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, last = 0;
    let started = false;

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? now - last : 16;
      last = now;
      const k = 1 - Math.exp(-dt / 140);
      x += (tx - x) * k;
      y += (ty - y) * k;
      img.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(tick);
      else last = 0; // close enough: stop updating
    };
    const onMove = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!started) {
        x = tx;
        y = ty;
        started = true;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onEnter = () => img.setAttribute('data-show', 'true');
    const onLeave = () => {
      img.setAttribute('data-show', 'false');
      started = false;
    };

    area.addEventListener('pointermove', onMove, { passive: true });
    area.addEventListener('pointerenter', onEnter);
    area.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerenter', onEnter);
      area.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  return { areaRef, imgRef };
}

export function Approach() {
  const [ref, inView] = useInView<HTMLElement>(0.2);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const follow = fine && !reduced;
  const { areaRef, imgRef } = useTrailingImage(follow);

  return (
    <section
      id="about"
      ref={ref}
      tabIndex={-1}
      className="@container flex min-h-[900px] flex-col border-t border-line px-[3%] pb-16 pt-10 outline-none focus-visible:shadow-none min-[1441px]:min-h-[1050px] max-[1201px]:min-h-[820px] max-[561px]:min-h-0"
    >
      <p className="font-utility text-[18px]">// About</p>

      <h2
        ref={areaRef}
        className="relative mt-[65px] font-display text-[length:clamp(30px,6.7cqw,96px)] font-medium leading-[.98] tracking-[-.04em] max-[561px]:mt-[45px] max-[561px]:text-[length:clamp(30px,9cqw,47px)]"
      >
        {PERSONA.statement.map((line, i) => (
          <span key={line} className="-mb-[.08em] block overflow-hidden pb-[.08em]">
            <span
              className={`block transition-transform duration-[900ms] ease-out-quint motion-reduce:translate-y-0 motion-reduce:transition-none ${
                inView ? 'translate-y-0' : 'translate-y-[108%]'
              }`}
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              {line}
            </span>
          </span>
        ))}
        {follow && (
          <div
            ref={imgRef}
            aria-hidden="true"
            data-show="false"
            className="pointer-events-none absolute left-0 top-0 z-10 w-[280px] scale-[.94] opacity-0 mix-blend-difference transition-[opacity,scale] duration-300 ease-out-quint data-[show=true]:scale-100 data-[show=true]:opacity-100"
          >
            <Artwork name="statement" className="block h-auto w-full" />
          </div>
        )}
      </h2>

      {/* normal flow, never absolutely positioned over the statement */}
      <div className="mt-auto flex items-end justify-between gap-10 pt-20 max-[901px]:flex-col max-[901px]:items-start max-[901px]:gap-8">
        <p className="max-w-[420px] font-body text-[18px] leading-snug text-muted-3 max-[901px]:text-base">
          {PERSONA.intro}
        </p>
        <div>
          <p className="font-utility text-[14px] tracking-[.12em] text-muted">DISCIPLINES</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {PERSONA.disciplines.map((d) => (
              <li key={d} className="rounded-full border border-[#777] px-3.5 py-2.5 font-utility text-[14px] text-muted-2">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
