interface RevealLettersProps {
  text: string;
  inView: boolean;
  /** seconds between letters */
  step: number;
  /** index of the first letter (so a second line can continue the stagger) */
  offset?: number;
  className?: string;
}

// Letters rise and un-blur one after another. Words stay together when the line wraps.
export function RevealLetters({ text, inView, step, offset = 0, className = '' }: RevealLettersProps) {
  const words = text.split(' ');
  const starts = words.map((_, i) => words.slice(0, i).reduce((sum, w) => sum + w.length, offset));

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {words.map((word, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {[...word].map((ch, ci) => (
                <span
                  key={ci}
                  className={`inline-block transition-all duration-500 ease-out-quint motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:transition-none ${
                    inView ? 'translate-y-0 opacity-100 blur-none' : 'translate-y-[.4em] opacity-0 blur-[10px]'
                  }`}
                  style={{ transitionDelay: `${(starts[wi] + ci) * step}s` }}
                >
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </>
  );
}
