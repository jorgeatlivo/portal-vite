import { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';

import { ModalContainer } from './ModalContainer';
import { MultiSelectItem } from './MultiSelectItem';

interface MultiSelectModalProps {
  goBack: () => void;
  onSubmit: (selectedOptions: string[]) => void;
  isOpen: boolean;
  title: string;
  loading?: boolean;
  options: {
    label: string;
    value: string;
  }[];
  goBackText: string;
  buttonText: string;
  initialSelection?: string[];
}

export const MultiSelectModal: React.FC<MultiSelectModalProps> = ({
  goBack,
  onSubmit,
  isOpen,
  title,
  loading,
  options,
  goBackText,
  buttonText,
  initialSelection = [],
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(initialSelection);

  const handleGoBack = () => {
    setSelectedOptions([]);
    goBack();
  };

  const validSelectedOption = selectedOptions.length > 0;

  useEffect(() => {
    setSelectedOptions(initialSelection);
  }, [initialSelection]);

  return (
    <ModalContainer isOpen={isOpen} onClose={handleGoBack}>
      <div className="w-[410px] rounded-[16px] bg-white shadow-custom ">
        <div className="p-medium">
          <p className="heading-md mb-large">{title}</p>
          <div className="p-y-large flex flex-col ">
            <div className="no-scrollbar max-h-[450px] overflow-y-scroll">
              {!loading ? (
                options.map((option, index) => (
                  <div className="flex w-full flex-col p-small">
                    <MultiSelectItem
                      key={index}
                      option={option.label}
                      onClick={() => {
                        const updatedSelection = [...selectedOptions];
                        if (updatedSelection.includes(option.value)) {
                          const index = updatedSelection.indexOf(option.value);
                          updatedSelection.splice(index, 1);
                        } else {
                          updatedSelection.push(option.value);
                        }
                        setSelectedOptions(updatedSelection);
                      }}
                      checked={selectedOptions.includes(option.value)}
                    />
                  </div>
                ))
              ) : (
                <div className="flex w-full flex-col p-small">
                  <CircularProgress />
                </div>
              )}
            </div>
          </div>
          <div className="mt-large flex flex-row items-center">
            <button
              type="button"
              onClick={() => handleGoBack()}
              className="flex flex-1 items-center justify-center px-small py-large  text-center text-Primary-500"
            >
              <p className="action-regular w-full">{goBackText}</p>
            </button>

            <button
              type="button"
              className={`flex flex-1 rounded-[100px] px-small py-large text-center ${
                validSelectedOption
                  ? 'bg-Primary-500 text-Text-Inverse'
                  : 'bg-Background-Secondary text-Text-Subtle'
              }`}
              disabled={!validSelectedOption}
              onClick={() => onSubmit(selectedOptions)}
            >
              <p className="action-regular w-full">{buttonText}</p>
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
