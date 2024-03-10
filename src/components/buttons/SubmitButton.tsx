import { LoadingSpinner } from '../LoadingSpinner';
import { Body } from '../typography/Body';
import { Button } from './Button';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <Button className="h-12 p-4" type="submit">
      {isSubmitting ? <LoadingSpinner /> : <Body bold>Submit</Body>}
    </Button>
  );
}
