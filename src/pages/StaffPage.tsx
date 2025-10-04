import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchInternalProfessionals,
  InternalProfessionalFilter,
} from '@/services/api';
import { fetchPendingRequests } from '@/store/actions/pendingProfessionalsActions';
import { RootState } from '@/store/types';

import { InternalProfessionalManagement } from '@/components/internalProfessionals/InternalProfessionalManagement';
import { InternalProfessionalTable } from '@/components/internalProfessionals/InternalProfessionalTable';

import {
  FacilityDataFieldDefinition,
  InternalProfessional,
  InvitationStatus,
} from '@/types/internal';

import { AppDispatch } from '@/store';
export const PAGE_SIZE = 5000;

export const StaffPage: React.FC = () => {
  const [internalProfessionals, setInternalProfessionals] = useState<
    InternalProfessional[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    number | null
  >(null);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [totalProfessionals, setTotalProfessionals] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<
    InternalProfessional[]
  >([]);
  const [dataFieldDefinitions, setDataFieldDefinitions] = useState<
    FacilityDataFieldDefinition[]
  >([]);
  const { count } = useSelector((state: RootState) => state.pendingRequests);

  const dispatch = useDispatch<AppDispatch>();

  const filter: InternalProfessionalFilter = {
    page: (page + 1).toString(),
    size: PAGE_SIZE.toString(),
    search: searchQuery,
  };

  const loadInternalProfessionals = async () => {
    fetchInternalProfessionals(filter)
      .then((response) => {
        setInternalProfessionals([...internalProfessionals, ...response.rows]);
        setTotalProfessionals(response.total);
        setDataFieldDefinitions(response.dataFieldDefinitions);
        if (page * PAGE_SIZE <= response.total) {
          setHasMoreData(true);
        } else {
          setHasMoreData(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setInternalProfessionals([]);
        setLoading(false);
      });
  };

  const loadPendingRequests = async () => {
    fetchInternalProfessionals({
      search: searchQuery,
      invitationStatus: InvitationStatus.PENDING,
    })
      .then((response) => {
        setPendingRequests(response.rows);
        setDataFieldDefinitions(response.dataFieldDefinitions);
      })
      .catch(() => {
        setPendingRequests([]);
      });
  };

  const initialLoad = async () => {
    setPage(0);
    setLoading(true);
    fetchInternalProfessionals({ ...filter, page: '1' })
      .then((response) => {
        setInternalProfessionals(response.rows);
        setTotalProfessionals(response.total);
        setDataFieldDefinitions(response.dataFieldDefinitions);
        if (page * PAGE_SIZE <= response.total) {
          setHasMoreData(true);
        } else {
          setHasMoreData(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setInternalProfessionals([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (page !== 0) {
      loadInternalProfessionals();
    } else {
      initialLoad();
    }
  }, [page]);

  useEffect(() => {
    loadPendingRequests();
  }, [searchQuery, count]); // reload when pending requests change

  useEffect(() => {
    initialLoad();
  }, [searchQuery]);

  const reloadData = () => {
    loadPendingRequests();
    initialLoad();
    dispatch(fetchPendingRequests()); // reload pending requests count
  };

  return (
    <div className="relative flex h-full justify-between space-x-medium">
      <InternalProfessionalTable
        professionals={internalProfessionals}
        loading={loading}
        selectedFilter={filter}
        selectedProfessionalId={selectedProfessionalId}
        setSelectedProfessionalId={setSelectedProfessionalId}
        loadNextPage={() => {
          if (hasMoreData) {
            setPage(page + 1);
          }
        }}
        hasMoreData={hasMoreData}
        totalProfessionals={totalProfessionals}
        pendingRequests={pendingRequests}
        dataFieldDefinitions={dataFieldDefinitions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <InternalProfessionalManagement
        setSelectedProfessionalId={setSelectedProfessionalId}
        selectedProfessionalId={selectedProfessionalId}
        handleProfessionalRequest={reloadData}
        editProfessionalDetails={(
          id: number,
          newDetails: InternalProfessional
        ) => {
          setInternalProfessionals(
            internalProfessionals.map((professional) => {
              if (professional.id === id) {
                return {
                  ...professional,
                  ...newDetails,
                };
              }
              return professional;
            })
          );
        }}
        onDeleteProfessional={(id: number) => {
          setInternalProfessionals(
            internalProfessionals.filter(
              (professional) => professional.id !== id
            )
          );
        }}
        dataFieldDefinitions={dataFieldDefinitions}
      />
    </div>
  );
};
