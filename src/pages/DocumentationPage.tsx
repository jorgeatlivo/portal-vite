import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  Chip,
  CircularProgress,
  Container,
  Link,
  TableCellProps,
  TablePagination,
  Tooltip,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { IconFileSpreadsheet } from '@tabler/icons-react';

import { fetchLegalReviewList } from '@/services/api';

import { Typography } from '@/components/atoms/Typography';
import FirstShifterTag from '@/components/common/FirstShifterTag';
import LivoIcon from '@/components/common/LivoIcon';
import { MainPageHeader } from '@/components/common/MainPageHeader';
import { NavigationTabs } from '@/components/common/NavigationTabs';

import {
  FacilityReviewStatusEnum,
  getReviewStatusLabelProps,
} from '@/utils/constants';

import colors from '@/config/color-palette';
import { ShiftClaimDetailsPage } from '@/pages/ShiftClaimDetailsPage';
import { ShiftClaimDetails } from '@/types';
import { formatDateToYYYYMMDD, formatDateWithToday } from '@/utils';

import '../styles/ShiftClaimListScreen.css';

export const PAGE_SIZE = 20;

const isSmallWindow = window.innerWidth <= 768;

interface StyledTableCellProps extends TableCellProps {
  header?: boolean;
  firstCell?: boolean;
  lastCell?: boolean;
}

const StyledTableCell = ({
  children,
  header = false,
  firstCell = false,
  lastCell = false,
  ...props
}: StyledTableCellProps) => (
  <TableCell
    {...props}
    sx={{
      p: '8px',
      ...(!header && {
        backgroundColor: 'white',
        borderBottomWidth: 0,
      }),
      ...(firstCell && {
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        minWidth: '100px',
      }),
      ...(lastCell && {
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
      }),
    }}
  >
    {header ? (
      <Typography variant="subtitle/small" color={colors['Text-Secondary']}>
        {children}
      </Typography>
    ) : (
      children
    )}
  </TableCell>
);

export enum DocumentationPageTabs {
  DEFAULT = 'DEFAULT',
  CONFIRMED = 'CONFIRMED',
  PAST = 'PAST',
}

export const DocumentationPage: React.FC = () => {
  const { t } = useTranslation('shift-claim-list');
  const [shiftClaimsData, setShiftClaimsData] = useState<ShiftClaimDetails[]>(
    []
  );
  const [displayFacilityName, setDisplayFacilityName] =
    useState<Boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [totalShifts, setTotalShifts] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsTab = searchParams.get('tab');

  const tabs = [
    {
      displayText: t('upcoming_shifts'),
      value: DocumentationPageTabs.DEFAULT,
      icon: 'hourglass',
    },
    {
      displayText: t('confirmed_shifts'),
      value: DocumentationPageTabs.CONFIRMED,
      icon: 'check-circle',
    },
    {
      displayText: t('past_shifts'),
      value: DocumentationPageTabs.PAST,
      icon: 'history',
    },
  ];

  const handleTabChange = useCallback((newValue: string) => {
    setSearchParams({ tab: newValue });
    setPage(0);
  }, []);

  const today = new Date();
  const dayBeforeToday = new Date(today);
  dayBeforeToday.setDate(dayBeforeToday.getDate() - 1);

  const filters = {
    [DocumentationPageTabs.PAST]: {
      page: page + 1,
      toDate: formatDateToYYYYMMDD(dayBeforeToday),
      sortOrder: 'DESC',
      size: PAGE_SIZE,
    },
    [DocumentationPageTabs.CONFIRMED]: {
      page: page + 1,
      facilityReviewStatuses: [FacilityReviewStatusEnum.CONFIRMED],
      fromDate: formatDateToYYYYMMDD(today),
      sortOrder: 'ASC',
      size: PAGE_SIZE,
    },
    [DocumentationPageTabs.DEFAULT]: {
      page: page + 1,
      facilityReviewStatuses: [
        FacilityReviewStatusEnum.UNAVAILABLE,
        FacilityReviewStatusEnum.IN_REVIEW,
      ],
      fromDate: formatDateToYYYYMMDD(today),
      sortOrder: 'ASC',
      size: PAGE_SIZE,
    },
  };

  const onConfirmClaim = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', DocumentationPageTabs.CONFIRMED);
    setSearchParams(newParams);
  };

  const fetchShiftData = async () => {
    if (!paramsTab) {
      return;
    }

    const filter = filters[paramsTab as keyof typeof filters];
    setLoading(true);
    fetchLegalReviewList(filter)
      .then((shiftClaimResponse) => {
        setShiftClaimsData(shiftClaimResponse.rows);
        setTotalShifts(shiftClaimResponse.total);
        setDisplayFacilityName(
          shiftClaimResponse.rows.some(
            (shiftClaim) => shiftClaim.facilityName !== null
          )
        );
        setLoading(false);
      })
      .catch(() => {
        setShiftClaimsData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!searchParams.has('tab')) {
      searchParams.set('tab', DocumentationPageTabs.DEFAULT);
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  useEffect(() => {
    fetchShiftData();
  }, [paramsTab, page]);

  const reviewStatusLabelProps = useMemo(() => getReviewStatusLabelProps(), []);

  const getStatusLabel = (facilityReviewStatus: string) => {
    const statusLabelProp =
      reviewStatusLabelProps[
        facilityReviewStatus as keyof typeof reviewStatusLabelProps
      ];
    return (
      <Chip label={statusLabelProp.label} color={statusLabelProp.colorTheme} />
    );
  };

  const content = loading ? (
    <Container
      sx={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        minHeight: '30em',
        minWidth: '100%',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Container>
  ) : shiftClaimsData.length === 0 ? (
    <div
      className={
        'mt-10 flex w-full flex-1 flex-col items-center justify-center gap-4 px-xLarge'
      }
    >
      <span className={'rounded-full bg-Neutral-300 p-4'}>
        <LivoIcon name={'search'} size={60} color={colors['Neutral-050']} />
      </span>
      <Typography variant={'body/regular'} color={colors['Text-Secondary']}>
        {t('no_results')}
      </Typography>
    </div>
  ) : (
    <TableContainer
      component={'div'}
      className="table"
      sx={{
        flex: 1,
        overflowY: 'scroll',
        maxHeight: '100%',
      }}
    >
      <Table
        stickyHeader
        sx={{
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
        }}
      >
        <TableHead
          className="table-header"
          sx={{
            '& .MuiTableCell-root': {
              backgroundColor: colors['Grey-050'],
            },
          }}
        >
          <TableRow>
            <StyledTableCell header>
              {t('shift_day_table_title')}
            </StyledTableCell>
            {displayFacilityName && (
              <StyledTableCell header>
                {t('facility_name_title')}
              </StyledTableCell>
            )}
            <StyledTableCell header>
              {t('professional_table_title')}
            </StyledTableCell>
            <StyledTableCell header>{t('id_table_title')}</StyledTableCell>
            <StyledTableCell header>{t('unit_table_title')}</StyledTableCell>
            <StyledTableCell header>
              {t('professional_field_table_title')}
            </StyledTableCell>
            <StyledTableCell header>{t('price_table_title')}</StyledTableCell>
            <StyledTableCell header>{t('status_table_title')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody
          component={'div'}
          sx={{
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            maxWidth: '100%',
            flexDirection: 'column',
          }}
        >
          {shiftClaimsData.map((claim) => (
            <TableRow
              key={claim.shiftClaimId}
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow:
                    '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                },
              }}
              hover
              component={Link}
              onClick={(e) => {
                e.preventDefault();
                setSearchParams({
                  tab: paramsTab ?? 'DEFAULT',
                  action: 'check-claim',
                  id: claim.shiftClaimId.toString(),
                });
              }}
              underline="none"
            >
              <StyledTableCell firstCell className="link-text">
                <Typography variant="body/small">
                  {formatDateWithToday(
                    claim.shift.startTime,
                    isSmallWindow,
                    true
                  )}
                </Typography>
              </StyledTableCell>
              {displayFacilityName && (
                <StyledTableCell>{claim.facilityName}</StyledTableCell>
              )}
              <StyledTableCell>
                <div className="flex flex-row items-center justify-between gap-2">
                  <Typography
                    noWrap
                    variant="body/small"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '20ch',
                    }}
                  >
                    {claim.professionalInitProfile.firstName}{' '}
                    {claim.professionalInitProfile.lastName}
                  </Typography>

                  {claim.professionalInitProfile.firstShifter && (
                    <FirstShifterTag />
                  )}
                </div>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body/small">
                  {claim.professionalLegalProfile?.nationalId ??
                    t('pending_label')}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body/small">{claim.shift.unit}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body/small">
                  {claim.shift.professionalField}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography variant="body/small">
                  {claim.shift.formattedTotalPay}
                </Typography>
              </StyledTableCell>
              <StyledTableCell lastCell>
                <div className="flex flex-row items-center justify-between gap-2">
                  {getStatusLabel(claim.facilityReviewStatus)}
                  {claim.hrIntegrationProcessedTime !== null && (
                    <Tooltip
                      title={
                        claim.hrIntegrationProcessedTime
                          ? t('exported_to_csv', {
                              date: claim.hrIntegrationProcessedTime,
                            })
                          : ''
                      }
                    >
                      <IconFileSpreadsheet
                        size={32}
                        color={colors['Grey-700']}
                        className="rounded-full border-2 p-1"
                      />
                    </Tooltip>
                  )}
                </div>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalShifts}
        page={page}
        rowsPerPageOptions={[]}
        onPageChange={(event, newPage) => {
          setPage(newPage);
        }}
        rowsPerPage={PAGE_SIZE}
        labelDisplayedRows={({ from, to, count }) =>
          `${from} - ${to} de ${count}`
        }
      />
    </TableContainer>
  );

  return (
    <div className="relative flex h-full flex-col items-center overflow-hidden pb-0">
      <div className="w-full max-w-[1500px] bg-Neutral-050 px-xLarge pt-xLarge">
        <MainPageHeader title={t('header_title')} />
        <div className={'-mr-xLarge md:mr-0'}>
          <NavigationTabs
            tabs={tabs}
            selectedTab={paramsTab ?? DocumentationPageTabs.DEFAULT}
            onSelectTab={handleTabChange}
          />
        </div>
      </div>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          mx: '24px',
          mt: '-12px',
          height: '100vh',
          maxWidth: '1500px',
          overflow: 'scroll',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <div className="table-container mr-large px-xLarge">{content}</div>
      </Container>

      <ShiftClaimDetailsPage onConfirmClaim={onConfirmClaim} />
    </div>
  );
};
