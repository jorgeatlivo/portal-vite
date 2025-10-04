import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress } from '@mui/material';

import {
  CreateUpdateFacilityStaff,
  FacilityStaff,
  FacilityStaffConfiguration,
  fetchFacilityStaffConfiguration,
} from '@/services/facility-staff';
import { Logger } from '@/services/logger.service';

import { ActionButton } from '@/components/common/ActionButton';
import { ModalContainer } from '@/components/common/ModalContainer';

import { FacilityStaffPermissionsComponent } from './FacilityStaffPermissions';
import { FacilityStaffPersonalData } from './FacilityStaffPersonalData';
import { FacilityStaffUnits } from './FacilityStaffUnits';
import { HeaderComponent } from './HeaderComponent';

interface CreateUpdateFacilityStaffModalProps {
  onSubmit: (
    facilityStaff: CreateUpdateFacilityStaff,
    id?: number
  ) => Promise<void>;
  edittingStaff: FacilityStaff | null;
  onClose: () => void;
  isOpen: boolean;
  onDeleteUser: () => void;
  facilityHasUnitsConfigured: boolean;
}

const CreateUpdateFacilityStaffModal: React.FC<
  CreateUpdateFacilityStaffModalProps
> = ({
  onSubmit,
  edittingStaff,
  onClose,
  isOpen,
  onDeleteUser,
  facilityHasUnitsConfigured,
}) => {
  const { t } = useTranslation('facility-staff');
  const [facilityStaffConfiguration, setFacilityStaffConfiguration] =
    useState<FacilityStaffConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState<string>(
    edittingStaff?.firstName || ''
  );
  const [lastName, setLastName] = useState<string>(
    edittingStaff?.lastName || ''
  );
  const [email, setEmail] = useState<string>(edittingStaff?.email || '');
  const [permissions, setPermissions] = useState<string[]>(
    edittingStaff?.permissions.map((permission) => permission.value) || []
  );
  const [units, setUnits] = useState<string[]>(
    edittingStaff?.units.map((unit) => unit.value) || []
  );
  const [admin, setIsAdmin] = useState<boolean>(
    edittingStaff?.facilityAdmin || false
  );

  const invalidPersonalData = !firstName || !lastName || !email;
  const invalidPermissions = permissions.length === 0;

  const loadConfig = () => {
    setLoading(true);
    fetchFacilityStaffConfiguration()
      .then((response) => {
        setFacilityStaffConfiguration(response!);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error('fetchFacilityStaffConfiguration', error);
        setLoading(false);
      });
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  useEffect(() => {
    setFirstName(edittingStaff?.firstName || '');
    setLastName(edittingStaff?.lastName || '');
    setEmail(edittingStaff?.email || '');
    setPermissions(
      edittingStaff?.permissions.map((permission) => permission.value) || []
    );
    setUnits(edittingStaff?.units.map((unit) => unit.value) || []);
  }, [edittingStaff]);

  const resetStaffData = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPermissions([]);
    setUnits([]);
    setIsAdmin(false);
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      style={{ width: '60%', maxWidth: '700px', minWidth: '350px' }}
      onClose={handleClose}
    >
      <div className="mx-auto flex h-[80vh] flex-col rounded-[16px] bg-white">
        {/* Header */}
        <HeaderComponent
          title={
            edittingStaff ? t('title_edit_member') : t('title_create_member')
          }
          onClose={handleClose}
        />

        {/* Scrollable Content */}
        <div
          className="no-scrollbar flex flex-col overflow-y-auto p-medium"
          style={{ flexGrow: 1, maxHeight: 'calc(80vh - 150px)' }}
        >
          {loading ? (
            <div
              className="flex items-center justify-center"
              style={{ height: '100%' }}
            >
              <CircularProgress />
            </div>
          ) : (
            <div className="flex w-full flex-col">
              <FacilityStaffPersonalData
                firstName={firstName}
                lastName={lastName}
                email={email}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setEmail={setEmail}
              />
              {facilityHasUnitsConfigured ? (
                <FacilityStaffUnits
                  addUnit={(unit: string) => setUnits([...units, unit])}
                  availableUnits={facilityStaffConfiguration?.units || []}
                  removeUnit={(unit: string) =>
                    setUnits(units.filter((item) => item !== unit))
                  }
                  units={units}
                />
              ) : null}
              <FacilityStaffPermissionsComponent
                permissions={permissions}
                togglePermission={(permission: string) => {
                  if (permissions.includes(permission)) {
                    setPermissions(
                      permissions.filter((item) => item !== permission)
                    );
                  } else {
                    setPermissions([...permissions, permission]);
                  }
                }}
                permissionList={facilityStaffConfiguration?.permissions || []}
                isAdmin={admin}
                toggleAdmin={() => {
                  if (admin) {
                    const initialPermission = facilityStaffConfiguration
                      ?.permissions[0]
                      ? facilityStaffConfiguration.permissions[0].value
                      : '';
                    setPermissions([initialPermission]);
                    setIsAdmin(false);
                  } else {
                    const allPermissions =
                      facilityStaffConfiguration?.permissions.map(
                        (permission) => permission.value
                      ) || [];
                    setPermissions(allPermissions);
                    setIsAdmin(true);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-Divider-Default p-large">
          {edittingStaff ? (
            <p
              onClick={onDeleteUser}
              className="action-regular cursor-pointer py-medium"
            >
              {t('delete_user_button')}
            </p>
          ) : (
            <p> </p>
          )}
          <div className="flex justify-end">
            <ActionButton
              isDisabled={invalidPersonalData || invalidPermissions}
              isLoading={loading}
              onClick={async () => {
                setLoading(true);
                await onSubmit(
                  {
                    firstName,
                    lastName,
                    email,
                    permissions,
                    units,
                    facilityAdmin: admin,
                  },
                  edittingStaff?.id
                );
                resetStaffData();
                setLoading(false);
              }}
            >
              <p className="action-regular py-small text-center">
                {edittingStaff
                  ? t('update_staff_button')
                  : t('create_staff_button')}
              </p>
            </ActionButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CreateUpdateFacilityStaffModal;
