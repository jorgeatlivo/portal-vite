import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import clsx from 'clsx';

import { Logger } from '@/services/logger.service';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import { useAction } from '@/hooks/use-params-action';
import { useSearchParams } from '@/hooks/use-search-params';
import { wait } from '@/utils/frame';

import {
  ShiftFormData,
  transformShiftFormDataToRequestPayload,
} from '@/pages/shared/ShiftForm/config/shift-form.config';
import { useMutatePublishShift } from '@/pages/shared/ShiftForm/hooks/useShiftMutation';
import ShiftCreationForm from '@/pages/shared/ShiftForm/ShiftCreationForm';

interface ShiftCreationPageProps {
  reloadShifts: () => void;
}

const ShiftCreationPage = memo(({ reloadShifts }: ShiftCreationPageProps) => {
  const { active: isOpenPage } = useAction('create-shift');
  const [isVisible, setIsVisible] = useState(isOpenPage);
  const { setMultiParams } = useSearchParams();
  const { t } = useTranslation('publish-shift');

  const { publishShiftAsync } = useMutatePublishShift();
  const dispatch = useDispatch();

  const goBack = useCallback(async () => {
    setIsVisible(false);
    await wait(300);

    setMultiParams({
      action: null,
      'shift-time': null,
    });
  }, [setMultiParams]);

  const publishShiftFunction = useCallback(
    async (formData: ShiftFormData) => {
      try {
        const requestPayload = transformShiftFormDataToRequestPayload(formData);
        const response = await publishShiftAsync(requestPayload);
        if (!response) {
          throw new Error(t('shift_creation_failed'));
        }
        dispatch(
          showToastAction({
            message: t('shift_creation_success'),
            severity: 'success',
          })
        );
        reloadShifts();
        goBack();
      } catch (error) {
        Logger.error('Error publishing shift:', error);
      }
    },
    [publishShiftAsync, t, dispatch, reloadShifts, goBack]
  );

  useEffect(() => {
    isOpenPage && setIsVisible(true);
  }, [isOpenPage]);

  const containerClassName = useMemo(
    () =>
      clsx(
        'absolute inset-0 flex size-full flex-1 overflow-hidden bg-BG-Default transition-transform duration-300',
        isVisible ? 'translate-x-0' : 'translate-x-full'
      ),
    [isVisible]
  );

  if (!isOpenPage) {
    return null;
  }

  return (
    <div className={containerClassName}>
      <ShiftCreationForm onSubmit={publishShiftFunction} back={goBack} />
    </div>
  );
});

ShiftCreationPage.displayName = 'ShiftCreationPage';

export default ShiftCreationPage;
