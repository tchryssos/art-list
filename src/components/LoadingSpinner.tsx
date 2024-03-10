import { mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';

import { colors } from '~/constants/theme';

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <Icon
      className={className}
      color={colors.text}
      path={mdiLoading}
      spin={1}
      title="Loading"
    />
  );
}

export function LoadingPageSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={clsx('flex justify-center items-center w-full', className)}>
      <div className="w-[25%] sm:w-[15%] lg:w-[12%] xl:w-[10%]">
        <LoadingSpinner />
      </div>
    </div>
  );
}
