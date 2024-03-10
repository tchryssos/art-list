import clsx from 'clsx';

import { TypographyProps } from './types';

export function Body({
  children,
  className,
  bold = true,
  italic,
}: TypographyProps) {
  return (
    <p
      className={clsx(
        'text-text leading-5 text-sm',
        bold && 'font-bold',
        italic && 'italic',
        className
      )}
    >
      {children}
    </p>
  );
}
