import { useState } from 'react';
import { PERSONA } from '../data/content';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { RevealLetters } from './RevealLetters';
import { useInView } from '../hooks/useInView';

function ContactDetails() {
  const { email, location, socialLinks } = PERSONA;
  const [status, setStatus] = useState('');
  const [copyFailed, setCopyFailed] = useState(false);

  async function copyEmail() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopyFailed(false);
      setStatus('Email address copied to your clipboard.'); // only after the promise resolves
    } catch {
      setCopyFailed(true);
      setStatus('Copying was blocked by the browser. Select the address above to copy it manually.');
    }
  }

  if (!email && !location && socialLinks.length === 0) {
    return <p className="font-body text-[18px] text-muted-3">Demo portfolio, contact details not configured.</p>;
  }

  return (
    <div className="space-y-4 font-body text-[18px]">
      {email && (
        <div>
          <a href={`mailto:${email}`} className={`text-white underline underline-offset-4 ${copyFailed ? 'select-all' : ''}`}>
            {email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="ml-4 min-h-11 rounded-full border border-[#555] px-4 font-utility text-[14px] text-white transition-colors duration-250 hover:bg-accent hover:text-black"
          >
            Copy email
          </button>
        </div>
      )}
      {location && <p className="text-muted-3">{location}</p>}
      {socialLinks.length > 0 && (
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {socialLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <p aria-live="polite" className="min-h-6 text-[14px] text-muted-3">
        {status}
      </p>
    </div>
  );
}

export function Contact() {
  const [ref, inView] = useInView<HTMLElement>(0.15);
  const reduced = useReducedMotion();

  const backToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const top = document.getElementById('top');
    top?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    top?.focus({ preventScroll: true });
  };

  return (
    <section
      id="contact"
      ref={ref}
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="@container border-t border-line px-[3%] pb-9 pt-[110px] outline-none focus-visible:shadow-none max-[561px]:pt-[65px]"
    >
      <p className="font-utility text-[18px]">// Contact.</p>

      <h2
        id="contact-title"
        className="mt-[42px] font-display text-[length:clamp(38px,8.5cqw,116px)] font-medium leading-[.9] tracking-[-.04em] max-[561px]:text-[11.4cqw]"
      >
        <span className="block">
          <RevealLetters text="LET’S BUILD" inView={inView} step={0.03} />
        </span>
        <span className="block text-accent">
          <RevealLetters text="SOMETHING USEFUL." inView={inView} step={0.03} offset={10} />
        </span>
      </h2>

      <div className="mt-14 grid grid-cols-2 gap-10 max-[701px]:grid-cols-1">
        <div>
          <p className="max-w-[480px] font-body text-[18px] leading-snug text-white">
            {PERSONA.contactIntro}
          </p>
          <p className="mt-6 font-utility text-[14px] text-muted">Embedded systems / Web development / Backend</p>
        </div>
        <ContactDetails />
      </div>

      <footer className="mt-[100px]">
        <div className="flex items-center justify-between gap-4 border-t border-line pt-6 font-utility text-[16px] text-muted-3 max-[561px]:flex-col max-[561px]:items-start">
          <p>
            © {new Date().getFullYear()} {PERSONA.firstName} {PERSONA.lastName}
          </p>
          <a href="#top" onClick={backToTop} className="inline-flex min-h-11 items-center text-white">
            Back to top&nbsp;<span aria-hidden="true">↑</span>
          </a>
        </div>
        <p className="mt-3 font-body text-[13px] text-muted">Built with React, Vite and Tailwind CSS.</p>
      </footer>
    </section>
  );
}
