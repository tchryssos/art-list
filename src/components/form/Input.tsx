import styled from '@emotion/styled';

import { createInputStyles } from './styles';

export interface InputProps {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  type: 'text' | 'date';
}

const InputWrapper = styled.div`
  width: 100%;
`;

const StyledInput = styled.input(({ theme }) => ({
  ...createInputStyles(theme),
  width: '100%',
}));

const Label = styled.label(({ theme }) => ({
  fontSize: theme.fontSize.subBody,
}));

export const Input: React.FC<InputProps> = ({
  name,
  className,
  required,
  label,
}) => (
  <InputWrapper className={className}>
    <Label htmlFor={name}>{label}</Label>
    <StyledInput name={name} required={required} type="date" />
  </InputWrapper>
);
