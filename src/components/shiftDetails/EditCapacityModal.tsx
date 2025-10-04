import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LivoIcon from '@/components/common/LivoIcon';
import { ModalContainer } from '@/components/common/ModalContainer';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';

interface EditCapacityModalProps {
  isOpen: boolean;
  addCapacity: (newCapacity: number) => void;
  maxCapacity: number;
  goBack: () => void;
}
export const EditCapacityModal: React.FC<EditCapacityModalProps> = ({
  isOpen,
  addCapacity,
  maxCapacity,
  goBack,
}) => {
  const { t } = useTranslation('shift-claim-details');
  const [numberOfSpots, setNumberOfSpots] = useState(1);

  return (
    <ModalContainer isOpen={isOpen} onClose={goBack}>
      <div className="mx-2 flex flex-col gap-4 rounded-[16px] bg-white p-medium shadow-custom md:w-[410px]">
        <Typography variant="heading/small" className="pb-2">
          {t('add_capacity_modal_title')}
        </Typography>
        <div className="flex flex-row items-center justify-center space-x-medium">
          <button
            type="button"
            disabled={numberOfSpots <= 1}
            onClick={() => setNumberOfSpots((nSpots) => nSpots - 1)}
          >
            <LivoIcon
              size={24}
              name="minus"
              color={colors[numberOfSpots > 1 ? 'Primary-500' : 'Grey-200']}
            />
          </button>
          <div className="ring-solid flex w-[90px] items-center justify-center rounded-[4px] py-medium text-center ring-1 ring-Grey-400">
            <Typography variant="body/regular" color={colors['Primary-800']}>
              {numberOfSpots}
            </Typography>
          </div>
          <button
            type="button"
            disabled={numberOfSpots >= maxCapacity}
            onClick={() => setNumberOfSpots((nSpots) => nSpots + 1)}
          >
            <LivoIcon
              size={24}
              name="plus"
              color={
                colors[numberOfSpots < maxCapacity ? 'Primary-500' : 'Grey-200']
              }
            />
          </button>
        </div>
        <div className="mt-large flex flex-row items-center">
          <button
            type="button"
            onClick={() => goBack()}
            className="flex flex-1 items-center justify-center px-small py-large text-center text-Primary-500"
          >
            <Typography variant="action/regular" color={colors['Primary-500']}>
              {t('add_capacity_modal_go_back')}
            </Typography>
          </button>
          <button
            type="button"
            className="flex flex-1 justify-center rounded-[100px] bg-Primary-500 px-small py-large text-center text-Text-Inverse"
            onClick={() => addCapacity(numberOfSpots)}
          >
            <Typography variant="action/regular" color={colors['Neutral-000']}>
              {t('add_capacity_modal_button')}
            </Typography>
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};
