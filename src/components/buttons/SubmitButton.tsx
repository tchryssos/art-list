import { LoadingSpinner } from '../LoadingSpinner';
import { Body } from '../typography/Body';
import { Button } from './Button';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <Button
      className="h-13 p-4 border-none hover:bg-accentHeavy active:bg-accentHeavy"
      type="submit"
    >
      {isSubmitting ? (
        <div className="flex justify-center">
          <LoadingSpinner size={1} />
        </div>
      ) : (
        <Body>Submit</Body>
      )}
    </Button>
  );
}
