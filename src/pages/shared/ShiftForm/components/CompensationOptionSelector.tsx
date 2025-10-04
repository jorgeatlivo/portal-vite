import { memo, useCallback, useMemo } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { IconSquare, IconSquareCheckFilled } from '@tabler/icons-react';
import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';

import colors from '@/config/color-palette';

interface CompensationOption {
  value: string;
  displayText: string;
}

interface CompensationOptionItemProps {
  option: CompensationOption;
  isSelected: boolean;
  disabled: boolean;
  onToggle: (value: string) => void;
  icons: {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
  };
  checkboxSx: Record<string, any>;
}

const CompensationOptionItem = memo(
  ({
    option,
    isSelected,
    disabled,
    onToggle,
    icons,
    checkboxSx,
  }: CompensationOptionItemProps) => (
    <FormControlLabel
      labelPlacement="start"
      control={
        <Checkbox
          checked={isSelected}
          disabled={disabled}
          checkedIcon={icons.checked}
          icon={icons.unchecked}
          onChange={() => onToggle(option.value)}
          sx={checkboxSx}
        />
      }
      label={
        <Typography
          variant="body/regular"
          className={clsx({
            'text-Grey-400': disabled,
          })}
        >
          {option.displayText}
        </Typography>
      }
      className={clsx(
        '!m-0 flex w-full items-center justify-between rounded-lg !py-2 !pl-2',
        {
          'cursor-not-allowed': disabled,
          'cursor-pointer': !disabled,
        }
      )}
    />
  )
);

CompensationOptionItem.displayName = 'CompensationOptionItem';

interface CompensationOptionListProps {
  compensationOptions: CompensationOption[];
  selected: string[];
  disabled: boolean;
  onToggle: (value: string) => void;
  icons: {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
  };
  checkboxSx: Record<string, any>;
}

const CompensationOptionList = memo(
  ({
    compensationOptions,
    selected,
    disabled,
    onToggle,
    icons,
    checkboxSx,
  }: CompensationOptionListProps) => {
    // Use Set for O(1) lookup instead of O(n) with includes()
    const selectedSet = useMemo(() => new Set(selected), [selected]);

    return (
      <Box
        className={clsx(
          'grid w-full grid-cols-3 gap-x-8 self-start rounded-[8px] border border-solid border-Divider-Subtle p-medium',
          {
            'bg-Grey-50 opacity-60': disabled,
          }
        )}
      >
        {compensationOptions.map((option) => {
          const isSelected = selectedSet.has(option.value);
          return (
            <CompensationOptionItem
              key={`compensation-${option.value}`}
              option={option}
              isSelected={isSelected}
              disabled={disabled}
              onToggle={onToggle}
              icons={icons}
              checkboxSx={checkboxSx}
            />
          );
        })}
      </Box>
    );
  }
);

CompensationOptionList.displayName = 'CompensationOptionList';

interface CompensationOptionSelectorProps<T extends FieldValues> {
  compensationOptions: CompensationOption[];
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
}

export const CompensationOptionSelector = <T extends FieldValues>({
  compensationOptions,
  name,
  control,
  disabled = false,
}: CompensationOptionSelectorProps<T>) => {
  const { t } = useTranslation('publish-shift');

  // Memoize icons to avoid re-creating them on every render
  const icons = useMemo(
    () => ({
      checked: <IconSquareCheckFilled className="animate-zoomIn" size={24} />,
      unchecked: <IconSquare className="animate-zoomIn" size={24} />,
    }),
    []
  );

  // Memoize checkbox sx styles to avoid re-creating object
  const checkboxSx = useMemo(
    () => ({
      color: '#9CA3AF',
      '&.Mui-checked': { color: colors['Primary-500'] },
      '&.Mui-disabled': { color: '#D1D5DB' },
    }),
    []
  );

  // Memoize toggleOption to prevent unnecessary re-renders
  const createToggleOption = useCallback(
    (field: any, selected: string[]) => (value: string) => {
      if (disabled) return;

      if (selected.includes(value)) {
        field.onChange(selected.filter((v: string) => v !== value));
      } else {
        field.onChange([...selected, value]);
      }
    },
    [disabled]
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selected: string[] = field.value || [];
        const toggleOption = createToggleOption(field, selected);

        return (
          <div className="flex flex-1 flex-col gap-4">
            <Typography
              variant="subtitle/regular"
              className={clsx('mb-tiny', {
                'text-Grey-400': disabled,
              })}
            >
              {t('compensation_option_label')}
            </Typography>
            <CompensationOptionList
              compensationOptions={compensationOptions}
              selected={selected}
              disabled={disabled}
              onToggle={toggleOption}
              icons={icons}
              checkboxSx={checkboxSx}
            />
          </div>
        );
      }}
    />
  );
};
