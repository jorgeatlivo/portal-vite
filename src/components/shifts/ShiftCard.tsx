import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import clsx from 'clsx';

import { UserFeatureEnum } from '@/services/account';
import { RootState } from '@/store/types';

import { Typography } from '@/components/atoms/Typography';
import { CategoryTag } from '@/components/common/CategoryTag';
import { SortingOptionsEnum } from '@/components/common/SortingSelector';
import { TagLabel } from '@/components/common/TagLabel';
import { ModalityTag } from '@/components/internal/ModalityTag';
import { CapacityComponent } from '@/components/shifts/CapacityComponent';
import { ScheduleComponent } from '@/components/shifts/ScheduleComponent';
import { ShiftCardContainer } from '@/components/shifts/ShiftCardContainer';
import { ShiftCardTag } from '@/components/shifts/ShiftCardTag';

import {
  ActionComponentIdEnum,
  Shift,
  ShiftTimeStatusEnum,
} from '@/types/shifts';
import { formatShiftTitle } from '@/utils/utils';

import { ShiftModalityEnum } from '@/types';
import { formatDate, getDate, getWeekDay } from '@/utils';

interface ShiftCardProps {
  shift: Shift;
  isSelected?: boolean;
  onClick?: () => void;
  showShiftTime?: boolean;
  showCapacity?: boolean;
  showSkillTags?: boolean;
  actionComponents?: {
    iconName: string;
    onClick: (shift: Shift) => void;
    id: ActionComponentIdEnum;
  }[];
  sortedBy?: SortingOptionsEnum;
}

const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  isSelected,
  onClick,
  actionComponents,
  sortedBy,
  showShiftTime = false,
  showCapacity = true,
  showSkillTags = true,
}) => {
  const { t } = useTranslation('shift-claim-list');
  const userFeatures = useSelector(
    (state: RootState) => state.account.accountInfo?.userFeatures
  );
  const isOnboardingShift = !!shift.onboarding;

  const poolAndInternalOnboarded =
    shift.livoPoolOnboarded && shift.livoInternalOnboarded;

  const PublicationTimeColumn = () => (
    <div className="flex w-full flex-1 items-end justify-end space-x-medium">
      <div className="body-sm flex items-center justify-end">
        {t('published_label', {
          date: getDate(shift.createdAt),
        })}
      </div>
    </div>
  );

  const ShiftTimeColumn = () => (
    <div className="flex w-full flex-1 items-end justify-end space-x-medium">
      <div className="body-sm flex items-center justify-end">
        {getWeekDay(shift.startTime)} {getDate(shift.startTime)}
      </div>
    </div>
  );

  const icons = (
    <div
      className={clsx(
        'absolute left-14 top-large flex w-auto items-center gap-1',
        '@lg:static @lg:left-0 @lg:top-0 @lg:w-[108px]'
      )}
    >
      {poolAndInternalOnboarded && !isOnboardingShift && (
        <>
          {shift.externalVisible && (
            <ModalityTag
              modality={ShiftModalityEnum.EXTERNAL}
              style={isSelected ? 'bg-Primary-100' : ''}
              shortTag={true}
            />
          )}
          {shift.internalVisible && (
            <ModalityTag
              modality={ShiftModalityEnum.INTERNAL}
              style={isSelected ? 'mr-tiny bg-Secondary-050' : 'mr-tiny'}
              shortTag={true}
            />
          )}
        </>
      )}
      {(isOnboardingShift || shift.onboardingShiftsRequired) && (
        <ModalityTag modality={ShiftModalityEnum.ONBOARDING} shortTag={true} />
      )}
    </div>
  );

  const hasProfessionalFields = !!shift.professionalField;
  const hasUnitAndFieldFeature = !!userFeatures?.includes(
    UserFeatureEnum.SHIFT_UNIT_AND_PRO_FIELDS_ENABLED
  );

  const cardContent = (
    <div className="flex w-full flex-col @container">
      <div
        className={clsx(
          'flex w-full flex-1 flex-col justify-between gap-1 p-small py-large',
          '@lg:flex-row @lg:items-center @lg:gap-2',
          isSelected && 'selected-card'
        )}
      >
        {/* category */}
        <CategoryTag text={shift.category.acronym} />

        {/* title */}
        <Typography
          variant="heading/small"
          className={clsx(
            'truncate',
            '@lg:!subtitle/regular @lg:w-64',
            isSelected && 'text-Text-Inverse'
          )}
        >
          {formatShiftTitle({
            hasUnitAndFieldFeature,
            hasProfessionalFields,
            unit: shift.unit,
            professionalField: shift.professionalField,
            title: shift.title,
          })}
        </Typography>
        <div className="flex w-full flex-1 flex-row items-center justify-start gap-1">
          {/* icons */}
          {icons}

          {hasUnitAndFieldFeature && (
            <Typography
              variant="subtitle/regular"
              className={clsx(
                'truncate',
                '@lg:!subtitle/regular',
                isSelected && 'text-Text-Inverse'
              )}
            >
              <span className="hidden @lg:inline">
                {getDate(shift.startTime)}
              </span>
              <span className="inline @lg:hidden">
                {isSelected
                  ? formatDate(shift.startTime, isSelected)
                  : getDate(shift.startTime)}
              </span>
            </Typography>
          )}

          {!hasUnitAndFieldFeature &&
            shift.skills.map((skill, index) => (
              <TagLabel key={index} text={skill.displayText} />
            ))}
        </div>
        <div className="flex flex-1 flex-row items-center justify-between space-x-small">
          {sortedBy === SortingOptionsEnum.SHIFT_PUBLICATION_TIME && (
            <ShiftTimeColumn />
          )}
          <div className="flex flex-row items-center justify-center gap-5">
            {!hasUnitAndFieldFeature && <p>{getDate(shift.startTime)}</p>}
            <ScheduleComponent
              className="body-lg gap-2"
              startTime={shift.startTime}
              finishTime={shift.finishTime}
            />
          </div>

          {sortedBy === SortingOptionsEnum.SHIFT_TIME && (
            <PublicationTimeColumn />
          )}

          <div className="flex w-full flex-1 items-center justify-end gap-2">
            <div className="flex items-center justify-end">
              {showCapacity && (
                <CapacityComponent
                  totalPendingInvitationClaims={
                    shift.totalPendingInvitationClaims
                  }
                  acceptedClaims={shift.totalAcceptedClaims}
                  totalAcceptedClaimsWithoutHRIntegration={
                    shift.totalAcceptedClaimsWithoutHRIntegration
                  }
                  emptyClaims={
                    shift.capacity -
                    shift.totalAcceptedClaims -
                    (shift?.totalPendingInvitationClaims || 0)
                  }
                />
              )}
            </div>
            <div
              className={clsx(
                'absolute right-2 top-large ',
                '@lg:static @lg:right-0 @lg:top-0'
              )}
            >
              <ShiftCardTag
                totalPendingClaims={
                  shift.totalPendingClaims + shift.totalCancellationRequests
                }
                isFilled={
                  shift.totalAcceptedClaims === shift.capacity &&
                  shift.totalCancellationRequests === 0
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const actionsComponents = useMemo(() => {
    if (!shift.shiftActionsAllow) {
      return [];
    }

    return actionComponents?.filter((actionComponent) => {
      if (shift.shiftTimeStatus !== ShiftTimeStatusEnum.UPCOMING) {
        return actionComponent.id !== ActionComponentIdEnum.EDIT;
      }
      return true;
    });
  }, [actionComponents, shift.shiftActionsAllow, shift.shiftTimeStatus]);

  return (
    <div className="w-full">
      <ShiftCardContainer
        shift={shift}
        isSelected={isSelected}
        onClick={onClick}
        actionComponents={actionsComponents}
      >
        {cardContent}
      </ShiftCardContainer>
    </div>
  );
};

export default ShiftCard;
