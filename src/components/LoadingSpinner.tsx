import { mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface LoadingSpinnerProps {
  className?: string;
  size?: ComponentProps<typeof Icon>['size'];
}

export function LoadingSpinner({ className, size = 2 }: LoadingSpinnerProps) {
  return (
    <Icon
      className={twMerge('text-text', className)}
      path={mdiLoading}
      size={size}
      spin={1}
      title="Loading"
    />
  );
}
