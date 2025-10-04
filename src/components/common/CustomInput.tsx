import { useState } from 'react';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  setValue: (time: string) => void;
  selectedValue: string;
  onValueBlur?: (value: string) => void;
  iconName?: string;
  placeHolder?: string;
  errorMessage?: string;
  endingLabel?: string;
  inputType?: string;
  inputStyle?: any;
  hasChanged?: boolean;
  callToActionIcon?: string;
  label?: string;
  isLoading?: boolean;
  compact?: boolean;
}

function sanitizeNumericInput(input: string): string {
  let cleaned = input.replace(/[^\d.,]/g, '');

  // 2. Keep only the first separator (dot or comma), remove others
  const firstSepMatch = cleaned.match(/[.,]/);
  if (firstSepMatch) {
    const sep = firstSepMatch[0];
    let seen = false;
    cleaned = cleaned
      .split('')
      .filter((char) => {
        if (char === '.' || char === ',') {
          if (char !== sep) return false; // remove other type
          if (seen) return false; // remove duplicates
          seen = true;
        }
        return true;
      })
      .join('');
  }

  // 3. Remove leading zeros unless followed by '.' or ','
  if (
    cleaned.length > 1 &&
    cleaned.startsWith('0') &&
    !/[.,]/.test(cleaned[1])
  ) {
    cleaned =
      cleaned.slice(0, 2) === '00'
        ? cleaned.replace(/^00+/, '0')
        : cleaned.replace(/^0+/, '');
  }

  return cleaned;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  compact,
  setValue,
  selectedValue,
  onValueBlur,
  iconName,
  placeHolder,
  errorMessage,
  endingLabel,
  inputType,
  inputStyle,
  callToActionIcon,
  hasChanged,
  label,
  isLoading,
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(
      inputType === 'number'
        ? sanitizeNumericInput(e.target.value)
        : e.target.value
    );

  const handleInputBlur = () => {
    setIsFocused(false);
    onValueBlur?.(selectedValue);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className="relative flex flex-col">
      {label && selectedValue && selectedValue !== '' ? (
        <div className="absolute -top-small left-small rounded-md bg-white px-tiny">
          <p className="info-overline text-Text-Subtle">{label}</p>
        </div>
      ) : null}
      <div
        className={`ring-solid shrink-1 box-border flex w-full flex-row items-center justify-start space-x-small rounded-[8px] bg-white px-small ${compact ? 'py-small' : 'py-medium'} ring-1
                        ${errorMessage ? 'ring-2 ring-red-500' : 'ring-Divider-Subtle focus-within:ring-2 focus-within:ring-Primary-500'} `}
      >
        {hasChanged && !isFocused ? (
          <div className="size-small rounded-full bg-Primary-500" />
        ) : null}
        {iconName && (
          <div className="items-center justify-center">
            <LivoIcon
              name={iconName}
              size={24}
              color={colors[isFocused ? 'Primary-500' : 'Grey-400']}
            />
          </div>
        )}
        <input
          value={selectedValue}
          onChange={handleInputValue}
          onBlur={handleInputBlur}
          disabled={disabled}
          className="body-regular placeholder:body-regular w-full placeholder:text-Text-Subtle focus:outline-none disabled:bg-white disabled:text-Text-Light"
          placeholder={placeHolder}
          onFocus={handleInputFocus}
          style={inputStyle}
          {...props}
        />
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="size-large animate-spin rounded-full border-2 border-Primary-500 border-t-transparent" />
          </div>
        ) : null}
        {endingLabel ? (
          <p className="body-regular ml-small text-Text-Subtle">
            {endingLabel}
          </p>
        ) : null}
        {callToActionIcon && (
          <div className="items-center justify-center">
            <LivoIcon
              name={callToActionIcon}
              size={24}
              color={colors['Primary-500']}
            />
          </div>
        )}
      </div>
      {errorMessage ? (
        <p className="info-caption mt-tiny text-Negative-500">{errorMessage}</p>
      ) : null}
    </div>
  );
};
