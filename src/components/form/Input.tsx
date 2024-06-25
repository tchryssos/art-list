import clsx from 'clsx';
import { FocusEventHandler, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Body } from '../typography/Body';
import { AutoComplete } from './AutoComplete';

type InputProps<T extends Record<string, unknown>> = {
  name: Extract<keyof T, string>;
  label: string;
  required?: boolean;
  className?: string;
  type: 'text' | 'date' | 'password';
  defaultValue?: string;
  autoCompleteList?: string[];
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string;
  readOnly?: boolean;
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
    error,
    readOnly,
  } = props;

  const [value, setValue] = useState(defaultValue);
  const [activeDescendant, setActiveDescendant] = useState('');
  const [showAutoComplete, setShowAutoComplete] = useState(
    Boolean(autoCompleteActive)
  );

  useEffect(() => {
    setShowAutoComplete(Boolean(autoCompleteActive));
  }, [autoCompleteActive]);

  return (
    <div className={twMerge('flex flex-col w-full', className)}>
      <label className="text-xs font-semibold" htmlFor={name}>
        {label}
      </label>
      <input
        aria-activedescendant={activeDescendant}
        aria-autocomplete={autoCompleteList ? 'list' : 'none'}
        className={clsx(
          'p-4 text-base font-light bg-background text-text border border-solid  font-jp w-full',
          error ? 'border-danger' : 'border-accentHeavy'
        )}
        name={name}
        readOnly={readOnly}
        required={required}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onFocus={onFocus}
      />
      {error && <Body className="text-danger text-xs mt-1">{error}</Body>}
      {showAutoComplete && autoCompleteList && (
        <AutoComplete
          inputValue={value}
          itemList={autoCompleteList}
          setActiveDescendant={setActiveDescendant}
          setInputValue={setValue}
          setShowAutoComplete={setShowAutoComplete}
        />
      )}
    </div>
  );
}
