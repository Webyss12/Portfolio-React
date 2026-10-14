import type { PointerEvent as ReactPointerEvent } from 'react';
import { PROJECTS } from '../data/content';
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery';
import { useInView } from '../hooks/useInView';
import { useProjectCursor } from '../lib/cursorContext';
import type { Project } from '../types';
import { Artwork } from './Artwork';
import { Pill } from './Pill';
import { RevealLetters } from './RevealLetters';

interface FeaturedProps {
  onOpen: (project: Project, opener: HTMLElement) => void;
}

export function Featured({ onOpen }: FeaturedProps) {
  const project = PROJECTS.find((p) => p.featuredLines) ?? PROJECTS[0];
  const [first, second] = project.featuredLines ?? [project.title, ''];
  const [ref, inView] = useInView<HTMLElement>(0.22);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const interactive = fine && !reduced;
  const setProjectCursor = useProjectCursor();

  // Card tilt follows the pointer across the whole section.
  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (!interactive) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty('--rx', `${(y - 0.5) * -24.2}deg`);
    e.currentTarget.style.setProperty('--ry', `${(x - 0.5) * 30.8}deg`);
  };
  const onLeave = (e: ReactPointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
    setProjectCursor(false);
  };

  return (
    <section
      id="featured"
      ref={ref}
      tabIndex={-1}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="@container relative min-h-[960px] border-t border-line px-[3%] pt-[38px] outline-none [perspective:850px] focus-visible:shadow-none max-[901px]:min-h-[780px] max-[561px]:flex max-[561px]:min-h-0 max-[561px]:flex-col max-[561px]:items-center max-[561px]:pb-16"
    >
      <div className="flex w-full items-start justify-between font-utility">
        <p className="text-[18px]">// Featured Project</p>
        <p className="text-[13px] text-muted max-[561px]:hidden">PERSONAL PROJECT // {project.year}</p>
      </div>

      <h2 className="mt-[90px] text-center font-display text-[length:clamp(52px,13.3cqw,180px)] font-medium leading-[.84] tracking-[-.04em] max-[561px]:mt-12 max-[561px]:text-[length:clamp(44px,13.5cqw,70px)]">
        <span className="block">
          <RevealLetters text={first} inView={inView} step={0.05} />
          <sup aria-hidden="true" className="ml-[.08em] align-top font-utility text-[.1em] font-normal tracking-normal">
            {project.id} / {project.title.toUpperCase()}
          </sup>
        </span>
        <span className="block">
          <RevealLetters text={second} inView={inView} step={0.05} offset={first.length} />
        </span>
      </h2>

      {/* grid band behind the card: rules every 6.25% */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[623px] h-[90px] border-y border-line-strong bg-[repeating-linear-gradient(90deg,#333_0,#333_1px,transparent_1px,transparent_6.25%)] max-[901px]:top-[443px] max-[561px]:hidden"
      >
        <p className="absolute bottom-2 left-[3%] bg-black px-2 font-utility text-[11px] tracking-wide text-muted">
          01 / FORM FOLLOWS A POINT OF VIEW.
        </p>
      </div>

      <button
        type="button"
        aria-label={`Open the ${project.title} case study`}
        onClick={(e) => onOpen(project, e.currentTarget)}
        onPointerEnter={() => interactive && setProjectCursor(true)}
        onPointerLeave={() => setProjectCursor(false)}
        className="absolute left-1/2 top-[401px] z-10 size-[347px] -translate-x-1/2 mix-blend-difference transition-transform duration-200 ease-out max-[901px]:top-[290px] max-[901px]:size-[278px] max-[561px]:static max-[561px]:-mt-2 max-[561px]:size-[208px] max-[561px]:translate-x-0"
        style={{ transform: 'scale(1.025) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' }}
      >
        <Artwork name={project.coverKey} className="block size-full" />
        <span
          aria-hidden="true"
          className="absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full border border-white/70 bg-black/30 text-xl text-white"
        >
          ↗
        </span>
      </button>

      <div className="absolute inset-x-0 top-[788px] flex flex-col items-center px-[3%] text-center max-[901px]:top-[600px] max-[561px]:static max-[561px]:mt-7 max-[561px]:px-0">
        <p className="font-utility text-[22px] leading-tight max-[561px]:text-lg">
          {project.title}, {project.caption}
        </p>
        <p className="mt-2 font-utility text-[14px] text-muted-2">{project.role}</p>
        <Pill
          href="#featured"
          className="mt-6"
          onClick={(e) => {
            e.preventDefault();
            onOpen(project, e.currentTarget);
          }}
        >
          View case study <span aria-hidden="true">↗</span>
        </Pill>
      </div>
    </section>
  );
}
