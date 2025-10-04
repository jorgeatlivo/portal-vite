import { useMemo } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { day } from '@/utils/datetime';

import { ShiftFormData } from '@/pages/shared/ShiftForm/config/shift-form.config';

type LabelProps = {
  control: Control<ShiftFormData>;
  isEditing?: boolean;
};

export const SummaryLabel = ({ control, isEditing }: LabelProps) => {
  const { t } = useTranslation(['publish-shift', 'edit-shift']);
  const recurrentDates = useWatch({
    control,
    name: 'dates',
  });

  const startTime = useWatch({
    control,
    name: 'startTime',
  });

  const labels = useMemo(() => {
    const sortedRecurrentDates = recurrentDates.sort((a, b) =>
      day(a).diff(day(b))
    );

    if (sortedRecurrentDates.length > 1) {
      return (isEditing?: boolean) => {
        return isEditing
          ? t('edit-shift:edit_multiple_shifts_summary_header', {
              numberOfShifts: sortedRecurrentDates.length,
              startDate: day(sortedRecurrentDates[0]).format('DD/MM/YYYY'),
              endDate: day(
                recurrentDates[sortedRecurrentDates.length - 1]
              ).format('DD/MM/YYYY'),
            })
          : t('publish_multiple_shifts_summary_header', {
              numberOfShifts: sortedRecurrentDates.length,
              startDate: day(sortedRecurrentDates[0]).format('DD/MM/YYYY'),
              endDate: day(
                recurrentDates[sortedRecurrentDates.length - 1]
              ).format('DD/MM/YYYY'),
            });
      };
    }

    return (isEditing?: boolean) => {
      return isEditing
        ? t('edit-shift:edit_single_shift_summary_header', {
            date: day(startTime),
          })
        : t('publish_single_shift_summary_header', {
            date: day(startTime).format('DD/MM/YYYY'),
          });
    };
  }, [recurrentDates, startTime, t]);

  return <>{labels(isEditing)}</>;
};

export const SubmitLabel = ({ control, isEditing }: LabelProps) => {
  const { t } = useTranslation(['publish-shift', 'edit-shift']);
  const recurrentDates = useWatch({
    control,
    name: 'dates',
  });

  const labels = useMemo(() => {
    if (recurrentDates.length > 1) {
      return (isEditing?: boolean) =>
        isEditing
          ? t('edit-shift:edit_multiple_shifts_button', {
              numberOfShifts: recurrentDates.length,
            })
          : t('publish_multiple_shifts_button', {
              numberOfShifts: recurrentDates.length,
            });
    }

    return (isEditing?: boolean) =>
      isEditing ? t('edit-shift:edit_shift_button') : t('publish_shift_button');
  }, [recurrentDates, t]);

  return <>{labels(isEditing)}</>;
};
