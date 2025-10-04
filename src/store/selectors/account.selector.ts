import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/store/types';

export const selectAccount = (state: RootState) => state.account;

export const selectProfile = createSelector(
  selectAccount,
  (account) => account.accountInfo
);

export const selectCategories = createSelector(
  selectProfile,
  (profile) => profile?.facility.categories
);

export const selectUserFeatures = createSelector(
  selectProfile,
  (profile) => profile?.userFeatures || []
);
