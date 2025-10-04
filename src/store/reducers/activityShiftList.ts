import { ActivityShiftListAction, ActivityShiftListState } from '@/store/types';

const initialState: ActivityShiftListState = {
  shifts: [],
};

const activityShiftListReducer = (
  state = initialState,
  action: ActivityShiftListAction
) => {
  switch (action.type) {
    case 'SET_ACTIVITY_SHIFT_LIST_SHIFTS': {
      return {
        ...state,
        shifts: action.payload,
      };
    }
    default:
      return state;
  }
};

export default activityShiftListReducer;
