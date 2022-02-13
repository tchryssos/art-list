import styled from '@emotion/styled';

import { createInputStyles } from './styles';
import { InputCommonProps } from './types';

const InputWrapper = styled.div`
  width: 100%;
`;

const Input = styled.input(({ theme }) => ({
  ...createInputStyles(theme),
  width: '100%',
}));

export const DateInput: React.FC<InputCommonProps> = ({
  name,
  className,
  required,
  label,
}) => (
  <InputWrapper className={className}>
    <label htmlFor={name}>{label}</label>
    <Input name={name} required={required} type="date" />
  </InputWrapper>
);
