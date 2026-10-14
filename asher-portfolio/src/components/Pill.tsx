import type { ComponentPropsWithoutRef } from 'react';

// The white pill link used for every call to action.
export function Pill({ className = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      {...rest}
      className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-white px-5 py-4 font-utility text-[18px] leading-none text-black transition-[transform,background-color,color] duration-250 ease-soft hover:scale-[1.04] hover:bg-accent active:scale-[.98] max-[561px]:min-h-11 max-[561px]:text-base ${className}`}
    >
      {children}
    </a>
  );
}
