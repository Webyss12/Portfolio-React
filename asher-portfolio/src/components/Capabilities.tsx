import { useState } from 'react';
import { SERVICES } from '../data/content';
import { useInView } from '../hooks/useInView';
import { RevealLetters } from './RevealLetters';

const COLS = 'grid-cols-[42px_minmax(0,1.1fr)_minmax(0,1.7fr)_140px] max-[901px]:grid-cols-[42px_minmax(0,1fr)]';

export function Capabilities() {
  const [ref, inView] = useInView<HTMLElement>(0.15);
  const [open, setOpen] = useState<string[]>([]);
  const toggle = (id: string) => setOpen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const line1 = 'FROM CIRCUIT BOARD';
  const line2 = 'TO BROWSER.';

  return (
    <section
      id="services"
      ref={ref}
      tabIndex={-1}
      aria-labelledby="services-title"
      className="@container min-h-[680px] bg-black px-[3%] pb-[50px] pt-[60px] outline-none focus-visible:shadow-none max-[561px]:min-h-0"
    >
      <div className="flex items-start justify-between gap-8 max-[901px]:flex-col max-[901px]:gap-6">
        <h2
          id="services-title"
          className="font-display text-[length:clamp(30px,6.4cqw,86px)] font-medium leading-none tracking-[-.045em] max-[561px]:text-[9.1cqw]"
        >
          <span className="block text-white">
            <RevealLetters text={line1} inView={inView} step={0.018} />
          </span>
          <span className="block text-accent">
            <RevealLetters text={line2} inView={inView} step={0.018} offset={line1.replace(/ /g, '').length} />
          </span>
        </h2>
        <p className="font-utility text-[18px] max-[901px]:order-last">// CAPABILITIES.</p>
      </div>

      <div aria-hidden="true" className={`mt-[70px] grid gap-4 pb-3 font-utility text-[14px] text-muted-2 max-[901px]:hidden ${COLS}`}>
        <span>#</span>
        <span>Discipline</span>
        <span>Tech stack</span>
        <span />
      </div>

      <ul className="max-[901px]:mt-12">
        {SERVICES.map((s, i) => {
          const isOpen = open.includes(s.id);
          const panelId = `service-panel-${s.id}`;
          return (
            <li
              key={s.id}
              className={`border-t border-line-strong transition-all duration-500 ease-soft motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-[34px] opacity-0'
              }`}
              style={{ transitionDelay: `${i * 85}ms` }}
            >
              <div className={`grid items-start gap-4 py-6 ${COLS}`}>
                <span className="font-utility text-[14px] text-muted-2">{s.id}</span>
                <h3 id={`service-title-${s.id}`} className="font-display text-[24px] font-medium leading-tight">
                  {s.title}
                </h3>
                <p className="font-body text-[18px] leading-snug text-muted-3 max-[901px]:col-start-2">{s.stack.join(' / ')}</p>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={`${isOpen ? 'Close' : 'Explore'} ${s.title}`}
                  onClick={() => toggle(s.id)}
                  className="min-h-11 justify-self-end rounded-full bg-accent px-5 font-utility text-[16px] text-black transition-transform duration-250 ease-soft hover:scale-[1.04] active:scale-[.98] max-[901px]:col-start-2 max-[901px]:justify-self-start"
                >
                  {isOpen ? 'Close −' : 'Explore +'}
                </button>
              </div>

              <div
                id={panelId}
                role="region"
                aria-labelledby={`service-title-${s.id}`}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows] duration-[450ms] ease-out-quint motion-reduce:transition-none ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className={`grid gap-4 pb-8 ${COLS}`}>
                    <div className="col-start-3 max-[901px]:col-start-2">
                      <p className="max-w-[560px] font-body text-[18px] leading-snug text-[#d8d5cb]">{s.text}</p>
                      <p className="mt-4 font-utility text-[14px] text-muted-3">
                        <span className="text-white">Used in:</span> {s.usedIn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-[70px] flex justify-between gap-6 border-t border-line-strong pt-6 font-utility text-[16px] text-muted max-[901px]:flex-col max-[901px]:gap-2">
        <p>Currently learning backend development: REST APIs and PostgreSQL.</p>
        <p>Student developer / Cebu, Philippines</p>
      </div>
    </section>
  );
}
