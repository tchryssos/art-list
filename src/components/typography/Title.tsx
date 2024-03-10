import clsx from 'clsx';

import { TypographyProps } from './types';

export function Title({ children, className, bold, italic }: TypographyProps) {
  return (
    <h2
      className={clsx(
        'font-mono text-2xl text-text',
        bold && 'font-bold',
        italic && 'italic',
        className
      )}
    >
      {children}
    </h2>
  );
}
