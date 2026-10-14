import { PROJECTS } from '../data/content';
import { useInView } from '../hooks/useInView';
import type { Project } from '../types';
import { Artwork } from './Artwork';
import { Pill } from './Pill';

interface SelectedWorkProps {
  onOpen: (project: Project, opener: HTMLElement) => void;
}

const COLS = 'grid-cols-[42px_minmax(0,1fr)_210px_70px_40px] max-[901px]:grid-cols-[42px_minmax(0,1fr)_70px_40px] max-[561px]:grid-cols-[24px_minmax(0,1fr)_46px_24px]';

export function SelectedWork({ onOpen }: SelectedWorkProps) {
  const [ref, inView] = useInView<HTMLElement>(0.15);

  return (
    <section
      id="work"
      ref={ref}
      tabIndex={-1}
      aria-labelledby="work-title"
      className="@container min-h-[760px] border-t border-line bg-[linear-gradient(180deg,#000_0%,#000_48%,#ea4f16_78%,#f6af60_100%)] px-[4%] pb-[70px] pt-10 outline-none focus-visible:shadow-none max-[561px]:min-h-0 max-[561px]:px-[3%]"
    >
      <div className="flex items-start justify-between font-utility">
        <h2 id="work-title" className="text-[18px] font-normal">
          // Selected Work
        </h2>
        <p className="text-[13px] text-muted-2 max-[561px]:hidden">{PROJECTS.length} PERSONAL PROJECTS / 2026</p>
      </div>

      <div aria-hidden="true" className={`mt-[50px] grid gap-x-4 border-b border-white/20 pb-3 font-utility text-[14px] text-muted-2 max-[901px]:hidden ${COLS}`}>
        <span>#</span>
        <span>Project</span>
        <span>Discipline</span>
        <span>Year</span>
        <span />
      </div>

      <ul className="max-[901px]:mt-12">
        {PROJECTS.map((p, i) => (
          <li
            key={p.id}
            className={`transition-all duration-500 ease-soft motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-[34px] opacity-0'
            }`}
            style={{ transitionDelay: `${i * 85}ms` }}
          >
            <button
              type="button"
              onClick={(e) => onOpen(p, e.currentTarget)}
              aria-label={`Open the ${p.title} case study`}
              className={`group relative grid min-h-[72px] w-full items-center gap-x-4 border-b border-white/20 bg-black/[.73] py-4 text-left font-utility text-white ${COLS}`}
            >
              <span className="text-[14px] text-muted-2 max-[901px]:row-span-2">{p.id}</span>
              <span className="text-[24px] font-medium leading-tight max-[901px]:col-start-2 max-[901px]:row-start-1 max-[561px]:text-[20px]">
                {p.title}
              </span>
              <span className="text-[14px] text-muted-3 max-[901px]:col-start-2 max-[901px]:row-start-2 max-[561px]:text-xs">
                {p.discipline}
              </span>
              <span className="text-[14px] max-[901px]:col-start-3 max-[901px]:row-span-2 max-[901px]:row-start-1 max-[561px]:text-xs">
                {p.year}
              </span>
              <span aria-hidden="true" className="justify-self-end text-xl max-[901px]:col-start-4 max-[901px]:row-span-2 max-[901px]:row-start-1">
                ↗
              </span>

              {/* white left-to-right wipe */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-white mix-blend-difference transition-transform duration-[450ms] ease-out-quint group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
              />
              {/* artwork preview: fine pointers on wide screens only */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[62%] top-1/2 z-10 hidden w-[180px] -translate-y-1/2 scale-[.96] opacity-0 blur-[8px] transition-all duration-[420ms] ease-out-quint group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:blur-none min-[901px]:pointer-fine:block motion-reduce:transition-none"
              >
                <Artwork name={p.coverKey} className="block h-auto w-full" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-[85px] flex items-center justify-between gap-6 max-[561px]:mt-12 max-[561px]:flex-col max-[561px]:items-start">
        <p className="font-utility text-[18px] tracking-wide text-[#111]">HAVE A PROJECT IN MIND?</p>
        <Pill href="#contact">
          Start a conversation <span aria-hidden="true">↗</span>
        </Pill>
      </div>
    </section>
  );
}
