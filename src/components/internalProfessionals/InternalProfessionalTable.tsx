import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';

import { InternalProfessionalFilter } from '@/services/api';
import { RootState } from '@/store/types';

import { Typography } from '@/components/atoms/Typography';

import { applyProfessionalFilter } from '@/types/common/shiftFilters';
import {
  FacilityDataFieldDefinition,
  InternalProfessional,
  InvitationStatus,
} from '@/types/internal';

import colors from '@/config/color-palette';
import { EmptyShiftsState } from './EmptyState';
import { InternalProfessionalCard } from './InternalProfessionalCard';
import { ProfessionalFilter } from './ProfessionalFilter';
import { SearchBar } from './SearchBar';

interface InternalProfessionalsListComponentProps {
  professionals: InternalProfessional[];
  loading: boolean;
  selectedFilter: InternalProfessionalFilter;
  selectedProfessionalId: number | null;
  setSelectedProfessionalId: (id: number) => void;
  loadNextPage: () => void;
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  hasMoreData: boolean;
  totalProfessionals: number | null;
  pendingRequests: InternalProfessional[];
  dataFieldDefinitions: FacilityDataFieldDefinition[];
}

export const InternalProfessionalTable: React.FC<
  InternalProfessionalsListComponentProps
> = ({
  professionals,
  loading,
  selectedProfessionalId,
  setSelectedProfessionalId,
  loadNextPage,
  hasMoreData,
  searchQuery,
  setSearchQuery,
  totalProfessionals,
  pendingRequests,
  dataFieldDefinitions,
}) => {
  const { t } = useTranslation('internal-professional-page');
  const [invitationStatusFilter, setInvitationStatusFilter] = useState('all');
  let displayProfessionals =
    invitationStatusFilter === 'pending' ? pendingRequests : professionals;
  const filters = useSelector(
    (state: RootState) => state.professionalFilters.filters
  );
  filters.forEach(
    (f) =>
      (displayProfessionals = applyProfessionalFilter(f, displayProfessionals))
  );

  const listHeightThreshold = window.innerWidth > 768 ? 217 : 340;
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: 0,
      });
    }
  };
  const numberOfColumns = dataFieldDefinitions.length + 2;
  const gridColsStyle = `grid-cols-${numberOfColumns}`;
  useEffect(() => {
    scrollToTop();
  }, [searchQuery, invitationStatusFilter]);

  return (
    <div className="flex max-h-max flex-1 justify-center pt-xLarge">
      <div className="flex size-full max-w-[100vw] flex-1 flex-col  md:max-w-[1500px] md:px-medium">
        <div className="mb-large flex items-center justify-center space-x-small px-large md:justify-start">
          <Typography variant="heading/large">
            {t('professionals_page_title')}
          </Typography>
          <Typography variant="body/large" color={colors['Text-Subtle']}>
            ({displayProfessionals.length})
          </Typography>
        </div>
        <div className="mt-large flex h-fit max-w-full flex-col items-center gap-5 px-large md:flex-row">
          <ProfessionalFilter
            appliedFilter={invitationStatusFilter}
            setFilter={(filter: any) => setInvitationStatusFilter(filter)}
            nPendingClaims={
              invitationStatusFilter !== 'pending' &&
              totalProfessionals !== null
                ? pendingRequests.length
                : null
            }
          />
          <div className="w-full">
            <SearchBar
              searchText={searchQuery}
              setSearchText={setSearchQuery}
              searchPlaceHolder={t('search_placeholder')}
            />
          </div>
        </div>
        <div className="no-scrollbar overflow-y-hidden overflow-x-scroll">
          <div className=" flex h-fit w-full min-w-[900px] flex-col px-large">
            <div className="flex flex-1 flex-row items-end px-small">
              <div
                className={`grid flex-1 ${gridColsStyle} items-end space-x-small border-b border-Divider-Default p-small`}
              >
                <div className="table-header  col-span-2">
                  <Typography
                    variant="subtitle/small"
                    color={colors['Text-Secondary']}
                  >
                    {t('professional_table_name_header')}
                  </Typography>
                </div>
                {dataFieldDefinitions.map((dataField, index) => (
                  <div key={index} className="table-header col-span-1 px-1">
                    <Typography
                      variant="subtitle/small"
                      color={colors['Text-Secondary']}
                    >
                      {dataField.label}
                    </Typography>
                  </div>
                ))}
              </div>
              <div
                className="width-[20px] flex border-b border-Divider-Default p-small" // space for notifications badge
              ></div>
            </div>

            {loading ? (
              <div className="flex h-[400px] flex-col items-center justify-center">
                <CircularProgress size={80} />
              </div>
            ) : displayProfessionals.length === 0 ? (
              invitationStatusFilter === 'pending' ? (
                <EmptyShiftsState title={t('no_requests_title')} />
              ) : (
                <EmptyShiftsState
                  title={t('no_professionals_title')}
                  subtitle={t('no_professionals_subtitle')}
                />
              )
            ) : (
              <div
                id="scrollableDiv"
                className="no-scrollbar w-full space-y-small px-2 py-5"
                ref={scrollableDivRef}
                style={{
                  overflow: 'scroll',
                  height: `calc(100svh - ${listHeightThreshold}px)`, // this is needed to know where the scroll list finishes, if not the table will overflow and the scroll won't happen on the infinite scroll
                }}
              >
                <InfiniteScroll
                  dataLength={displayProfessionals.length}
                  next={() => loadNextPage()}
                  hasMore={hasMoreData}
                  loader={<div />}
                  scrollableTarget="scrollableDiv"
                  className="space-y-small"
                  scrollThreshold={0.7}
                >
                  {displayProfessionals.map((item) => (
                    <InternalProfessionalCard
                      key={item.id}
                      professional={item}
                      isSelected={selectedProfessionalId === item.id}
                      onClick={() => setSelectedProfessionalId(item.id)}
                      notifications={
                        item.invitationStatus === InvitationStatus.PENDING
                          ? 1
                          : undefined
                      }
                      dataFieldDefinitions={dataFieldDefinitions}
                    />
                  ))}
                </InfiniteScroll>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
