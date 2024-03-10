import clsx from 'clsx';

import { TypographyProps } from './types';

export function Body({ children, className, bold, italic }: TypographyProps) {
  return (
    <p
      className={clsx(
        'font-body text-base text-text',
        bold && 'font-bold',
        italic && 'italic',
        className
      )}
    >
      {children}
    </p>
  );
}
