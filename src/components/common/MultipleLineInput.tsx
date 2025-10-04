import React, { useEffect, useRef } from 'react';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface MultipleLineInputProps {
  setInputValue: (value: string) => void;
  inputValue: string;
  placeHolder?: string;
  errorMessage?: string;
  callToActionIcon?: string;
}

export const MultipleLineInput: React.FC<MultipleLineInputProps> = ({
  setInputValue,
  inputValue,
  placeHolder,
  errorMessage,
  callToActionIcon,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      // Reset the height to auto to calculate the scrollHeight correctly
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM updates are complete
    requestAnimationFrame(() => {
      adjustHeight();
    });

    // Create and observe the parent container size changes
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        adjustHeight();
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Clean up the observer on unmount
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [inputValue]); // Trigger whenever input value changes

  return (
    <div ref={containerRef} className="flex w-full flex-col">
      <div
        className={`ring-solid box-border flex w-full flex-row items-start justify-start space-x-small self-start rounded-[8px] bg-white p-small ring-1
                    ${errorMessage ? 'ring-2 ring-red-500' : 'ring-Divider-Subtle'} focus-within:ring-2 focus-within:ring-Action-Secondary`}
      >
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputValue}
          className="body-regular placeholder:body-regular w-full resize-none overflow-y-hidden placeholder:text-Text-Subtle focus:outline-none"
          placeholder={placeHolder}
        />
        {callToActionIcon && (
          <div className="items-center justify-center">
            <LivoIcon
              size={24}
              name={callToActionIcon}
              color={colors['Primary-500']}
            />
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="info-caption mt-tiny text-Negative-500">{errorMessage}</p>
      )}
    </div>
  );
};
