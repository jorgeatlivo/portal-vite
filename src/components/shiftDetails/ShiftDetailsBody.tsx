import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { UserFeatureEnum } from '@/services/account';
import { RootState } from '@/store/types';

import { CategoryTag } from '@/components/common/CategoryTag';
import { CopyButton } from '@/components/common/CopyButton';
import { TagLabel } from '@/components/common/TagLabel';
import { ModalityTag } from '@/components/internal/ModalityTag';
import OnboardingShiftSection from '@/components/shiftDetails/OnboardingShiftSection';
import { ScheduleComponent } from '@/components/shifts/ScheduleComponent';

import { Shift } from '@/types/shifts';
import { formatShiftTitle, formatTimeSince } from '@/utils/utils';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';
import { formatDate, SHIFT_TIME_IN_DAY_DEFINITIONS } from '@/utils';
import { Typography } from '../atoms/Typography';
import { HolidayTag } from './HolidayTag';
import { ShiftDetailsRow } from './ShiftDetailsRow';

interface ShiftDetailsBodyProps {
  shift: Shift;
}

export const ShiftDetailsBody: React.FC<ShiftDetailsBodyProps> = ({
  shift,
}) => {
  const { t } = useTranslation([
    'shift-list',
    'internal-professional-page',
    'calendar',
    'shift-claim-details',
  ]);
  const isOnboarding = !!shift.onboarding;
  const shiftTimeInDayProps =
    SHIFT_TIME_IN_DAY_DEFINITIONS[shift.shiftTimeInDay];
  const poolAndInternalOnboarded =
    shift.livoPoolOnboarded && shift.livoInternalOnboarded;
  const priceVisible = shift.externalVisible && shift.formattedTotalPay;
  const compensationOptionsVisible =
    shift.compensationOptions && shift.internalVisible;
  const userFeatures = useSelector(
    (state: RootState) => state.account.accountInfo?.userFeatures
  );

  const hasProfessionalFields = !!shift.professionalField;
  const hasUnitAndFieldFeature = !!userFeatures?.includes(
    UserFeatureEnum.SHIFT_UNIT_AND_PRO_FIELDS_ENABLED
  );

  return (
    <div className="flex w-full flex-col space-y-xLarge p-large md:max-w-[33vw]">
      <div className="flex w-full flex-col">
        {/* title */}
        <div className="flex flex-row items-center gap-3 md:max-w-[33vw]">
          {shift.category && <CategoryTag text={shift.category.acronym} />}
          <Typography variant="heading/medium">
            {formatShiftTitle({
              hasUnitAndFieldFeature,
              hasProfessionalFields,
              unit: shift.unit,
              professionalField: shift.professionalField,
              title: shift.title,
            })}
          </Typography>
        </div>

        {poolAndInternalOnboarded && !isOnboarding && (
          <section className="my-2 flex flex-row gap-2">
            {shift.internalVisible && (
              <ModalityTag modality={ShiftModalityEnum.INTERNAL} />
            )}
            {shift.externalVisible && (
              <ModalityTag modality={ShiftModalityEnum.EXTERNAL} />
            )}
          </section>
        )}

        {isOnboarding && (
          <section className="my-2">
            <ModalityTag modality={ShiftModalityEnum.ONBOARDING} />
          </section>
        )}

        {/* create time */}
        {shift.createdAt && !isOnboarding && (
          <Typography variant="info/caption" color={colors['Text-Subtle']}>
            {formatTimeSince(shift.createdAt)}
          </Typography>
        )}
      </div>

      {!hasUnitAndFieldFeature && shift.skills.length > 0 && (
        <ShiftDetailsRow iconName="heartbeat">
          <div className="inline-flex flex-row flex-wrap items-center justify-start gap-tiny space-x-small">
            {shift.skills.map((skill, index) => (
              <TagLabel key={index} text={skill.displayText} />
            ))}
          </div>
        </ShiftDetailsRow>
      )}

      <div className="flex w-full flex-row items-center space-x-small">
        <ShiftDetailsRow
          iconName="calendar"
          style={{
            width: 'auto',
          }}
        >
          <Typography variant="body/regular">
            {formatDate(shift.startTime)}
          </Typography>
        </ShiftDetailsRow>
        <HolidayTag holiday={shift.holiday} />
      </div>

      {/* shift time */}
      <ShiftDetailsRow
        iconName={shiftTimeInDayProps.icon}
        iconColor={shiftTimeInDayProps.color}
      >
        <Typography variant="body/regular">
          {t(('calendar:' + shiftTimeInDayProps.name) as never)}
        </Typography>
      </ShiftDetailsRow>

      {/* shift schedule */}
      <ShiftDetailsRow iconName={'clock'}>
        <ScheduleComponent
          className="body-regular space-x-small"
          startTime={shift.startTime}
          finishTime={shift.finishTime}
        />
      </ShiftDetailsRow>

      {/* onboarding shift required */}
      {shift.onboardingShiftsRequired && (
        <ShiftDetailsRow
          icon={
            <ModalityTag shortTag modality={ShiftModalityEnum.ONBOARDING} />
          }
        >
          <Typography variant="body/regular">
            {t('shift-claim-details:onboarding_shift_required')}
          </Typography>
        </ShiftDetailsRow>
      )}

      {(priceVisible || compensationOptionsVisible) && (
        <ShiftDetailsRow iconName={'cash-banknote'}>
          <div className="flex w-full flex-col gap-1">
            <div className="flex w-full flex-row flex-wrap items-start space-x-small">
              <Typography variant="body/regular" className="pr-2">
                {!!priceVisible && shift.formattedTotalPay}
                {priceVisible && compensationOptionsVisible && ' | '}
                {compensationOptionsVisible &&
                  shift.compensationOptions
                    .map((option) => option.displayText)
                    .join(', ')}
              </Typography>
            </div>
            {/* onboarding shift price */}
            {shift.onboardingShiftsPrice && shift.onboardingShiftsRequired && (
              <Typography variant="body/regular" color={colors['Text-Subtle']}>
                {t('shift-claim-details:shift_onboarding_price', {
                  price: shift.onboardingShiftsPrice,
                })}
              </Typography>
            )}
          </div>
        </ShiftDetailsRow>
      )}

      {shift.details && (
        <ShiftDetailsRow
          iconName="blockquote"
          style={{
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="info/caption" className="p-tiny">
            {shift.details}
          </Typography>
        </ShiftDetailsRow>
      )}

      {shift.externalId && (
        <div className="flex flex-row items-center justify-start space-x-small">
          <div>
            <ShiftDetailsRow iconName="hash">
              <Typography variant="body/regular" className="pr-2">
                {shift.externalId}
              </Typography>
            </ShiftDetailsRow>
          </div>
          <CopyButton
            successMessage={t('identifier_copied')}
            text={shift.externalId}
          />
        </div>
      )}
      {isOnboarding && shift.onboarding?.coverageShift && (
        <OnboardingShiftSection
          title={t('shift-claim-details:coverage_shift_title')}
          claimShift={shift.onboarding?.coverageShift}
          displayFields
        />
      )}
    </div>
  );
};
