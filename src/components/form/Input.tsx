import styled from '@emotion/styled';
import { FocusEventHandler, useState } from 'react';

import { FlexBox } from '../box/FlexBox';
import { AutoComplete } from './AutoComplete';
import { createInputStyles } from './styles';

export type InputProps<T extends Record<string, unknown>> = {
  name: Extract<keyof T, string>;
  label: string;
  required?: boolean;
  className?: string;
  type: 'text' | 'date';
  defaultValue?: string;
  autoCompleteList?: string[];
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

type AutocompleteProps =
  | {
      autoCompleteList?: never;
      autoCompleteActive?: never;
    }
  | {
      autoCompleteList: string[];
      autoCompleteActive: boolean;
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

export function Input<T extends Record<string, unknown>>(
  props: InputProps<T> & AutocompleteProps
) {
  const {
    name,
    className,
    required,
    label,
    type,
    defaultValue = '',
    onBlur,
    onFocus,
    autoCompleteList,
    autoCompleteActive,
  } = props;

  const [value, setValue] = useState(defaultValue);
  const [activeDescendant, setActiveDescendant] = useState('');

  return (
    <InputWrapper className={className} column>
      <Label htmlFor={name}>{label}</Label>
      <StyledInput
        aria-activedescendant={activeDescendant}
        aria-autocomplete={autoCompleteList ? 'list' : 'none'}
        name={name}
        required={required}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onFocus={onFocus}
      />
      {autoCompleteActive && autoCompleteList && (
        <AutoComplete
          inputValue={value}
          itemList={autoCompleteList}
          setActiveDescendant={setActiveDescendant}
          setInputValue={setValue}
        />
      )}
    </InputWrapper>
  );
}
