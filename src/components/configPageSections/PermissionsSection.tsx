import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { ApiApplicationError } from '@/services/api';
import {
  CreateUpdateFacilityStaff,
  createFacilityStaff,
  deleteFacilityStaff,
  FacilityStaff,
  FacilityStaffFilter,
  fetchFacilityStaff,
  updateFacilityStaff,
} from '@/services/facility-staff';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import CreateUpdateFacilityStaffModal from '@/components/facilityStaff/CreateUpdateFacilityStaffModal';
import { DeleteUserModal } from '@/components/facilityStaff/DeleteUserModal';
import { FacilityStaffList } from '@/components/facilityStaff/FacilityStaffList';

import { AppDispatch } from '@/store';
export const PAGE_SIZE = 50;

export const PermissionsSection: React.FC = () => {
  const { t } = useTranslation('facility-staff');
  const [facilityStaff, setFacilityStaff] = useState<FacilityStaff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [edittingStaff, setedittingStaff] = useState<FacilityStaff | null>(
    null
  );
  const [deletingStaff, setDeletingStaff] = useState<FacilityStaff | null>(
    null
  );
  const [facilityHasUnitsConfigured, setFacilityHasUnitsConfigured] =
    useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const filter: FacilityStaffFilter = {
    page: (page + 1).toString(),
    size: PAGE_SIZE.toString(),
    search: searchQuery,
  };

  const loadFacilityStaff = async () => {
    fetchFacilityStaff(filter)
      .then((response) => {
        setFacilityStaff([...facilityStaff, ...response.rows]);
        if (page * PAGE_SIZE <= response.total) {
          setHasMoreData(true);
        } else {
          setHasMoreData(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        setFacilityStaff([]);
        setLoading(false);
      });
  };

  const initialLoad = async () => {
    setPage(0);
    setLoading(true);
    fetchFacilityStaff({ ...filter, page: '1' })
      .then((response) => {
        setFacilityStaff(response.rows);
        setFacilityHasUnitsConfigured(response.facilityHasUnitsConfigured);
        if (page * PAGE_SIZE <= response.total) {
          setHasMoreData(true);
        } else {
          setHasMoreData(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        setFacilityStaff([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (page !== 0) {
      loadFacilityStaff();
    } else {
      initialLoad();
    }
  }, [page]);

  useEffect(() => {
    initialLoad();
  }, [searchQuery]);

  return (
    <div className="flex justify-between space-x-medium">
      <FacilityStaffList
        facilityHasUnitsConfigured={facilityHasUnitsConfigured}
        onCreate={() => {
          setIsCreating(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        facilityStaff={facilityStaff}
        loading={loading}
        loadNextPage={() => {
          if (hasMoreData) {
            setPage(page + 1);
          }
        }}
        hasMoreData={hasMoreData}
        onEdit={(staff: FacilityStaff) => {
          setedittingStaff(staff);
        }}
      />
      <CreateUpdateFacilityStaffModal
        facilityHasUnitsConfigured={facilityHasUnitsConfigured}
        isOpen={edittingStaff !== null || isCreating}
        onClose={() => {
          setedittingStaff(null);
          setIsCreating(false);
        }}
        onDeleteUser={() => {
          setedittingStaff(null);
          setDeletingStaff(edittingStaff);
        }}
        edittingStaff={edittingStaff}
        onSubmit={async (
          facilityStaffRequest: CreateUpdateFacilityStaff,
          id?: number
        ) => {
          if (edittingStaff && id) {
            updateFacilityStaff(facilityStaffRequest, id)
              .then(() => {
                initialLoad();
                dispatch(
                  showToastAction({
                    message: t('update_staff_success'),
                    severity: 'success',
                  })
                );
                setedittingStaff(null);
              })
              .catch((error) => {
                dispatch(
                  showToastAction({
                    message:
                      error instanceof ApiApplicationError
                        ? error.message
                        : t('update_staff_error'),
                    severity: 'error',
                  })
                );
              });
          } else {
            createFacilityStaff(facilityStaffRequest)
              .then(() => {
                initialLoad();
                dispatch(
                  showToastAction({
                    message: t('create_staff_success'),
                    severity: 'success',
                  })
                );
                setIsCreating(false);
              })
              .catch((error) => {
                setIsCreating(false);
                dispatch(
                  showToastAction({
                    message:
                      error instanceof ApiApplicationError
                        ? error.message
                        : t('create_staff_error'),
                    severity: 'error',
                  })
                );
              });
          }
          setedittingStaff(null);
        }}
      />
      <DeleteUserModal
        isOpen={deletingStaff !== null}
        onClose={() => {
          setDeletingStaff(null);
        }}
        email={deletingStaff?.email || ''}
        userName={`${deletingStaff?.firstName} ${deletingStaff?.lastName}`}
        onDelete={async () => {
          deleteFacilityStaff(deletingStaff?.id || 0)
            .then(() => {
              initialLoad();
              dispatch(
                showToastAction({
                  message: t('delete_user_success'),
                  severity: 'success',
                })
              );
              setDeletingStaff(null);
            })
            .catch(() => {
              setDeletingStaff(null);
              dispatch(
                showToastAction({
                  message: t('delete_user_error'),
                  severity: 'error',
                })
              );
            });
        }}
      />
    </div>
  );
};
