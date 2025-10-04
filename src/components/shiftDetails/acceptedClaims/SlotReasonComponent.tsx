import { useTranslation } from 'react-i18next';

import { ExpandableText } from '@/components/common/ExpandableText';

import colors from '@/config/color-palette';
import { SlotReason } from '../../../types/claims';
import LivoIcon from '../../common/LivoIcon';

interface SlotReasonComponentProps {
  reason: SlotReason | null;
  professionalName: string;
  onPress: () => void;
}

export const SlotReasonComponent: React.FC<SlotReasonComponentProps> = ({
  reason,
  professionalName,
  onPress,
}) => {
  const { t } = useTranslation('shift-claim-details');
  return (
    <div
      onClick={onPress}
      className="flex w-full cursor-pointer flex-col hover:bg-Background-Secondary"
    >
      <p className="body-small">{professionalName}</p>
      <div className="flex flex-row items-start space-x-tiny">
        <div className="flex items-center justify-center">
          <LivoIcon name="replace" size={24} color={colors['Grey-400']} />
        </div>
        <div className="flex w-full flex-col">
          {reason ? (
            <>
              <p className="subtitle-regular">{reason.displayText}</p>
              <ExpandableText
                textClassName="info-caption text-Text-Subtle"
                text={reason.comment || ' \n'}
                maxLines={1}
              />
            </>
          ) : (
            <>
              <p className="subtitle-regular text-Text-Light">
                {t('empty_slot_reason')}
              </p>
              <p className="info-caption text-Text-Light">{'\n'}</p>
            </>
          )}
        </div>
        <LivoIcon
          size={24}
          name="chevron-right"
          color={colors['Primary-500']}
        />
      </div>
    </div>
  );
};
