import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchActionableShifts } from '@/services/activity';
import { ApiApplicationError } from '@/services/api';
import { setActivityShiftListShifts } from '@/store/actions/activityShiftListActions';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';
import { RootState } from '@/store/types';

import { ActivityShiftListComponent } from '@/components/activity/ActivityShiftListComponent';

import { ShiftProvider, useShiftContext } from '@/contexts/ShiftContext';
import { ShiftDetailsSection } from '@/pages/Shift/views/ShiftDetailsSection';
import ShiftModificationPage from './shared/ShiftForm/ShiftModificationPage';

const ActivityComponent: React.FC = () => {
  const [loadingShifts, setLoadingShifts] = useState(true);
  const { shifts } = useSelector((state: RootState) => state.activityShiftList);
  const dispatch = useDispatch();
  const { setSelectedShiftId } = useShiftContext();

  const loadShifts = async () => {
    setLoadingShifts(true);
    await fetchActionableShifts()
      .then((response) => {
        dispatch(setActivityShiftListShifts(response));
        setLoadingShifts(false);
      })
      .catch((error) => {
        dispatch(setActivityShiftListShifts([]));
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
        setLoadingShifts(false);
      });
  };

  const loadData = async () => {
    return fetchActionableShifts()
      .then((response) => {
        dispatch(setActivityShiftListShifts(response));
      })
      .catch((error) => {
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
      });
  };

  useEffect(() => {
    loadShifts();
  }, []);

  return (
    <div className="relative flex h-full justify-between space-x-medium  overflow-y-hidden overflow-x-scroll md:overflow-hidden">
      <ActivityShiftListComponent shifts={shifts} loading={loadingShifts} />
      <ShiftDetailsSection reloadShifts={loadData} />
      <ShiftModificationPage reloadShifts={loadData} />
    </div>
  );
};

export const ActivityPage: React.FC = () => {
  return (
    <ShiftProvider>
      <ActivityComponent />
    </ShiftProvider>
  );
};
