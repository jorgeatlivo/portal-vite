import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { ApiApplicationError } from '@/services/api';
import { PortalProfessionalSearchVo } from '@/services/professionals';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';
import { useCalendarShifts } from '@/queries/calendar-shifts';

import { useShiftContext } from '@/contexts/ShiftContext';

export default function useFetchCalendarShifts(
  selectedDate: string,
  selectedProfessionals?: PortalProfessionalSearchVo[]
) {
  const dispatch = useDispatch();
  const { setSelectedShiftId } = useShiftContext();

  const professionalIds = useMemo(
    () => selectedProfessionals?.map((p) => p.id.toString()) || [],
    [selectedProfessionals]
  );

  const { data, isLoading, error, refetch } = useCalendarShifts({
    selectedDate,
    professionalIds,
  });

  // Handle errors similar to CalendarPage
  if (error) {
    setSelectedShiftId(undefined);
    if (error instanceof ApiApplicationError) {
      if (error.cause === 'NO_INTERNET') {
        dispatch(toggleInternetConnection(false));
      } else {
        dispatch(
          showToastAction({
            message: error.message,
            severity: 'error',
          })
        );
      }
    }
  }

  const shifts = data?.length ? data[0].shifts : [];
  const holiday = data?.length ? data[0].holiday || false : false;

  return {
    isLoading,
    shifts,
    holiday,
    error,
    refetch,
  };
}
