import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import { CircularProgress } from '@mui/material';

import { FacilityStaff } from '@/services/facility-staff';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';
import { EmptyShiftsState } from '@/components/internalProfessionals/EmptyState';

import colors from '@/config/color-palette';
import { FacilityStaffCard } from './FacilityStaffCard';
import { SearchBar } from './SearchBar';

interface FacilityStaffListComponentProps {
  facilityStaff: FacilityStaff[];
  loading: boolean;
  loadNextPage: () => void;
  hasMoreData: boolean;
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  onEdit: (facilityStaff: FacilityStaff) => void;
  onCreate: () => void;
  facilityHasUnitsConfigured?: boolean;
}

export const FacilityStaffList: React.FC<FacilityStaffListComponentProps> = ({
  facilityStaff,
  loading,
  loadNextPage,
  hasMoreData,
  searchQuery,
  setSearchQuery,
  onEdit,
  onCreate,
  facilityHasUnitsConfigured,
}) => {
  const { t } = useTranslation('facility-staff');
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: 0,
      });
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [searchQuery]);

  return (
    <div className="no-sycrollbar flex flex-1 justify-center overflow-y-hidden">
      <div className="flex w-full max-w-[1500px] flex-1 flex-col space-y-medium">
        <div className="flex h-fit w-full min-w-[1000px] flex-col">
          <div className="flex items-end space-x-small border-b border-Divider-Default py-small pl-small">
            <div className="table-header flex flex-1 ">
              <Typography
                variant="subtitle/small"
                color={colors['Text-Secondary']}
              >
                {t('user_name_label')}
              </Typography>
            </div>
            <div className="table-header flex flex-1 items-end ">
              <Typography
                variant="subtitle/small"
                color={colors['Text-Secondary']}
              >
                {t('email_label')}
              </Typography>
            </div>
            {facilityHasUnitsConfigured ? (
              <div className="table-header flex flex-1 items-end ">
                <Typography
                  variant="subtitle/small"
                  color={colors['Text-Secondary']}
                >
                  {t('units_label')}
                </Typography>
              </div>
            ) : null}
            <div className="table-header flex flex-1 items-end ">
              <Typography
                variant="subtitle/small"
                color={colors['Text-Secondary']}
              >
                {t('permissions_label')}
              </Typography>
            </div>
            <div
              className={
                'table-header mb-[-9px] flex flex-1 flex-row justify-end gap-2 bg-Background-Secondary p-small pl-large'
              }
            >
              <SearchBar
                compact
                searchText={searchQuery}
                setSearchText={setSearchQuery}
                searchPlaceHolder={t('search_placeholder')}
              />
              <button
                className={'rounded-[999px] bg-Secondary-900 p-2'}
                onClick={onCreate}
              >
                <LivoIcon name="user-plus" size={24} color={'white'} />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex h-fit flex-1 items-center justify-center">
              <CircularProgress />
            </div>
          ) : facilityStaff.length === 0 ? (
            <EmptyShiftsState title={t('no_registered_users')} />
          ) : (
            <div
              id="scrollableDiv"
              className="pb-100 no-scrollbar w-full space-y-small"
              ref={scrollableDivRef}
              style={{
                overflow: 'scroll',
                height: 'calc(100vh - 230px)',
              }}
            >
              <InfiniteScroll
                dataLength={facilityStaff.length}
                next={() => loadNextPage()}
                hasMore={hasMoreData}
                loader={<div />}
                scrollableTarget="scrollableDiv"
                className="space-y-small"
                scrollThreshold={0.7}
                style={{
                  paddingTop: '16px',
                  paddingBottom: '24px',
                  overflow: 'visible',
                }}
              >
                {facilityStaff.map((item, index) => (
                  <FacilityStaffCard
                    key={index}
                    staff={item}
                    onClick={() => onEdit(item)}
                    facilityHasUnitsConfigured={facilityHasUnitsConfigured}
                  />
                ))}
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
