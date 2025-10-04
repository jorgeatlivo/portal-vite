import React from 'react';
import { useTranslation } from 'react-i18next';

import { IconCalendarEvent, IconClock } from '@tabler/icons-react';
import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';
import Chip from '@/components/common/Chip';
import { CopyButton } from '@/components/common/CopyButton';
import LivoIcon from '@/components/common/LivoIcon';
import OfferStatus from '@/components/Offer/OfferStatus';

import { OfferDetail } from '@/types/offers';

import colors from '@/config/color-palette';
import {
  joinSchedule,
  mapContractType,
  mapSalary,
  mapStartDateToText,
  NOT_DELETABLE_STATUSES,
  NOT_EDITABLE_STATUSES,
} from '@/pages/OfferDetail/utils';
import { useOfferLabels } from '../hooks/useOfferTitle';
import OfferActionsPopper from '../OfferDetailPage/components/OfferActionPopper';

interface OfferInfoCardProps {
  offer: OfferDetail;
  isDetailView?: boolean;
}

const OfferInfoCard: React.FC<OfferInfoCardProps> = ({
  offer,
  isDetailView,
}) => {
  const { t } = useTranslation(['offers', 'shift-list']);
  const { startDate } = offer ?? {};
  const { getOfferTitle } = useOfferLabels();

  return (
    <article
      className={clsx(
        isDetailView ? 'p-6' : 'p-2',
        'no-scrollbar size-full overflow-y-auto rounded-lg bg-white pb-[48px]'
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        {!!offer.status && <OfferStatus {...offer.statusTag} />}
        {isDetailView && (
          <OfferActionsPopper
            offer={offer}
            disabledDelete={NOT_DELETABLE_STATUSES.includes(offer.status)}
            disabledEdit={NOT_EDITABLE_STATUSES.includes(offer.status)}
          />
        )}
      </div>

      {/* Job Description */}
      <div className="mb-xLarge">
        <Typography variant={'heading/small'} className={'pb-small'}>
          {t('facility')}
        </Typography>
        <div className="mb-small flex items-center gap-small">
          <LivoIcon
            size={24}
            name="internal-hospital"
            color={colors['Neutral-400']}
          />
          <Typography variant={'body/regular'}>{offer.facilityName}</Typography>
        </div>
      </div>

      {/* Job Description */}
      <div className="mb-xLarge">
        <Typography variant={'heading/small'} className={'pb-small'}>
          {t('job_description')}
        </Typography>
        <div className="mb-small flex items-center gap-small">
          <LivoIcon name="vaccine" size={24} color={colors['Neutral-400']} />
          <Typography variant={'body/regular'}>
            {offer.categoryDisplayText}
          </Typography>
        </div>
        {offer.livoUnit && (
          <div className="mb-small flex items-center gap-small">
            <LivoIcon
              name="patient-in-bed"
              size={24}
              color={colors['Neutral-400']}
            />
            <Typography variant={'body/regular'}>
              {offer.livoUnit.displayText}
            </Typography>
          </div>
        )}
        {offer.professionalField && (
          <div className="mb-small flex items-center gap-small">
            <LivoIcon
              name="heartbeat"
              size={24}
              color={colors['Neutral-400']}
            />
            <Typography variant={'body/regular'}>
              {offer.professionalField.displayText}
            </Typography>
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="mb-xLarge">
        <Typography variant={'heading/small'} className={'pb-small'}>
          {t('offer_contract')}
        </Typography>
        <div className="mb-small flex items-center gap-small">
          <IconCalendarEvent size={24} color={colors['Neutral-400']} />
          <Typography variant={'body/regular'}>
            {mapContractType(offer.contractType) ?? '-'}
          </Typography>
        </div>
        <div className="mb-small flex items-center gap-small">
          <IconClock size={24} color={colors['Neutral-400']} />
          <Typography variant={'body/regular'}>
            {mapStartDateToText(startDate?.type, startDate?.date) ?? '-'}
          </Typography>
        </div>

        <div className="mb-small">
          <div className="flex items-center gap-small">
            <IconClock size={24} color={colors['Neutral-400']} />
            <Typography variant={'body/regular'}>
              {joinSchedule(offer.schedules) ?? '-'}
            </Typography>
          </div>
          {offer.scheduleDetails ? (
            <Typography variant={'body/regular'} className=" ml-9">
              {offer.scheduleDetails}
            </Typography>
          ) : null}
        </div>
      </div>

      {/* Compensation */}
      <div className="mb-xLarge">
        <Typography variant={'heading/small'} className={'pb-small'}>
          {t('offer_compensation')}
        </Typography>
        <div className="flex items-center gap-small">
          <LivoIcon
            name={'cash-banknote'}
            size={24}
            color={colors['Neutral-400']}
          />
          <Typography variant={'body/regular'} color={colors['Green-700']}>
            {mapSalary(offer.salaryMin, offer.salaryMax, offer.salaryPeriod)}
          </Typography>
        </div>
        {offer.salaryDetails && (
          <Typography variant={'body/regular'} className="ml-small pl-6">
            {offer.salaryDetails}
          </Typography>
        )}
      </div>

      {/* Perks */}
      <div className="mb-xLarge">
        <Typography variant={'heading/small'} className={'pb-small'}>
          {t('offer_perks')}
        </Typography>
        {offer.perks && offer.perks.length > 0 ? (
          <div className="flex flex-wrap gap-tiny">
            {offer.perks.map((perk) => (
              <Chip
                key={`skill-${perk.displayText}`}
                label={perk.displayText}
                icon={
                  perk.icon && (
                    <LivoIcon
                      size={16}
                      name={perk.icon}
                      color={colors['Text-Subtle']}
                    />
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            <LivoIcon
              size={24}
              name={'cash-banknote'}
              color={colors['Neutral-400']}
            />
            <Typography variant={'body/regular'} color={colors['Grey-700']}>
              {t('offer_empty_data')}
            </Typography>
          </div>
        )}
      </div>

      {/* Requirements */}
      <div className="mb-xLarge">
        <Typography variant={'heading/small'} className={'pb-small'}>
          {t('offer_requirements')}
        </Typography>
        {offer.requirements && offer.requirements.length > 0 ? (
          offer.requirements.map((req) => (
            <div
              key={`skills-${req.livoUnit?.value ?? req.professionalField?.value}-${req.experience.value}`}
              className="mb-1 flex items-center text-gray-700"
            >
              <LivoIcon
                size={24}
                name={'circle-check'}
                color={colors['Neutral-400']}
              />
              <div className="ml-small">
                <Chip
                  label={getOfferTitle(
                    req.livoUnit?.displayText,
                    undefined,
                    req.professionalField?.displayText
                  )}
                />
              </div>
              <span className="info-caption ml-small text-Text-Subtle">
                {req?.experience?.displayText}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-row space-x-small">
            <LivoIcon
              name="stethoscope"
              size={24}
              color={colors['Neutral-400']}
            />
            <Typography variant={'body/regular'}>
              {t('no_experience')}
            </Typography>
          </div>
        )}
        <div className="mb-1 flex w-full flex-wrap items-center gap-2 overflow-hidden pl-huge">
          {offer.additionalRequirements ? (
            <Typography variant={'body/regular'} color={colors['Grey-700']}>
              {offer.additionalRequirements}
            </Typography>
          ) : null}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <Typography variant={'heading/small'} className={'pb-small'}>
          {t('offer_description')}
        </Typography>
        <div className="flex">
          <div className="flex shrink-0">
            <LivoIcon
              size={24}
              name={'blockquote'}
              color={colors['Neutral-400']}
            />
            <span className="body-regular ml-small whitespace-pre-line">
              {offer.details ? (
                offer.details
              ) : (
                <Typography variant={'body/regular'} color={colors['Grey-700']}>
                  {t('offer_empty_aditional_description')}
                </Typography>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Offer ID */}
      {isDetailView && (
        <div>
          <Typography variant={'heading/small'} className={'pb-small'}>
            {t('offer_id')}
          </Typography>
          <div className="flex">
            <div className="shrink-0">
              <LivoIcon name={'hash'} size={24} color={colors['Neutral-400']} />
            </div>
            <span className="body-regular ml-small">{offer.externalId}</span>
            <CopyButton
              text={offer.externalId}
              successMessage={t('shift-list:identifier_copied')}
              style={{
                marginLeft: '8px',
              }}
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default OfferInfoCard;
