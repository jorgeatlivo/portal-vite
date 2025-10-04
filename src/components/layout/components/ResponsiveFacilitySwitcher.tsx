import { useCallback, useEffect, useMemo, useState } from 'react';

import { FacilityGroupInfo } from '@/services/account';

import FacilitySwitcherModal from '@/components/common/modal/FacilitySwitcherModal/FacilitySwitcherModal';
import { SideBarButton } from '@/components/layout/components/SideBarButton';

import { useModal } from '@/hooks/use-modal';

import { AppHeaderButton } from './AppHeaderButton';

interface Props {
  facilityGroup: FacilityGroupInfo;
  expanded: boolean;
  header?: boolean;
}

export const ResponsiveFacilitySwitcher = ({
  facilityGroup,
  expanded,
  header,
}: Props) => {
  const { openModal, closeModal, modalContent } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    if (facilityGroup.facilities.length > 1) {
      setIsModalOpen(true);
      openModal(<FacilitySwitcherModal closeModal={closeModal} />, {
        className:
          '!bg-Grey-050 w-[450px] max-w-[95dvw] !shadow-lg !rounded-2xl !p-0 !overflow-hidden',
      });
    }
  }, [closeModal, facilityGroup.facilities.length, openModal]);

  useEffect(() => {
    if (!modalContent && isModalOpen) setIsModalOpen(false);
  }, [isModalOpen, modalContent, setIsModalOpen]);

  const selectedFacility = useMemo(
    () => facilityGroup.facilities.find(({ selected }) => selected),
    [facilityGroup]
  );

  return header ? (
    <AppHeaderButton
      iconName={'internal-hospital'}
      imgUrl={selectedFacility?.imgUrl}
      label={selectedFacility?.name ?? ''}
      isFocused={isModalOpen}
      onClick={handleOpenModal}
      smallLabel
    />
  ) : (
    <SideBarButton
      expanded={expanded}
      iconName={'internal-hospital'}
      imgUrl={selectedFacility?.imgUrl}
      label={selectedFacility?.name ?? ''}
      isFocused={isModalOpen}
      onClick={handleOpenModal}
      smallLabel
      chevron
    />
  );
};
