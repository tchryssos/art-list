import { lowerCase, throttle } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '../buttons/Button';
import { Body } from '../typography/Body';

interface AutoCompleteProps {
  itemList: string[];
  setInputValue: (newVal: string) => void;
  setActiveDescendant: (descId: string) => void;
  setShowAutoComplete: (shouldShow: boolean) => void;
  inputValue: string;
}

type AutoCompleteItemProps = Pick<
  AutoCompleteProps,
  'setInputValue' | 'setActiveDescendant' | 'setShowAutoComplete'
> & {
  value: string;
};

function AutoCompleteItem({
  value,
  setInputValue,
  setActiveDescendant,
  setShowAutoComplete,
}: AutoCompleteItemProps) {
  return (
    <li>
      <Button
        className="w-full border border-solid border-accentLight border-t-0 hover:bg-accentLight focus:bg-accentLight active:bg-accentLight"
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
        <div className="p-2">
          <Body>{value}</Body>
        </div>
      </Button>
    </li>
  );
}

export function AutoComplete({
  itemList,
  setInputValue,
  inputValue,
  setActiveDescendant,
  setShowAutoComplete,
}: AutoCompleteProps) {
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
    <ul className="flex flex-col w-full max-h-60 z-[2] top-20 border-t-0 border border-solid border-accentHeavy shadow-autocomplete-list">
      {filteredList.map((item) => (
        <AutoCompleteItem
          key={item}
          setActiveDescendant={setActiveDescendant}
          setInputValue={setInputValue}
          setShowAutoComplete={setShowAutoComplete}
          value={item}
        />
      ))}
    </ul>
  );
}
