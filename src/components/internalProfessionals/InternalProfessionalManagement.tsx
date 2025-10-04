import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

import { ApiApplicationError } from '@/services/api';
import {
  acceptProfessionalRequest,
  deleteProfessional,
  fetchInternalProfessionalInfo,
  rejectProfessionalRequest,
  updateInternalProfessionalInfo,
} from '@/services/internal';
import { Logger } from '@/services/logger.service';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import { Category } from '@/types/common/category';
import {
  DataFieldSubmission,
  FacilityDataFieldDefinition,
  InternalProfessional,
  InvitationStatus,
} from '@/types/internal';

import { AppDispatch } from '@/store';
import { InternalProfessionalDetails } from './InternalProfessionalDetails';
import { InternalProfessionalHeader } from './InternalProfessionalHeader';

interface InternalProfessionalManagementProps {
  selectedProfessionalId: number | null;
  setSelectedProfessionalId: (id: number | null) => void;
  handleProfessionalRequest: () => void;
  editProfessionalDetails: (id: number, data: InternalProfessional) => void;
  onDeleteProfessional: (id: number) => void;
  dataFieldDefinitions: FacilityDataFieldDefinition[];
}
export const InternalProfessionalManagement: React.FC<
  InternalProfessionalManagementProps
> = ({
  selectedProfessionalId,
  setSelectedProfessionalId,
  handleProfessionalRequest,
  editProfessionalDetails,
  onDeleteProfessional,
  dataFieldDefinitions,
}) => {
  const [professionalDetails, setProfessionalDetails] =
    useState<InternalProfessional | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditting, setIsEditting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const loadData = async () => {
    if (!selectedProfessionalId) {
      return;
    }
    setLoading(true);
    await fetchInternalProfessionalInfo(selectedProfessionalId)
      .then((data) => {
        setLoading(false);
        if (data) {
          setProfessionalDetails(data);
        }
      })
      .catch((error) => {
        setLoading(false);
        Logger.error('fetchInternalProfessionalInfo', error);
      });
  };

  useEffect(() => {
    loadData();
    setIsEditting(false);
  }, [selectedProfessionalId]);

  const handleUpdateProfessional = async (
    newConfiguration: DataFieldSubmission[],
    newCategory: Category,
    newSkills: string[]
  ) => {
    setLoading(true);
    await updateInternalProfessionalInfo(professionalDetails!.id, {
      dataFields: newConfiguration,
      category: newCategory.code,
      professionalSkills: newSkills,
    })
      .then(async (updatedProfile: InternalProfessional) => {
        setLoading(false);
        dispatch(
          showToastAction({
            message: 'Cambios guardados',
            severity: 'success',
          })
        );
        setIsEditting(false);
        setLoading(true);
        await loadData();
        editProfessionalDetails(professionalDetails!.id, updatedProfile);
      })
      .catch((error) => {
        setLoading(false);
        setIsEditting(false);
        Logger.debug(error);
        dispatch(
          showToastAction({
            message:
              error instanceof ApiApplicationError
                ? error.message
                : 'Error al guardar cambios',
            severity: 'error',
          })
        );
      });
  };

  const handleAcceptProfessional = async (
    newConfiguration: DataFieldSubmission[],
    newCategory: Category,
    newSkills: string[]
  ) => {
    setLoading(true);
    await acceptProfessionalRequest(professionalDetails!.id, {
      dataFields: newConfiguration,
      category: newCategory.code,
      professionalSkills: newSkills,
    })
      .then(async () => {
        setLoading(false);
        dispatch(
          showToastAction({
            message: 'Profesional añadido',
            severity: 'success',
          })
        );
        setLoading(true);
        await loadData();
        await handleProfessionalRequest();
      })
      .catch((error) => {
        setLoading(false);
        dispatch(
          showToastAction({
            message:
              error instanceof ApiApplicationError
                ? error.message
                : 'Error al aceptar al profesional',
            severity: 'error',
          })
        );
      });
  };

  const handleRejectProfessional = async () => {
    setLoading(true);
    await rejectProfessionalRequest(professionalDetails!.id)
      .then(async () => {
        setLoading(false);
        dispatch(
          showToastAction({
            message: 'Has rechazado la solicitud',
            severity: 'success',
          })
        );
        setIsEditting(false);
        setLoading(true);
        setSelectedProfessionalId(null);
        await handleProfessionalRequest();
      })
      .catch((error) => {
        setLoading(false);
        dispatch(
          showToastAction({
            message:
              error instanceof ApiApplicationError
                ? error.message
                : 'Error al rechazar la solicitud',
            severity: 'error',
          })
        );
      });
  };

  const handleDeleteProfessional = async () => {
    setLoading(true);
    await deleteProfessional(professionalDetails!.id)
      .then(async () => {
        setLoading(false);
        dispatch(
          showToastAction({
            message: 'Has dado de baja al profesional',
            severity: 'success',
          })
        );
        setSelectedProfessionalId(null);
        setIsEditting(false);
        onDeleteProfessional(professionalDetails!.id);
      })
      .catch((error) => {
        setLoading(false);
        dispatch(
          showToastAction({
            message:
              error instanceof ApiApplicationError
                ? error.message
                : 'Error al eliminar al profesional',
            severity: 'error',
          })
        );
      });
  };

  return (
    <div
      className={clsx(
        selectedProfessionalId &&
          'inset-0 md:left-auto xl:static xl:inset-auto',
        'transition-width absolute !m-0 flex-col duration-100 ease-in-out md:flex',
        selectedProfessionalId ? 'md:w-[30%] md:min-w-[450px]' : 'md:w-0'
      )}
    >
      <div
        className={`flex h-full border-l border-solid border-Divider-Subtle bg-white`}
      >
        {loading && selectedProfessionalId ? (
          <div className="flex size-full flex-col items-center justify-center">
            <CircularProgress />
          </div>
        ) : selectedProfessionalId && professionalDetails ? (
          <div className="flex size-full flex-1 flex-col space-y-small pt-xLarge">
            <InternalProfessionalHeader
              onClose={() => {
                setSelectedProfessionalId(null);
              }}
              onDelete={() => {
                handleDeleteProfessional();
              }}
              onEdit={() => {
                setIsEditting(true);
              }}
              editable={
                professionalDetails.invitationStatus ===
                InvitationStatus.ACCEPTED
              }
            />

            <InternalProfessionalDetails
              professional={professionalDetails}
              onEdit={(
                newDetails: DataFieldSubmission[],
                newCategory: Category,
                newSkills: string[]
              ) => {
                handleUpdateProfessional(newDetails, newCategory, newSkills);
              }}
              onCancelEdit={() => {
                setIsEditting(false);
              }}
              isEditting={isEditting}
              onAcceptProfessional={(
                newDetails: DataFieldSubmission[],
                newCategory: Category,
                newSkills: string[]
              ) => {
                handleAcceptProfessional(newDetails, newCategory, newSkills);
              }}
              onRejectProfessional={handleRejectProfessional}
              dataFieldDefinitions={dataFieldDefinitions}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
