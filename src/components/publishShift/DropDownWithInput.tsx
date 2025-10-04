import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { InputAdornment, TextField } from '@mui/material';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { NotificationsBadge } from '../common/NotificationsBadge';

type Option = {
  id: string;
  name: string;
  counter?: number;
};

interface DropDownWithInputProps {
  setOptionId: (id: string) => void;
  selectedOptionId: string;
  placeHolder?: string;
  errorMessage?: string;
  options?: Option[];
  disabled?: boolean;
  autoFocus?: boolean;
  hasChanged?: boolean;
  callToActionIcon?: string;
  iconColor?: string;
  label?: string;
  searchLabel?: string;
  style?: CSSProperties;
  noOutline?: boolean;
}

export const DropDownWithInput: React.FC<DropDownWithInputProps> = ({
  setOptionId,
  selectedOptionId,
  placeHolder,
  errorMessage,
  options = [],
  disabled,
  autoFocus,
  hasChanged,
  searchLabel,
  iconColor = colors['Primary-500'],
  callToActionIcon,
  noOutline,
  label,
  style,
}) => {
  const selectedOptionName =
    options.find((option) => option.id === selectedOptionId)?.name || '';

  const [searchInput, setSearchInput] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matchingOptionIndex = options.findIndex((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    setInputValue(selectedOptionName);
  }, [selectedOptionName]);

  useEffect(() => {
    if (
      isFocused &&
      inputValue &&
      dropdownRef.current &&
      matchingOptionIndex !== -1
    ) {
      const matchingOptionElement = dropdownRef.current.children[
        matchingOptionIndex
      ] as HTMLLIElement;
      matchingOptionElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [inputValue, isFocused, options, matchingOptionIndex]);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleOptionClick = (option: Option) => {
    setOptionId(option.id);
    if (!searchLabel) {
      setInputValue('');
    }
    setIsFocused(false);
  };

  const handleInputBlur = useCallback(() => {
    requestAnimationFrame(() => {
      // Check if the new focused element is inside the dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(document.activeElement)
      ) {
        setIsFocused(false);
        !searchLabel && setInputValue('');
      }
    });
  }, [searchLabel]);

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && matchingOptionIndex !== -1) {
      e.preventDefault();
      const matchingOption = options[matchingOptionIndex];
      setOptionId(matchingOption.id);
      setInputValue('');
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative flex w-full flex-col">
      {label && selectedOptionId && selectedOptionId !== '' ? (
        <div className="absolute -top-small left-small rounded-md bg-white px-tiny">
          <p className="info-overline text-Text-Subtle">{label}</p>
        </div>
      ) : null}
      <div
        style={style}
        onClick={() => inputRef.current?.focus()}
        className={`ring-solid box-border flex flex-row items-center justify-start space-x-small rounded-[8px] px-small ${!disabled ? 'bg-white' : 'bg-Background-Secondary'} shrink-1
                    ${errorMessage ? ' ring-red-500' : 'ring-Divider-Subtle'} focus-within:ring-2 focus-within:ring-Action-Secondary ${noOutline ? ' ' : errorMessage ? ' py-medium ring-2' : 'py-medium ring-1'}`}
      >
        {hasChanged && !isFocused ? (
          <div className="size-small rounded-full bg-Primary-500" />
        ) : null}
        <input
          ref={inputRef}
          disabled={disabled}
          type="text"
          readOnly={!!searchLabel}
          value={isFocused ? inputValue : selectedOptionName}
          onChange={handleInputValue}
          onBlur={handleInputBlur}
          className={`body-regular placeholder:body-regular w-full text-ellipsis bg-transparent placeholder:text-Text-Subtle focus:outline-none ${searchLabel ? 'cursor-pointer' : ''}`}
          placeholder={placeHolder}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyPress}
          autoFocus={autoFocus}
          style={style}
        />
        {callToActionIcon ? (
          <div className="items-center justify-center">
            <LivoIcon name={callToActionIcon} size={24} color={iconColor} />
          </div>
        ) : null}
      </div>
      {isFocused && options.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full z-10 mt-small w-full rounded-[8px] border border-Divider-Default bg-white"
          style={{
            boxShadow:
              '0px 1px 4px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.20), 0px 2px 8px 0px rgba(0, 0, 0, 0.15)',
          }}
        >
          {searchLabel && (
            <TextField
              value={searchInput}
              placeholder={searchLabel}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LivoIcon
                      name={'search'}
                      size={16}
                      color={colors['Grey-400']}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchInput ? (
                  <InputAdornment
                    position="end"
                    onClick={() => setSearchInput('')}
                  >
                    <div className="">
                      <LivoIcon
                        name={'close'}
                        size={16}
                        color={colors['Grey-400']}
                      />
                    </div>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                width: '100%',
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#888',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '8px',
                  paddingHorizontal: '12px',
                },
              }}
            />
          )}
          <ul className="max-h-80 w-full overflow-auto">
            {options.map((option, index) =>
              !searchLabel ||
              option.name.toLowerCase().includes(searchInput.toLowerCase()) ? (
                <li
                  key={option.id}
                  className={`body-regular flex cursor-pointer flex-row items-start justify-between px-large py-medium ${inputValue && index === matchingOptionIndex ? 'bg-Background-Secondary' : ''} hover:bg-Background-Secondary`}
                  onMouseDown={() => handleOptionClick(option)}
                >
                  <span>{option.name}</span>
                  {!!option.counter ? (
                    <NotificationsBadge notifications={option.counter} />
                  ) : null}
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}
      {errorMessage && (
        <p className="info-caption mt-tiny text-Negative-500">{errorMessage}</p>
      )}
    </div>
  );
};
