import { useEffect, useRef, type MouseEvent, type RefObject } from 'react';

const LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Work', id: 'work' },
  { label: 'Contact', id: 'contact' },
];

// Each letter has a white copy and an orange copy under it; on hover both roll up by one line.
function RollingLink({ label, id, onNavigate }: { label: string; id: string; onNavigate: (id: string, e: MouseEvent) => void }) {
  return (
    <a
      href={`#${id}`}
      onClick={(e) => onNavigate(id, e)}
      className="group flex font-display text-[96px] font-medium leading-[88px] tracking-[-.04em] text-white max-[701px]:text-[64px] max-[701px]:leading-16"
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="flex">
        {[...label].map((ch, i) => (
          <span key={i} className="relative block h-[88px] overflow-hidden max-[701px]:h-16">
            <span
              className="block transition-transform duration-500 ease-out-quint group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
              style={{ transitionDelay: `${i * 34}ms` }}
            >
              {ch}
            </span>
            <span
              className="absolute left-0 top-full block text-accent transition-transform duration-500 ease-out-quint group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:hidden"
              style={{ transitionDelay: `${i * 34}ms` }}
            >
              {ch}
            </span>
          </span>
        ))}
      </span>
    </a>
  );
}

interface MenuOverlayProps {
  open: boolean;
  id: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onDismiss: () => void;
  onNavigate: (id: string, e: MouseEvent) => void;
}

export function MenuOverlay({ open, id, triggerRef, onDismiss, onNavigate }: MenuOverlayProps) {
  const panelRef = useRef<HTMLElement>(null);

  // While open: move focus in, close on Escape, and keep Tab inside [menu button + the three links].
  useEffect(() => {
    if (!open) return;
    const links = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a') ?? []);
    const focusFirst = requestAnimationFrame(() => links()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [triggerRef.current, ...links()].filter(Boolean) as HTMLElement[];
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (index <= 0 ? items.length - 1 : index - 1) : index === items.length - 1 ? 0 : index + 1;
      e.preventDefault();
      items[next].focus();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(focusFirst);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onDismiss, triggerRef]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onDismiss}
        className={`fixed inset-0 z-30 bg-black/65 transition-[opacity,visibility] duration-[420ms] ease-soft ${
          open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
      />
      <nav
        id={id}
        ref={panelRef}
        aria-label="Main"
        inert={!open}
        className={`fixed inset-x-0 top-0 z-40 flex h-[507px] flex-col items-center gap-12 border-b border-line-strong bg-black px-10 pb-20 pt-[105px] transition-[opacity,translate,visibility] duration-[420ms] ease-soft max-[701px]:h-[430px] max-[701px]:gap-7 ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-6 opacity-0'
        }`}
      >
        {LINKS.map((l) => (
          <RollingLink key={l.id} {...l} onNavigate={onNavigate} />
        ))}
      </nav>
    </>
  );
}
