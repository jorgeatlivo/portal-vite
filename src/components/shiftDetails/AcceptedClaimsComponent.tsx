import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Toggle } from '@/components/common/buttons/Toggle';
import LivoIcon from '@/components/common/LivoIcon';
import { ShiftCardTag } from '@/components/shifts/ShiftCardTag';

import { ClaimRequest } from '@/types/claims';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';
import { AcceptedProfessionalsList } from './acceptedClaims/AcceptedProfessionalsList';
import { SlotReasons } from './acceptedClaims/SlotReasons';
import { EditCapacityModal } from './EditCapacityModal';

interface AcceptedClaimsComponentProps {
  claims?: ClaimRequest[];
  capacity: number;
  updateCapacity: (newCapacity: number) => void;
  editable: boolean;
  onDecreaseCapacity: () => void;
  selectClaim: (claim: ClaimRequest) => void;
  shouldShowSlotReasonList: boolean;
  selectedOption: string;
  setSelectedOption: (newSelection: string) => void;
}
export const AcceptedClaimsComponent: React.FC<
  AcceptedClaimsComponentProps
> = ({
  claims,
  capacity,
  updateCapacity,
  editable,
  onDecreaseCapacity,
  selectClaim,
  shouldShowSlotReasonList,
  selectedOption,
  setSelectedOption,
}) => {
  const { t } = useTranslation('shift-claim-details');
  const [isCapacityModalOpen, setCapacityModalOpen] = useState(false);

  const cancellationRequests = claims?.filter(
    (claim) => claim.cancellationRequest
  );

  return (
    <div className={'flex w-full flex-1 flex-col'}>
      <div className="flex w-full flex-col p-large md:max-w-[33vw]">
        <div className="flex flex-col pb-large">
          <div className="flex flex-row items-center justify-between space-x-small">
            <div className="flex flex-row items-center space-x-small pt-small">
              <LivoIcon name="user" size={24} color={colors['Grey-400']} />
              <Typography variant="body/regular">
                {t('professionals_label')}
              </Typography>
              {Array.isArray(cancellationRequests) &&
              cancellationRequests.length > 0 ? (
                <ShiftCardTag
                  totalPendingClaims={cancellationRequests?.length ?? 0}
                  isFilled={false}
                />
              ) : null}
            </div>
            <div className="flex flex-row items-center">
              <Typography variant="body/regular" className="ml-tiny">
                {claims?.length}
              </Typography>
              <Typography variant="body/regular" color={colors['Text-Light']}>
                /{capacity}
              </Typography>
            </div>
          </div>
          {shouldShowSlotReasonList ? (
            <Toggle
              style={{
                marginTop: '8px',
              }}
              option1={{
                label: t('confirmed_label'),
                value: 'professionals',
              }}
              option2={{
                label: t('reasons_label'),
                value: 'reasons',
              }}
              selectedOption={selectedOption}
              setSelectedOption={(newSelection) => {
                setSelectedOption(newSelection);
              }}
              unselectedColor={colors['Neutral-100']}
              unselectedTextColor={colors['Mint-700']}
              selectedColor={colors['Mint-700']}
              selectedTextColor="#FFFFFF"
            />
          ) : null}
        </div>
        {selectedOption === 'professionals' ? (
          <AcceptedProfessionalsList
            claims={claims ?? []}
            selectClaim={selectClaim}
            capacity={capacity}
            editable={editable}
            onDecreaseCapacity={onDecreaseCapacity}
            setCapacityModalOpen={setCapacityModalOpen}
          />
        ) : (
          <SlotReasons claims={claims ?? []} onPress={selectClaim} />
        )}
        <EditCapacityModal
          isOpen={isCapacityModalOpen}
          maxCapacity={5 - capacity}
          goBack={() => setCapacityModalOpen(false)}
          addCapacity={(newCapacity: number) => {
            updateCapacity(newCapacity + capacity);
            setCapacityModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};
