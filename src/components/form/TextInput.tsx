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

export const TextInput: React.FC<InputCommonProps> = ({
  name,
  label,
  required,
  className,
}) => (
  <InputWrapper className={className}>
    <label htmlFor={name}>{label}</label>
    <Input name={name} required={required} type="text" />
  </InputWrapper>
);
