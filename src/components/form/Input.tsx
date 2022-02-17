import styled from '@emotion/styled';

import { FlexBox } from '../box/FlexBox';
import { createInputStyles } from './styles';

export type InputProps<T extends Record<string, unknown>> = {
  name: Extract<keyof T, string>;
  label: string;
  required?: boolean;
  className?: string;
  type: 'text' | 'date';
  defaultValue?: string;
};

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

export function Input<T extends Record<string, unknown>>(props: InputProps<T>) {
  const { name, className, required, label, type, defaultValue } = props;
  return (
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
}
