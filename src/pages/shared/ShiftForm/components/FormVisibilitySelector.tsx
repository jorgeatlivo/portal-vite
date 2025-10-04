import { Control, Controller, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';

import { VisibilityItem } from '@/pages/shared/ShiftForm/components/VisibitiliyItem';
import { ShiftFormData } from '@/pages/shared/ShiftForm/config/shift-form.config';
import { ShiftModalityEnum } from '@/types';

interface FormVisibilitySelectorProps {
  name: FieldPath<ShiftFormData>;
  control: Control<ShiftFormData>;
  icon: ShiftModalityEnum;
  disabled?: boolean;
}

function FormVisibilitySelector({
  name,
  control,
  icon,
  disabled = false,
}: FormVisibilitySelectorProps) {
  const { t } = useTranslation('publish-shift');
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <div className="w-full">
            <VisibilityItem
              isSelected={!!value}
              onPress={onChange}
              modality={icon}
              disabled={disabled}
            />
            {!!error?.message && (
              <Typography
                variant="input/label"
                className="ml-2 mt-1 !text-Action-Notification"
                role="alert"
              >
                {t(error.message as never)}
              </Typography>
            )}
          </div>
        );
      }}
    />
  );
}

export default FormVisibilitySelector;
