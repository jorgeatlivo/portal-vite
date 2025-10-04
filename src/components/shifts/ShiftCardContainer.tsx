import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from '@mui/material';
import clsx from 'clsx';

import { Shift } from '@/types/shifts';
import { markdown } from '@/utils/markdown';

import { getDate, SHIFT_TIME_IN_DAY_DEFINITIONS } from '@/utils';
import { ShiftCardActions } from './ShiftCardActions';

interface ShiftCardContainerProps {
  shift: Shift;
  onClick?: () => void;
  isSelected?: boolean;
  fadeTooltipText?: string;

  children: React.ReactNode;
  actionComponents?: {
    iconName: string;
    onClick: (shift: Shift) => void;
  }[];
}

export const ShiftCardContainer: React.FC<ShiftCardContainerProps> = ({
  shift,
  isSelected,
  onClick,
  children,
  actionComponents,
}) => {
  const { t } = useTranslation(['shift-claim-details', 'calendar']);
  const shiftTimeInDay = SHIFT_TIME_IN_DAY_DEFINITIONS[shift.shiftTimeInDay];
  const cardColor = `bg-[${shiftTimeInDay.color}]`;
  const actionComponentsWithShifts = actionComponents?.map(
    (actionComponent) => ({
      iconName: actionComponent.iconName,
      onClick: () => {
        actionComponent.onClick(shift);
      },
    })
  );

  const isFade = shift?.onboarding?.status === 'PENDING_APPROVAL';

  const fadeTooltipText = useMemo(() => {
    const { onboarding } = shift || {};
    if (onboarding?.status !== 'PENDING_APPROVAL') {
      return '';
    }

    return markdown(
      t('onboarding_shift_tooltip', {
        unit: onboarding?.coverageShift.livoUnit ?? '--',
        fields: onboarding?.coverageShift.specialization ?? '--',
        day: getDate(
          shift?.onboarding?.coverageShift?.startTime || '',
          t('calendar:datetime_format_day_of_month')
        ),
      })
    );
  }, [shift, t]);
  return (
    <Tooltip
      placement="bottom"
      disableHoverListener={!isFade || !fadeTooltipText}
      /**
       * 500 is the default behavior for long interactions in MUI
       * This is to ensure that the tooltip does not appear immediately
       */
      enterDelay={500}
      enterNextDelay={500}
      title={fadeTooltipText ?? ''}
    >
      <div
        className={clsx(
          'group relative',
          isFade ? 'opacity-50' : 'opacity-100'
        )}
      >
        <div
          onClick={onClick}
          className={clsx(
            'relative flex min-w-[200px] max-w-full flex-row overflow-hidden rounded-xl transition-shadow duration-300 ease-in-out',
            isSelected
              ? 'bg-Action-Secondary text-Text-Inverse shadow-md'
              : 'bg-white shadow-sm hover:shadow-md',
            !!onClick && 'cursor-pointer'
          )}
        >
          <div className={`w-small ${cardColor} flex overflow-hidden`} />
          {children}
        </div>
        {/* card actions */}
        {Array.isArray(actionComponentsWithShifts) &&
          actionComponentsWithShifts.length > 0 && (
            <div className="absolute -top-small right-large flex items-center justify-end opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
              <ShiftCardActions actionComponents={actionComponentsWithShifts} />
            </div>
          )}
      </div>
    </Tooltip>
  );
};
