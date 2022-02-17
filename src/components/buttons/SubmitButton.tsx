import styled from '@emotion/styled';

import { Body } from '../typography/Body';
import { Button } from './Button';

const Submit = styled(Button)`
  width: fit-content;
  padding: ${({ theme }) => theme.spacing[16]};
`;

export const SubmitButton: React.FC = () => (
  <Submit type="submit">
    <Body bold>Submit</Body>
  </Submit>
);
