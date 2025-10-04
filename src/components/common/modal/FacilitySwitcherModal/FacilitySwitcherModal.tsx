import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';
import { NotificationsBadge } from '@/components/common/NotificationsBadge';
import { SearchBar } from '@/components/facilityStaff/SearchBar';
import { useAccountChangeInterceptor } from '@/components/layout/components/AccountChangeInterceptor';
import { useUpdateFacility } from '@/components/layout/hooks/useUpdateFacility';

import colors from '@/config/color-palette';
import { useAuth } from '@/contexts/Authentication.context';
import { useFetchAccountInfo } from '@/routers/hooks/useFetchAccountInfo';
import { ModalWindow } from '../ModalWindow';

interface Props {
  closeModal: () => void;
}

const FacilitySwitcherModal: React.FC<Props> = ({ closeModal }) => {
  const { t } = useTranslation('facility-groups');
  const { token } = useAuth();
  const { accountInfo } = useFetchAccountInfo(token);
  const { getInterceptor } = useAccountChangeInterceptor();

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const { mutateAsync, isPending } = useUpdateFacility();

  const visibleFacilities = accountInfo?.facilityGroup?.facilities.filter(
    ({ name }) => name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onChangeFacility = useCallback(
    async (facilityId: number) => {
      const interceptor = getInterceptor();
      const allow = interceptor ? await interceptor() : true;
      if (allow) {
        await mutateAsync(+facilityId);
        navigate('/');
      }
      closeModal();
    },
    [getInterceptor, closeModal, mutateAsync, navigate]
  );

  return (
    <ModalWindow title={t('group_facilities')} closeModal={closeModal}>
      <div className="modern-scrollbar flex w-full flex-col gap-6 overflow-y-auto px-large pb-5 pt-3">
        <div className=" flex flex-1 flex-col bg-white">
          <div className=" pb-large">
            <SearchBar
              searchText={searchQuery}
              setSearchText={setSearchQuery}
              searchPlaceHolder={t('search_facility')}
            />
          </div>
          <div className={'flex flex-col'}>
            {isPending ? (
              <div className="flex h-24 items-center justify-center text-Text-Inverse">
                <CircularProgress size={32} color="primary" />
              </div>
            ) : visibleFacilities?.length ? (
              visibleFacilities.map((facility) => (
                <div
                  onClick={() => onChangeFacility(facility.id)}
                  className={clsx(
                    'flex flex-row justify-between rounded-lg p-3  transition-colors duration-300 ease-in-out',
                    facility.selected
                      ? 'bg-Primary-100'
                      : 'cursor-pointer  hover:bg-Neutral-050'
                  )}
                >
                  <Typography variant={'body/regular'}>
                    {facility.name}
                  </Typography>
                  {facility.totalNewOfferClaims && (
                    <NotificationsBadge
                      notifications={facility.totalNewOfferClaims}
                    />
                  )}
                </div>
              ))
            ) : (
              <div
                className={'flex flex-col items-center justify-center gap-4'}
              >
                <span className={'rounded-full bg-Neutral-050 p-4'}>
                  <LivoIcon
                    name={'internal-hospital'}
                    size={60}
                    color={colors['Neutral-500']}
                  />
                </span>
                <Typography
                  variant={'body/regular'}
                  color={colors['Text-Secondary']}
                >
                  {t('empty_facility_search')}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalWindow>
  );
};

export default React.memo(FacilitySwitcherModal);
