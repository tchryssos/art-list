import clsx from 'clsx';

import { LoadingSpinner } from '../LoadingSpinner';
import { Body } from '../typography/Body';
import { Button } from './Button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
  disabled?: boolean;
}

export const submitButtonSizeClassName = 'h-13 p-4';

export function SubmitButton({
  isSubmitting,
  label,
  disabled,
}: SubmitButtonProps) {
  return (
    <Button
      className={clsx(
        submitButtonSizeClassName,
        'border-none hover:bg-accent-heavy active:bg-accent-heavy'
      )}
      disabled={disabled}
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
