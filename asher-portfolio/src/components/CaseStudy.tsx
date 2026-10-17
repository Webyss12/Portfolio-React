import { useEffect, useRef } from 'react';
import { useScrollLock } from '../hooks/useScrollLock';
import type { Project } from '../types';
import { Artwork } from './Artwork';

const SUPPORTS_DIALOG =
  typeof HTMLDialogElement === 'function' && typeof HTMLDialogElement.prototype.showModal === 'function';

function CaseBody({ project, onClose }: { project: Project; onClose: () => void }) {
  const facts: [string, string][] = [
    ['Project type', project.projectType],
    ['Year', project.year],
    ['Role', project.role],
    ['Discipline', project.discipline],
  ];
  const section = 'grid grid-cols-[200px_minmax(0,1fr)] gap-6 border-t border-[#333] py-8 max-[701px]:grid-cols-1 max-[701px]:gap-3';

  return (
    <article>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#444] bg-[#101010] px-6 py-3 font-utility text-[13px] uppercase tracking-wide text-muted-2">
        <span>
          {project.projectType} / {project.year}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 min-w-11 rounded-full border border-[#444] px-4 text-[14px] normal-case tracking-normal text-[#f2f0e9] transition-colors duration-250 hover:bg-accent hover:text-black"
        >
          Close <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="px-6 pb-12 pt-10 min-[701px]:px-10">
        <h2 id="case-title" className="font-display text-[length:clamp(40px,6vw,82px)] font-medium leading-[.95] tracking-[-.04em]">
          {project.title}
        </h2>
        <p className="mt-6 max-w-[760px] text-[20px] leading-snug text-[#d8d5cb]">{project.summary}</p>

        <div className="mt-10 flex justify-center border-y border-[#333] bg-[#0b0b0b] py-8">
          <Artwork name={project.coverKey} labelled className="w-full max-w-[860px] max-h-[540px]" />
        </div>

        <dl className="my-10 grid grid-cols-2 gap-x-8 gap-y-6 max-[561px]:grid-cols-1">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="font-utility text-[12px] uppercase tracking-[.12em] text-muted">{label}</dt>
              <dd className="mt-1 text-[16px] text-[#f2f0e9]">{value}</dd>
            </div>
          ))}
        </dl>

        <section className={section}>
          <h3 className="font-utility text-[14px] uppercase tracking-[.12em] text-muted">Challenge</h3>
          <p className="text-[18px] leading-relaxed text-[#d8d5cb]">{project.challenge}</p>
        </section>
        <section className={section}>
          <h3 className="font-utility text-[14px] uppercase tracking-[.12em] text-muted">Approach</h3>
          <p className="text-[18px] leading-relaxed text-[#d8d5cb]">{project.approach}</p>
        </section>
        <section className={section}>
          <h3 className="font-utility text-[14px] uppercase tracking-[.12em] text-muted">Deliverables</h3>
          <ul className="space-y-1 text-[18px] text-[#d8d5cb]">
            {project.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

interface CaseStudyProps {
  project: Project | null;
  onClose: () => void;
}

// Native <dialog>: gives us focus containment, Escape and a real backdrop for free.
function NativeDialog({ project, onClose }: CaseStudyProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useScrollLock(project !== null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="case-title"
      onClose={onClose}
      onClick={(e) => {
        const dialog = ref.current;
        if (!dialog || e.target !== dialog) return;
        // A click on the backdrop lands on the dialog element itself, so check the real rectangle.
        const r = dialog.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) dialog.close();
      }}
      className="m-auto max-h-[calc(100svh-32px)] w-[min(1040px,calc(100vw-32px))] max-w-none overflow-y-auto border border-[#444] bg-[#101010] p-0 text-[#f2f0e9] open:animate-dialog-in backdrop:bg-black/85 motion-reduce:open:animate-none"
    >
      {project && <CaseBody project={project} onClose={() => ref.current?.close()} />}
    </dialog>
  );
}

// Fallback for browsers without <dialog>: a real panel with its own close control and focus handling.
function InlinePanel({ project, onClose }: CaseStudyProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(project !== null);

  useEffect(() => {
    if (!project) return;
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!project) return null;
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        className="max-h-full w-[min(1040px,100%)] overflow-y-auto border border-[#444] bg-[#101010] text-[#f2f0e9]"
      >
        <CaseBody project={project} onClose={onClose} />
      </div>
    </div>
  );
}

export function CaseStudy(props: CaseStudyProps) {
  return SUPPORTS_DIALOG ? <NativeDialog {...props} /> : <InlinePanel {...props} />;
}
