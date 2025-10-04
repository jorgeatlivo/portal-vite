import { PendingRequestsAction, PendingRequestsState } from '@/store/types';

const initialState: PendingRequestsState = {
  count: 0,
};

const pendingRequestsReducer = (
  state = initialState,
  action: PendingRequestsAction
) => {
  switch (action.type) {
    case 'SET_PENDING_REQUESTS_COUNT':
      return {
        ...state,
        count: action.payload,
      };
    default:
      return state;
  }
};

export default pendingRequestsReducer;
