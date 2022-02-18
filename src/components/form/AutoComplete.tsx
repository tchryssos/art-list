import styled from '@emotion/styled';
import lowerCase from 'lodash.lowercase';
import throttle from 'lodash.throttle';
import { useCallback, useEffect, useState } from 'react';

import { pxToRem } from '~/logic/util/styles';

import { FlexBox } from '../box/FlexBox';
import { Button } from '../buttons/Button';
import { Body } from '../typography/Body';

interface AutoCompleteProps {
  itemList: string[];
  setInputValue: (newVal: string) => void;
  setActiveDescendant: (descId: string) => void;
  setShowAutoComplete: (shouldShow: boolean) => void;
  inputValue: string;
}

const AutoCompleteList = styled(FlexBox)`
  width: 100%;
  max-height: ${pxToRem(240)};
  border: ${({ theme }) =>
    `${theme.border.borderWidth[1]} solid ${theme.colors.accentHeavy}`};
  border-top: none;
  z-index: 2;
  top: ${pxToRem(80)};
  box-shadow: ${({ theme }) =>
    `${pxToRem(4)} ${pxToRem(4)} ${pxToRem(1)} ${theme.colors.smudge}`};
`;

const AutoCompleteButton = styled(Button)`
  width: 100%;
  border: ${({ theme }) =>
    `${theme.border.borderWidth[1]} solid ${theme.colors.accentLight}`};
  border-top: none;
  :hover,
  :focus,
  :active {
    background-color: ${({ theme }) => theme.colors.accentLight};
  }
`;

type AutoCompleteItemProps = Pick<
  AutoCompleteProps,
  'setInputValue' | 'setActiveDescendant' | 'setShowAutoComplete'
> & {
  value: string;
};

const AutoCompleteItem: React.FC<AutoCompleteItemProps> = ({
  value,
  setInputValue,
  setActiveDescendant,
  setShowAutoComplete,
}) => (
  <AutoCompleteButton
    id={value}
    transparent
    onClick={() => {
      setInputValue(value);
      setShowAutoComplete(false);
    }}
    onFocus={() => {
      setActiveDescendant(value);
    }}
  >
    <FlexBox p={8}>
      <Body>{value}</Body>
    </FlexBox>
  </AutoCompleteButton>
);

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  itemList,
  setInputValue,
  inputValue,
  setActiveDescendant,
  setShowAutoComplete,
}) => {
  const [filteredList, setFilteredList] = useState<string[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterList = useCallback(
    throttle((inputList: string[]) => {
      const nextList = inputList
        .filter(
          (autoCompleteVal) =>
            inputValue &&
            lowerCase(autoCompleteVal).includes(lowerCase(inputValue))
        )
        .slice(0, 5);
      setFilteredList(nextList);
    }, 250),
    [inputValue]
  );

  useEffect(() => {
    filterList(itemList);
  }, [filterList, itemList]);

  return (
    <AutoCompleteList column>
      {filteredList.map((item) => (
        <AutoCompleteItem
          key={item}
          setActiveDescendant={setActiveDescendant}
          setInputValue={setInputValue}
          setShowAutoComplete={setShowAutoComplete}
          value={item}
        />
      ))}
    </AutoCompleteList>
  );
};
