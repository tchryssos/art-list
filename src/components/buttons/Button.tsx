import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { BaseButtonProps } from './types';

export function Button({
  onClick,
  className,
  type = 'button',
  disabled,
  children,
  transparent,
  buttonLike,
  onFocus,
  id,
}: BaseButtonProps) {
  const buttonClassName =
    'text-text cursor-pointer min-h-8 min-w-8 py-1 px-[6] disabled:cursor-not-allowed disabled:bg-accent-heavy disabled:border-none uppercase disabled:filter-[brightness(1.0)] hover:filter-[brightness(0.9)] active:filter-[brightness(0.9)]';

  const buttonClasses = twMerge(
    buttonClassName,
    transparent ? 'bg-transparent' : 'bg-accent-light',
    !transparent && 'border border-text border-solid',
    className
  );

  if (buttonLike) {
    return (
      <div className={clsx('flex items-center justify-center', buttonClasses)}>
        {children}
      </div>
    );
  }
  return (
    <button
      className={buttonClasses}
      disabled={disabled || (!onClick && type !== 'submit')}
      id={id}
      // eslint-disable-next-line react/button-has-type
      type={type}
      onClick={onClick}
      onFocus={onFocus}
    >
      {children}
    </button>
  );
}
