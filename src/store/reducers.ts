import { combineReducers } from 'redux';

import { accountReducer } from './reducers/account';
import activityShiftListReducer from './reducers/activityShiftList';
import { appConfigurationReducer } from './reducers/appConfiguration';
import claimData from './reducers/claimsReducer';
import pendingRequestsReducer from './reducers/pendingProfessionals';
import { professionalFiltersReducer } from './reducers/professionalFilterAction';
import { shiftFiltersReducer } from './reducers/shiftFilters';

const rootReducer = combineReducers({
  activityShiftList: activityShiftListReducer,
  account: accountReducer,
  appConfiguration: appConfigurationReducer,
  filterShifts: shiftFiltersReducer,
  pendingRequests: pendingRequestsReducer,
  claimData,
  professionalFilters: professionalFiltersReducer,
});

export default rootReducer;
