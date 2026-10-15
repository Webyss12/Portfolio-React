import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ASSETS, PERSONA } from '../data/content';
import { useFinePointer, useMediaQuery, useReducedMotion } from '../hooks/useMediaQuery';
import { useHeroSequence, type Phase } from '../hooks/useHeroSequence';
import { useImageStatus } from '../hooks/useImageStatus';
import { useOnScreen } from '../hooks/useOnScreen';
import { usePageVisible } from '../hooks/usePageVisible';
import { HeroGL } from './HeroGL';
import { Pill } from './Pill';

// While the sequence is idle things are hidden; while playing they animate; afterwards they are plain.
// (Reduced motion is handled in CSS with motion-reduce:, so it also reacts to live changes.)
function appear(phase: Phase, kind: 'fade' | 'rise', delay: number) {
  if (phase === 'idle') return { cls: 'opacity-0 motion-reduce:opacity-100', style: undefined };
  if (phase === 'done') return { cls: '', style: undefined };
  return {
    cls: kind === 'fade' ? 'animate-fade-in motion-reduce:animate-none' : 'animate-rise-in motion-reduce:animate-none',
    style: { animationDelay: `${delay}s` },
  };
}

function Letter({ ch, delay, phase }: { ch: string; delay: number; phase: Phase }) {
  const cls =
    phase === 'idle'
      ? 'opacity-0 motion-reduce:opacity-100'
      : phase === 'playing'
        ? 'animate-letter-in motion-reduce:animate-none'
        : '';
  return (
    <span className={`inline-block ${cls}`} style={phase === 'playing' ? { animationDelay: `${delay}s` } : undefined}>
      {ch}
    </span>
  );
}

interface HeroProps {
  modalOpen: boolean;
  onIntroStart: () => void;
}

export function Hero({ modalOpen, onIntroStart }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const wide = useMediaQuery('(min-width: 902px)');
  const pageVisible = usePageVisible();
  const onScreen = useOnScreen(heroRef);

  const heroSrc = ASSETS.hero;
  const image = useImageStatus(heroSrc);
  const phase = useHeroSequence(heroRef, image.status, onIntroStart);
  const [glReady, setGlReady] = useState(false);

  const glEnabled = wide && fine && !reduced && image.status === 'ready';
  const bouncing = onScreen && pageVisible && !modalOpen;

  // Scroll parallax: scale 1 + p * .2 and shift p * -7%, on the portrait layers only.
  useEffect(() => {
    const layer = parallaxRef.current;
    const hero = heroRef.current;
    if (!layer || !hero) return;
    if (reduced) {
      layer.style.setProperty('--p', '0');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = hero.getBoundingClientRect();
      const p = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      layer.style.setProperty('--p', String(p));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [reduced]);

  // Reset the face zoom and glow when the window loses focus, a menu/dialog opens, or motion is reduced.
  useEffect(() => {
    const reset = () => {
      zoomRef.current?.setAttribute('data-zoom', 'false');
      glowRef.current?.style.setProperty('--ga', '0');
    };
    if (modalOpen || reduced) reset();
    window.addEventListener('blur', reset);
    return () => window.removeEventListener('blur', reset);
  }, [modalOpen, reduced]);

  // Zoom only while the pointer is over the face (x .40-.79, y .075-.86 of the cover-cropped image).
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (!fine || !wide || reduced || modalOpen || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();

    if (image.status === 'ready') {
      const scale = Math.max(rect.width / image.width, rect.height / image.height);
      const w = image.width * scale;
      const h = image.height * scale;
      const nx = (e.clientX - rect.left - (rect.width - w) / 2) / w;
      const ny = (e.clientY - rect.top - (rect.height - h) / 2) / h;
      const overControl = (e.target as Element).closest('a, button');
      const inFace = !overControl && nx >= 0.4 && nx <= 0.79 && ny >= 0.075 && ny <= 0.86;
      zoomRef.current?.setAttribute('data-zoom', String(inFace));
    }

    const glow = glowRef.current;
    if (glow) {
      glow.style.setProperty('--gx', `${e.clientX - rect.left}px`);
      glow.style.setProperty('--gy', `${e.clientY - rect.top}px`);
      glow.style.setProperty('--ga', '1');
    }
  };

  const onPointerLeave = () => {
    zoomRef.current?.setAttribute('data-zoom', 'false');
    glowRef.current?.style.setProperty('--ga', '0');
  };

  const goToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const about = document.getElementById('about');
    about?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    about?.focus({ preventScroll: true });
  };

  const { monogram, firstName, lastName } = PERSONA;
  const totalLetters = monogram.length + firstName.length + lastName.length;
  const step = totalLetters > 1 ? Math.min(0.1, 0.9 / (totalLetters - 1)) : 0.1; // longer names animate a bit faster
  const delayFor = (i: number) => 0.38 + i * step;
  const role = appear(phase, 'fade', 1.18);
  const sup = appear(phase, 'fade', 1.48);
  const notes = appear(phase, 'rise', 1.55);
  const cta = appear(phase, 'rise', 2.075);

  return (
    <section
      id="top"
      ref={heroRef}
      tabIndex={-1}
      aria-label="Introduction"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="@container relative h-[900px] bg-black outline-none focus-visible:shadow-none min-[1441px]:h-[min(1100px,100svh)] max-[901px]:h-svh max-[901px]:min-h-[760px] max-[561px]:h-auto max-[561px]:min-h-[max(720px,100svh)]"
    >
      {/* z-0: portrait + WebGL canvas. Outer layer = scroll parallax, inner layer = face-hover zoom. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-hidden bg-black max-[901px]:top-[40%] max-[901px]:[-webkit-mask-image:linear-gradient(180deg,transparent_0,#000_22%)] max-[901px]:[mask-image:linear-gradient(180deg,transparent_0,#000_22%)]"
      >
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
          style={{
            transform:
              "translateY(calc(var(--p, 0) * -7%)) scale(calc(1 + var(--p, 0) * .2))",
          }}
        >
          <div
            ref={zoomRef}
            data-zoom="false"
            className="absolute inset-0 transition-transform duration-700 ease-out-quint data-[zoom=true]:scale-[1.035] motion-reduce:transition-none"
          >
            {image.status === "error" && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_42%,#2b2b2b_0%,#0d0d0d_55%,#000_100%)]" />
            )}
            {image.status === "ready" && heroSrc && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${heroSrc}")` }}
              />
            )}
            {glEnabled && heroSrc && (
              <HeroGL
                src={heroSrc}
                heroRef={heroRef}
                ready={glReady}
                onReady={setGlReady}
              />
            )}
            {/* Fallback glow that follows the pointer when WebGL is not running */}
               {wide && fine && !reduced && !glReady && (
              <div
                ref={glowRef}
                className="pointer-events-none absolute inset-0 opacity-[var(--ga,0)] transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(circle 320px at var(--gx, 50%) var(--gy, 50%), rgba(255,99,15,.18), transparent 70%)",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* z-1: darkening overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,.5)_0%,transparent_35%,transparent_65%,rgba(0,0,0,.5)_100%)]"
      />

      {/* z-2: typography and controls */}
      <div className="absolute inset-x-[3%] top-[147px] z-[2] min-[1441px]:top-[155px] max-[701px]:top-[150px] max-[561px]:top-[145px]">
        <h1 className="flex items-start justify-between gap-[3%] pr-7 font-display text-[length:clamp(42px,16cqw,231px)] font-medium leading-[.727] tracking-[-.06em] text-white max-[701px]:pr-[22px] max-[701px]:text-[length:15cqw]">
          <span className="sr-only">{`${firstName} ${lastName}`.trim()}</span>

          {/* Name: stacked in the left corner, away from the face */}
          <span
            aria-hidden="true"
            className="flex flex-col items-start text-left text-[length:clamp(34px,8.5cqw,130px)] leading-[.85] max-[901px]:text-[length:10cqw] max-[701px]:text-[length:13cqw]"
          >
            <span className="flex">
              {[...firstName].map((ch, i) => (
                <Letter
                  key={`m${i}`}
                  ch={ch}
                  delay={delayFor(i)}
                  phase={phase}
                />
              ))}
            </span>
            <span className="flex font-[250]">
              {[...lastName].map((ch, i) => (
                <Letter
                  key={`v${i}`}
                  ch={ch}
                  delay={delayFor(firstName.length + i)}
                  phase={phase}
                />
              ))}
            </span>
          </span>

          {/* Monogram and [01]: right corner */}
          <span aria-hidden="true" className="relative flex">
            {[...monogram].map((ch, i) => (
              <Letter
                key={i}
                ch={ch}
                delay={delayFor(firstName.length + lastName.length + i)}
                phase={phase}
              />
            ))}
            <sup
              className={`absolute left-full top-[.12em] ml-1 font-utility text-[14px] font-normal leading-none tracking-normal max-[701px]:text-xs ${sup.cls}`}
              style={sup.style}
            >
              [01]
            </sup>
          </span>
        </h1>

        <div
          className={`mt-[35px] flex justify-between gap-4 font-utility text-[13px] uppercase tracking-wide text-white max-[901px]:text-[11px] max-[701px]:mt-6 max-[701px]:text-[10px] ${role.cls}`}
          style={role.style}
        >
          <span className="max-[701px]:max-w-[58%]">
            {PERSONA.role.toUpperCase()}
          </span>
          <span className="text-right max-[701px]:max-w-[36%]">
            [ PORTFOLIO // SELECTED WORK ]
          </span>
        </div>

        <div className="relative mt-[26px] h-[52px] max-[561px]:mt-5 max-[561px]:h-[46px]">
          <a
            href="#about"
            onClick={goToAbout}
            aria-label="Scroll down to About"
            className="group absolute right-[0%] top-0 flex size-[52px] items-center justify-center rounded-full border border-white/60 bg-black/[.32] text-white transition-colors duration-250 hover:border-accent hover:bg-accent hover:text-black focus-visible:border-accent focus-visible:bg-accent focus-visible:text-black max-[561px]:size-[46px]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`size-[25px] max-[561px]:size-[23px] ${
                bouncing ? "animate-arrow-bounce" : ""
              } group-hover:[animation-play-state:paused] group-focus-visible:[animation-play-state:paused] motion-reduce:animate-none`}
            >
              <path d="M12 4v15M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </div>

      <div
        className={`absolute bottom-10 left-[3%] z-[2] w-[420px] max-w-[94%] text-[18px] leading-snug text-white max-[901px]:text-base max-[561px]:bottom-[105px] ${notes.cls}`}
        style={notes.style}
      >
        <p>• {PERSONA.tagline}</p>
        <p className="mt-1 text-muted-2">• {PERSONA.note}</p>
      </div>

      <div
        className={`absolute bottom-[34px] right-[3%] z-[2] max-[561px]:bottom-7 max-[561px]:left-[3%] max-[561px]:right-auto ${cta.cls}`}
        style={cta.style}
      >
        <Pill href="#work">
          Explore work <span aria-hidden="true">↘</span>
        </Pill>
      </div>

      <p
        aria-hidden="true"
        className="absolute right-[1.2%] top-[52%] z-[2] font-utility text-[10px] uppercase tracking-[.3em] text-white/55 [writing-mode:vertical-rl] max-[701px]:hidden"
      >
        {PERSONA.heroLabel}
      </p>
    </section>
  );
}
