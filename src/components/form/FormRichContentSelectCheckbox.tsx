import { useCallback } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Box, ClickAwayListener, Popper } from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import clsx from 'clsx';

import {
  AnimatedPaper,
  useAnimatedPaper,
} from '@/components/common/animation/AnimatedPaper';
import DialogConfirmButtons from '@/components/common/buttons/DialogConfirmButtons';
import ChipWithTooltip from '@/components/common/ChipWithTooltip';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import SelectCheckbox, { Option, OTHER_PREFIX } from './SelectCheckbox';

type FormSelectCheckBoxProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  multiple?: boolean;
  options: Option[];
  placeholder?: string;
  label?: string;
  enableOtherSelect?: boolean;
  required?: boolean;
};

// Function to remove the "other:" prefix if present
const removeOtherPrefix = (value: string) => {
  if (value.startsWith(OTHER_PREFIX)) {
    // first is prefix, second is id, thỉd is checked status, then rest is value
    const [, , , ...displayValue] = value.split(':');
    return displayValue.join(':');
  }

  return value;
};

function FormRichContentSelectCheckbox<T extends FieldValues>({
  control,
  name,
  multiple = false,
  options,
  placeholder,
  enableOtherSelect,
}: FormSelectCheckBoxProps<T>) {
  const { t } = useTranslation('form');
  const { anchorRef, open, transitioning, handleClose, toggleOpenClose } =
    useAnimatedPaper<HTMLElement>();

  const renderCheckboxLabel = useCallback((option: Option) => {
    return (
      <ChipWithTooltip
        trimLength={100}
        label={option.label}
        className="bg-Neutral-200 px-2 py-0.5 text-Grey-900"
        icon={
          option?.icon ? (
            <LivoIcon
              name={option.icon}
              size={16}
              color={colors['Text-Subtle']}
            />
          ) : undefined
        }
      />
    );
  }, []);

  const renderChips = (
    selectedValues: string[],
    handleDeleteChip: (val: string) => void
  ) => {
    if (multiple) {
      return selectedValues?.length > 1
        ? selectedValues
            .map((val) => {
              const opt = options.find((o) => o.value === val);

              if (val.startsWith(OTHER_PREFIX)) {
                const [, , checked, ...value] = val.split(':');
                if (checked !== 'true') return null;
                if (value.join(':') === '') return null;
              }

              return (
                <ChipWithTooltip
                  key={`form-rich-select-${name}-value-${val}`}
                  label={opt ? opt.label : removeOtherPrefix(val)}
                  className="bg-Neutral-200 text-Grey-900"
                  trimLength={20}
                  style={{
                    maxWidth: '100%',
                    flexShrink: 0,
                    minWidth: 'fit-content',
                  }}
                  icon={
                    opt?.icon ? (
                      <div className="flex size-6 items-center justify-center">
                        <LivoIcon
                          name={opt.icon}
                          size={16}
                          color={colors['Text-Subtle']}
                        />
                      </div>
                    ) : undefined
                  }
                  onDelete={() => handleDeleteChip(val)}
                />
              );
            })
            .filter((predicate) => !!predicate)
        : null;
    } else {
      const opt = options.find((opt) => opt.value === selectedValues[0]);
      return (
        selectedValues.length > 0 && (
          <ChipWithTooltip
            className="mx-2 bg-Neutral-200 text-Grey-900"
            label={opt ? opt.label : removeOtherPrefix(selectedValues[0])}
            onDelete={() => handleDeleteChip(selectedValues[0])}
          />
        )
      );
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Ensure value is an array of strings (if multiple selection is enabled)
        const selectedValues = Array.isArray(value) ? (value as string[]) : [];
        const handleCheckBoxChange = (vals: string[]) => {
          onChange(vals);
        };

        // Function to delete a chip
        const handleDeleteChip = (val: string) => {
          onChange(selectedValues.filter((item) => item !== val));
        };

        return (
          <div className={`relative mb-4 w-full`}>
            <Box
              onClick={toggleOpenClose}
              ref={anchorRef}
              className={clsx(
                'w-full rounded-xl border bg-white p-2 shadow-sm transition-all',
                error
                  ? 'border-red-500'
                  : 'border-[#808080]  focus-within:border-2 hover:border-Grey-950'
              )}
              sx={{
                minHeight: 57,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                cursor: 'pointer',
              }}
            >
              <div className="space-between flex size-full flex-row">
                <div className="flex flex-row flex-wrap gap-2 py-1 pl-1">
                  {selectedValues.length > 1 ? (
                    renderChips(selectedValues, handleDeleteChip)
                  ) : (
                    <span className="text-[#888]">{placeholder}</span>
                  )}
                </div>

                {/* Chevron Icon */}
                <Box className="ml-auto flex items-center pr-1">
                  {open ? (
                    <IconChevronUp size={20} color={colors['Text-Subtle']} />
                  ) : (
                    <IconChevronDown size={20} color={colors['Text-Subtle']} />
                  )}
                </Box>
              </div>
            </Box>

            <Popper
              open={open}
              anchorEl={anchorRef.current}
              placement="bottom-start"
              sx={{ zIndex: 9999 }}
              modifiers={[
                {
                  name: 'preventOverflow',
                  enabled: true,
                  options: {
                    altAxis: true,
                    altBoundary: true,
                    tether: true,
                    rootBoundary: 'document',
                    padding: 8,
                  },
                },
              ]}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <AnimatedPaper
                  className={clsx(
                    open && !transitioning ? 'popper-enter' : 'popper-exit',
                    '!min-w-72 p-4'
                  )}
                >
                  <SelectCheckbox
                    enableOtherSelect={enableOtherSelect}
                    multiple={multiple}
                    values={selectedValues}
                    onChange={handleCheckBoxChange}
                    options={options}
                    renderLabel={renderCheckboxLabel}
                  />
                  <DialogConfirmButtons
                    buttons={[
                      {
                        label: t('clear'),
                        onClick: () => {
                          handleCheckBoxChange([]);
                        },
                      },
                      {
                        label: t('close'),
                        onClick: handleClose,
                      },
                    ]}
                  />
                </AnimatedPaper>
              </ClickAwayListener>
            </Popper>
          </div>
        );
      }}
    />
  );
}

export default FormRichContentSelectCheckbox;
