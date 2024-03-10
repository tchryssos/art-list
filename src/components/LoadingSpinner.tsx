import { mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';
import { ComponentProps } from 'react';
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

export function LoadingPageSpinner({ className, size }: LoadingSpinnerProps) {
  return (
    <div className={clsx('flex justify-center items-center w-full', className)}>
      <div className="w-[25%] sm:w-[15%] lg:w-[12%] xl:w-[10%]">
        <LoadingSpinner size={size} />
      </div>
    </div>
  );
}
