import React from 'react';
import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IconBlockquote } from '@tabler/icons-react';

import { PublishShiftMultipleLineInput } from '@/pages/shared/ShiftForm/components/PublishShiftMultipleLineInput';
import { ShiftFormData } from '@/pages/shared/ShiftForm/config/shift-form.config';

interface FormDetailsProps {
  control: Control<ShiftFormData>;
  disabled?: boolean;
}

function FormDetails({ control, disabled = false }: FormDetailsProps) {
  const { t } = useTranslation(['publish-shift', 'edit-shift']);

  return (
    <div className="flex items-start justify-center space-x-medium py-medium">
      <PublishShiftMultipleLineInput
        name={'details'}
        control={control}
        placeHolder={t('detail_input_placeholder')}
        label={t('detail_input_label')}
        disabled={disabled}
        icon={
          <div className="flex min-h-24 flex-col">
            <IconBlockquote size={24} className="text-Neutral-400" />
          </div>
        }
      />
    </div>
  );
}

export default FormDetails;
