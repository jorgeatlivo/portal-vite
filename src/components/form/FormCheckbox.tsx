import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { Checkbox, FormControlLabel } from '@mui/material';
import { IconSquare, IconSquareCheckFilled } from '@tabler/icons-react';

import colors from '@/config/color-palette';

type FormCheckboxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
};

const FormCheckbox = <T extends FieldValues>({
  control,
  name,
  label,
}: FormCheckboxProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <FormControlLabel
            key={`checkbox-${field.value}`}
            control={
              <Checkbox
                checked={field.value}
                checkedIcon={
                  <IconSquareCheckFilled className="animate-zoomIn" size={24} />
                }
                icon={<IconSquare className="animate-zoomIn" size={24} />}
                onChange={field.onChange}
                sx={{
                  color: '#9CA3AF',
                  '&.Mui-checked': { color: colors['Primary-500'] },
                }}
              />
            }
            label={label}
          />

          {fieldState.error && (
            <p className="info-caption mb-tiny text-Negative-500">
              {fieldState.error.message}
            </p>
          )}
        </>
      )}
    />
  );
};

export default FormCheckbox;
