import styled from '@emotion/styled';

import { LoadingSpinner } from '../LoadingSpinner';
import { Body } from '../typography/Body';
import { Button } from './Button';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const Submit = styled(Button)`
  height: ${({ theme }) => theme.spacing[48]};
  padding: ${({ theme }) => theme.spacing[16]};
`;

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => (
  <Submit type="submit">
    {isSubmitting ? <LoadingSpinner /> : <Body bold>Submit</Body>}
  </Submit>
);
