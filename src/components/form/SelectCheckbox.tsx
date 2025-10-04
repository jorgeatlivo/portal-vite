import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
import { IconSquare, IconSquareCheckFilled } from '@tabler/icons-react';
import clsx from 'clsx';
import { uniqBy } from 'lodash-es';

import LivoIcon from '@/components/common/LivoIcon';

import { uuidv4 } from '@/utils/utils';

import colors from '@/config/color-palette';

export type Option = {
  value: string;
  label: string;
  icon?: string;
};

type SelectCheckboxProps = {
  multiple?: boolean;
  values: string[];
  onChange: (vals: string[]) => void;
  options: Option[];
  enableOtherSelect?: boolean;
  renderLabel?: (option: Option, checked: boolean) => React.ReactNode;
};

// Constant for the Other option prefix
export const OTHER_PREFIX = 'other:';

const SelectCheckbox: React.FC<SelectCheckboxProps> = ({
  multiple = false,
  values,
  onChange,
  options,
  enableOtherSelect = false,
  renderLabel,
}) => {
  const { t } = useTranslation('form');
  const otherValues = useMemo(() => {
    const others = values.filter((val) => val.startsWith(OTHER_PREFIX));
    if (others.length === 0 && enableOtherSelect) {
      return [`${OTHER_PREFIX}${uuidv4()}`];
    }
    return others;
  }, [values, enableOtherSelect]);

  // Handle checkbox change for regular options.
  const handleCheckboxChange = (optionValue: string) => {
    if (multiple) {
      if (values.includes(optionValue)) {
        onChange(values.filter((v) => v !== optionValue));
      } else {
        onChange([...values, optionValue]);
      }
    } else {
      if (values.includes(optionValue)) {
        onChange([]);
      } else {
        onChange([optionValue]);
      }
    }
  };

  /**
   * Toggle an Other option checkbox.
   */
  const handleOtherCheckboxChange = (id: string) => {
    const currentOtherIndex = values.findIndex((value) => value.includes(id));
    const currentOther = values[currentOtherIndex];
    if (currentOtherIndex < 0 || !currentOther) return;

    /**
     * handle update checked using regex
     * regex should include other prefix, id, and checked status
     */
    const newOther = currentOther.replace(
      new RegExp(`(${OTHER_PREFIX}${id}:)(false|true)`),
      (match, prefix, checked) => {
        return `${prefix}${!(checked === 'true')}`;
      }
    );

    const newValues = [...values];
    newValues[currentOtherIndex] = newOther;
    onChange(newValues);
  };

  const handleOtherTextChange = useCallback(
    (id: string, index: number, text: string) => {
      const isLastItem = index === otherValues.length - 1;

      const currentOtherIndex = values.findIndex((value) =>
        value.startsWith(`${OTHER_PREFIX}${id}`)
      );

      if (currentOtherIndex < 0) return;

      /**
       * handle update value using regex
       */
      const newOther = values[currentOtherIndex].replace(
        new RegExp(`(${OTHER_PREFIX}${id}:)(true|false):.*`),
        `$1${!!text}:${text}`
      );
      const newValues = [...values];
      newValues[currentOtherIndex] = newOther;

      /** add new item */
      if (isLastItem && text) {
        const newId = uuidv4();
        newValues.push(`${OTHER_PREFIX}${newId}:false:`);
      }

      onChange(newValues);
    },
    [onChange, otherValues, values]
  );

  // Add a new Other option input.

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <FormGroup sx={{ width: '100%' }}>
        {uniqBy(options, 'value').map((option) => {
          const checked = values.includes(option.value);
          const label = renderLabel ? (
            renderLabel(option, checked)
          ) : (
            <CheckBoxDefaultLabel option={option} checked={checked} />
          );

          return (
            <FormControlLabel
              key={`checkbox-${option.value}`}
              control={
                <Checkbox
                  checked={checked}
                  checkedIcon={
                    <IconSquareCheckFilled
                      className="animate-zoomIn"
                      size={24}
                    />
                  }
                  icon={<IconSquare className="animate-zoomIn" size={24} />}
                  onChange={() => handleCheckboxChange(option.value)}
                  sx={{
                    color: '#9CA3AF',
                    '&.Mui-checked': { color: colors['Primary-500'] },
                  }}
                />
              }
              label={label}
            />
          );
        })}

        {/* Render multiple Other options if enableOtherSelect is true */}
        {enableOtherSelect && (
          <div className="flex flex-col gap-2">
            {otherValues.map((other, index) => {
              const [, id, _checked, ..._values] = other.split(':');
              const textValue = _values.join(':');
              const checked = _checked === 'true';

              return (
                <div key={`other-${id}`} className="flex items-center gap-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        checkedIcon={
                          <IconSquareCheckFilled
                            className="animate-zoomIn"
                            size={24}
                          />
                        }
                        icon={
                          <IconSquare className="animate-zoomIn" size={24} />
                        }
                        onChange={() => handleOtherCheckboxChange(id)}
                        sx={{
                          color: '#9CA3AF',
                          '&.Mui-checked': { color: colors['Primary-500'] },
                        }}
                      />
                    }
                    label={
                      <Typography
                        className={clsx(
                          'text-gray-500',
                          checked && 'font-medium text-gray-900'
                        )}
                      >
                        {t('other')}
                      </Typography>
                    }
                  />
                  <TextField
                    defaultValue={textValue}
                    onChange={(e) =>
                      handleOtherTextChange(id, index, e.target.value)
                    }
                    placeholder={t('select_placeholder')}
                    variant="outlined"
                    size="small"
                    sx={{ width: '90%' }}
                    // autoFocus={index === otherIds.length - 1} // Auto-focus on new input
                  />
                </div>
              );
            })}
          </div>
        )}
      </FormGroup>
    </FormControl>
  );
};

const CheckBoxDefaultLabel = ({
  option,
  checked,
}: {
  option: Option;
  checked: boolean;
}) => {
  return (
    <div className="flex items-center gap-2">
      {option.icon && (
        <LivoIcon name={option.icon} size={16} color={colors['Text-Subtle']} />
      )}
      <Typography
        className={clsx(
          checked ? 'font-medium text-Text-Default' : 'text-gray-500'
        )}
      >
        {option.label}
      </Typography>
    </div>
  );
};

export default memo(SelectCheckbox);
