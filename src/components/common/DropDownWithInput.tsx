import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';
import { DropdownWrapper } from './DropdownWrapper';

interface DropDownWithInputProps<T> {
  options: T[];
  placeholder: string;
  autoFocus?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  storeParentOption: (option: T) => void;
  optionToString: (option: T) => string;
  useFloating?: boolean;
}

export default function DropDownWithInput<T>({
  options,
  placeholder,
  autoFocus = false,
  disabled = false,
  errorMessage,
  storeParentOption,
  optionToString,
  useFloating = false,
}: DropDownWithInputProps<T>) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matchingOptionIndex = useMemo(
    () =>
      options.findIndex((option) =>
        optionToString(option).toLowerCase().includes(inputValue.toLowerCase())
      ),
    [inputValue, options, optionToString]
  );

  useEffect(() => {
    if (
      isFocused &&
      inputValue &&
      dropdownRef.current &&
      matchingOptionIndex !== -1
    ) {
      const matchingElement = dropdownRef.current.children[
        matchingOptionIndex
      ] as HTMLLIElement;
      matchingElement.scrollIntoView({ block: 'nearest' });
    }
  }, [inputValue, isFocused, matchingOptionIndex]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleOptionClick = useCallback(
    (option: T) => {
      storeParentOption(option);
      setInputValue('');
      setIsFocused(false);
    },
    [storeParentOption]
  );

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setInputValue('');
    }, 100);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && matchingOptionIndex !== -1) {
        e.preventDefault();
        handleOptionClick(options[matchingOptionIndex]);
        inputRef.current?.blur();
      }
    },
    [matchingOptionIndex, options, handleOptionClick]
  );

  const renderInput = () => (
    <div
      className={`ring-solid box-border flex w-full items-center space-x-small rounded-[8px] px-small py-medium ring-1 ${
        disabled ? 'bg-Background-Secondary' : 'bg-white'
      } ${
        errorMessage ? 'ring-2 ring-red-500' : 'ring-Divider-Subtle'
      } focus-within:ring-2 focus-within:ring-Action-Secondary`}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        className="body-regular placeholder:body-regular w-full bg-transparent placeholder:text-Text-Subtle focus:outline-none"
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
      />
    </div>
  );

  const dropdownContent = useMemo(
    () => (
      <ul
        ref={dropdownRef}
        className="mt-2 max-h-60 w-full overflow-auto rounded-[8px] border border-Divider-Default bg-white shadow-lg"
      >
        {options.map((option, index) => (
          <li
            key={index}
            className={`body-regular cursor-pointer px-large py-medium ${
              inputValue && index === matchingOptionIndex
                ? 'bg-Background-Secondary'
                : ''
            } hover:bg-Background-Secondary`}
            onMouseDown={() => handleOptionClick(option)}
          >
            {optionToString(option)}
          </li>
        ))}
      </ul>
    ),
    [
      options,
      inputValue,
      matchingOptionIndex,
      optionToString,
      handleOptionClick,
    ]
  );

  return (
    <div className="relative flex w-full flex-col gap-tiny">
      {useFloating ? (
        <DropdownWrapper
          isOpen={isFocused && options.length > 0}
          dropdownContent={dropdownContent}
        >
          {renderInput()}
        </DropdownWrapper>
      ) : (
        <>
          {renderInput()}
          {isFocused && options.length > 0 && dropdownContent}
        </>
      )}
      {errorMessage && (
        <Typography variant="info/caption" color={colors['Negative-500']}>
          {errorMessage}
        </Typography>
      )}
    </div>
  );
}
