import type { RefObject } from 'react';
import { useClock } from '../hooks/useClock';
import { Pill } from './Pill';

const BARS = [3, 7, 12, 4, 8, 6, 3]; // decorative bar heights in px

interface NavProps {
  open: boolean;
  shown: boolean;
  disabled: boolean;
  panelId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
}

export function Nav({ open, shown, disabled, panelId, triggerRef, onToggle }: NavProps) {
  const clock = useClock();

  return (
    <div
      inert={disabled}
      className={`absolute inset-x-[3%] top-7 z-50 flex items-start justify-between font-utility max-[561px]:top-5 ${
        shown ? 'animate-nav-in motion-reduce:animate-none' : 'opacity-0 motion-reduce:opacity-100'
      }`}
    >
      <div inert={open} className="text-white">
        <p className="text-[11px] tracking-wide text-muted max-[561px]:text-[10px]">{clock.zone}</p>
        <p className="text-[16px] tabular-nums max-[561px]:text-sm">{clock.time}</p>
      </div>

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={onToggle}
        className="absolute left-1/2 top-0 flex min-h-12 min-w-[60px] -translate-x-1/2 flex-col items-center justify-center gap-1.5 px-2 text-white"
      >
        <span aria-hidden="true" className="flex h-3 items-end gap-[3px]">
          {BARS.map((h, i) => (
            <span key={i} className="w-[3px] bg-white transition-[height] duration-300" style={{ height: open ? 4 : h }} />
          ))}
        </span>
        <span aria-hidden="true" className="text-[14px] tracking-wide">
          MENU
        </span>
      </button>

      <div inert={open}>
        <Pill href="#contact">
          Let’s talk <span aria-hidden="true">↗</span>
        </Pill>
      </div>
    </div>
  );
}
