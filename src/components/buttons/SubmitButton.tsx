import clsx from 'clsx';

import { LoadingSpinner } from '../LoadingSpinner';
import { Body } from '../typography/Body';
import { Button } from './Button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
}

export const submitButtonSizeClassName = 'h-13 p-4';

export function SubmitButton({ isSubmitting, label }: SubmitButtonProps) {
  return (
    <Button
      className={clsx(
        submitButtonSizeClassName,
        'border-none hover:bg-accentHeavy active:bg-accentHeavy'
      )}
      type="submit"
    >
      {isSubmitting ? (
        <div className="flex justify-center">
          <LoadingSpinner size={1} />
        </div>
      ) : (
        <Body>{label || 'Submit'}</Body>
      )}
    </Button>
  );
}
