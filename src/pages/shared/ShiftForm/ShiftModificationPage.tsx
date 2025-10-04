import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

import { Logger } from '@/services/logger.service';
import { showToastAction } from '@/store/actions/appConfigurationActions';
import { SHIFT_DETAIL_QUERY_KEY } from '@/queries/shift-detail';

import { useInvalidateQuery } from '@/hooks/use-invalidate-query';
import { useAction } from '@/hooks/use-params-action';
import { useSearchParam, useSearchParams } from '@/hooks/use-search-params';
import { Shift } from '@/types/shifts';
import { wait } from '@/utils/frame';

import useFetchShiftDetail from '@/pages/Shift/hooks/useFetchShiftDetail';
import PageHeader from '@/pages/shared/ShiftForm/components/PageHeader';
import {
  ShiftFormData,
  transformShiftFormToModificationRequestPayload,
} from '@/pages/shared/ShiftForm/config/shift-form.config';
import { useMutateEditShift } from '@/pages/shared/ShiftForm/hooks/useShiftMutation';
import ShiftModificationForm from '@/pages/shared/ShiftForm/ShiftModificationForm';

interface ShiftModificationPageProps {
  reloadShifts: () => void;
}

const ShiftModificationPage = memo(
  ({ reloadShifts }: ShiftModificationPageProps) => {
    const { active: isOpenPage } = useAction('edit-shift');
    const selectedShiftId = useSearchParam('shift-id');
    const { setMultiParams } = useSearchParams();
    const [isVisible, setIsVisible] = useState(isOpenPage);
    const location = useLocation();
    const invalidate = useInvalidateQuery();
    const { t } = useTranslation('edit-shift');
    const { isLoading, shiftDetails } = useFetchShiftDetail(
      Number.parseInt(selectedShiftId ?? ''),
      location.state?.shift as Shift | undefined
    );

    const { editShiftAsync } = useMutateEditShift();
    const dispatch = useDispatch();

    const editShiftFunction = async (formData: ShiftFormData) => {
      try {
        const shiftId = (location.state?.shift as Shift | undefined)?.id;

        if (typeof shiftId !== 'number') return;

        const requestPayload =
          transformShiftFormToModificationRequestPayload(formData);
        const response = await editShiftAsync({
          shiftId,
          shiftRequest: requestPayload,
        });
        if (!response) {
          throw new Error(t('shift_modification_failed'));
        }
        dispatch(
          showToastAction({
            message: t('shift_modification_success'),
            severity: 'success',
          })
        );
        reloadShifts();
        invalidate([SHIFT_DETAIL_QUERY_KEY, shiftId]);
        goBack();
      } catch (error) {
        Logger.error('Error publishing shift:', error);
      }
    };

    const goBack = async () => {
      setIsVisible(false);
      await wait(300);

      setMultiParams({
        action: null,
        'shift-id': null,
      });
    };

    useEffect(() => {
      isOpenPage && setIsVisible(true);
    }, [isOpenPage]);

    if (!isOpenPage) {
      return null;
    }

    const content = () => {
      if (isLoading || !shiftDetails) {
        return (
          <div className="flex size-full flex-1 flex-col gap-6 overflow-hidden py-6">
            <PageHeader
              title={t('edit_shift_title', { shift: '' })}
              back={goBack}
            />
            <div className="mt-[10%] flex flex-1 flex-col items-center gap-4">
              <CircularProgress
                size={32}
                color="inherit"
                className="text-Divider-Subtle"
              />
            </div>
          </div>
        );
      }

      return (
        <ShiftModificationForm
          shift={shiftDetails}
          onSubmit={editShiftFunction}
          back={goBack}
        />
      );
    };

    return (
      <div
        className={clsx(
          'absolute inset-0 !m-0 flex size-full flex-1 overflow-hidden bg-BG-Default transition-transform duration-300',
          isVisible ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {content()}
      </div>
    );
  }
);

ShiftModificationPage.displayName = 'ShiftModificationPage';

export default ShiftModificationPage;
