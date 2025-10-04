// components/ProFilterComponent.tsx
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconHeartFilled, IconUserCircle } from '@tabler/icons-react';

import { PortalProfessionalSearchVo } from '@/services/professionals';

import { DropdownWrapper } from './DropdownWrapper';
import { TagLabel } from './TagLabel';

interface Props {
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  professionals: PortalProfessionalSearchVo[];
  isLoading: boolean;
  onSelect: (professional: PortalProfessionalSearchVo) => void;
  selectedProfessionals: PortalProfessionalSearchVo[];
  onClearSelection: () => void;
  onRemoveProfessional: (professional: PortalProfessionalSearchVo) => void;
}

export function ProFilterComponent({
  title,
  placeholder,
  value,
  onChange,
  professionals,
  isLoading,
  onSelect,
  selectedProfessionals,
  onClearSelection,
  onRemoveProfessional,
}: Props) {
  const { t } = useTranslation('shift-claim-list');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const dropdownContent = (
    <ul
      role="listbox"
      className="mt-2 max-h-60 w-full overflow-auto rounded-[8px] border border-Divider-Default bg-white shadow-lg"
    >
      {isLoading ? (
        <li className="body-regular px-large py-medium text-Text-Subtle">
          {t('loading_professionals')}
        </li>
      ) : (
        professionals.map((pro) => (
          <li
            key={pro.id}
            role="option"
            className="body-regular cursor-pointer px-large py-medium hover:bg-Background-Secondary"
            onMouseDown={() => {
              onChange('');
              setIsFocused(false);
              onSelect(pro);
            }}
          >
            <div className="flex items-center space-x-small">
              {pro.avatarUrl ? (
                <img
                  src={pro.avatarUrl}
                  alt={pro.name}
                  className="size-14 rounded-lg object-cover"
                />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-lg bg-Background-Secondary">
                  <IconUserCircle className="size-10 text-Text-Subtle" />
                </div>
              )}
              <div className="flex flex-col">
                <span>{pro.name}</span>
                {pro.favorite && (
                  <div className="flex items-center space-x-tiny">
                    <IconHeartFilled className="size-4 text-red-400" />
                    <span className="text-sm">Favorite</span>
                  </div>
                )}
                <span className="text-sm text-Text-Subtle">
                  {t('completed_shifts', {
                    count: pro.completedShiftsInFacility,
                  })}
                </span>
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );

  return (
    <div className="relative mb-medium">
      <div className="mb-2 flex flex-row justify-between">
        <h1 className="subtitle-regular">{title}</h1>
        {selectedProfessionals.length > 0 && (
          <button
            onClick={onClearSelection}
            className="cursor-pointer text-Primary-500"
          >
            {t('clean_filter_label')}
          </button>
        )}
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedProfessionals.map((professional) => (
          <TagLabel
            key={professional.id}
            text={professional.name}
            onRemove={() => onRemoveProfessional(professional)}
          />
        ))}
      </div>
      <div className="relative flex w-full flex-col">
        <DropdownWrapper
          isOpen={isFocused && (isLoading || professionals.length > 0)}
          dropdownContent={dropdownContent}
        >
          <div className="ring-solid box-border flex w-full items-center rounded-lg border border-gray-300 px-small py-medium focus-within:ring-2 focus-within:ring-Action-Secondary">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="body-regular placeholder:body-regular flex-1 bg-transparent placeholder:text-Text-Subtle focus:outline-none"
              placeholder={placeholder}
              aria-label="Search professionals"
              role="combobox"
              aria-expanded={isFocused}
            />
          </div>
        </DropdownWrapper>
      </div>
    </div>
  );
}
