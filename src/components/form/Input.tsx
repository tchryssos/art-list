import styled from '@emotion/styled';

import { FlexBox } from '../box/FlexBox';
import { createInputStyles } from './styles';

export interface InputProps {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  type: 'text' | 'date';
  defaultValue?: string;
}

const InputWrapper = styled(FlexBox)`
  width: 100%;
`;

const StyledInput = styled.input`
  ${({ theme }) => createInputStyles(theme)};
  width: 100%;
`;

const Label = styled.label(({ theme }) => ({
  fontSize: theme.fontSize.subBody,
  fontWeight: theme.fontWeight.regular,
}));

export const Input: React.FC<InputProps> = ({
  name,
  className,
  required,
  label,
  type,
  defaultValue,
}) => (
  <InputWrapper className={className} column>
    <Label htmlFor={name}>{label}</Label>
    <StyledInput
      defaultValue={defaultValue}
      name={name}
      required={required}
      type={type}
    />
  </InputWrapper>
);
