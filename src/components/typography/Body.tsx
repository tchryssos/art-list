import { twMerge } from 'tailwind-merge';

import type { TypographyProps } from './types';

export function Body({ children, className, bold, italic }: TypographyProps) {
  return (
    <p
      className={twMerge(
        'text-text leading-4 text-sm font-semibold',
        bold && 'font-bold',
        italic && 'italic',
        className
      )}
    >
      {children}
    </p>
  );
}
