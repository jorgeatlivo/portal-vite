import React from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar, Box, Chip, IconButton, Stack } from '@mui/material';
import {
  IconAlertTriangle,
  IconHeartFilled,
  IconTrash,
} from '@tabler/icons-react';
import clsx from 'clsx';

import { translate } from '@/services/i18next/translate';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';
import ProfessionalDetailsModal from '@/components/common/modal/ProfessionalDetailsModal/ProfessionalDetailsModal';

import { useModal } from '@/hooks/use-modal';
import { ShiftInvitationProfessional } from '@/types/shift-invitation';
import { markdown } from '@/utils/markdown';

import colors from '@/config/color-palette';
import { ProfessionalOption } from '@/pages/shared/ShiftForm/types/form';

interface ProfessionalOptionItemProps {
  props: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
  option: ProfessionalOption;
  _state: { selected: boolean };
}

interface ProfessionalDisplayProps {
  professional: ShiftInvitationProfessional;
  showSeeMore?: boolean;
  className?: string;
  showBadge?: boolean; // small blue badge near avatar (used in selected)
  trailing?: React.ReactNode; // action node rendered at the end (e.g. delete button)
  onViewProfile?: () => void; // callback to view professional profile
}

/**
 * Reusable professional display component
 * Shows professional information with avatar, name, favorite status, and experience
 */
const ProfessionalDisplay: React.FC<ProfessionalDisplayProps> = ({
  professional,
  showSeeMore = true,
  className = '',
  showBadge = false,
  trailing = null,
  onViewProfile,
}) => {
  const { t } = useTranslation([
    'professionals/profile',
    'professionals/favorite',
  ]);
  return (
    <div className={`relative flex w-full items-center gap-3 ${className}`}>
      {/* Avatar (possibly with small badge) */}
      <div className="relative shrink-0">
        <Avatar
          sizes="48px"
          src={professional?.avatarUrl || undefined}
          alt={professional?.name}
          className="!size-12 !rounded-[10px]"
        >
          {professional?.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </Avatar>

        {showBadge && (
          <div className="absolute -bottom-2.5 left-7">
            <div className="rounded-full bg-white p-0.5">
              <div className="flex size-[26px] items-center justify-center rounded-full bg-white">
                <div
                  className={clsx(
                    'flex size-6 items-center justify-center rounded-full',
                    {
                      'bg-Primary-100': professional?.role === 'PROFESSIONAL',
                      'bg-Secondary-100':
                        professional?.role === 'INTERNAL_PROFESSIONAL',
                    }
                  )}
                >
                  {professional?.role === 'PROFESSIONAL' && (
                    <LivoIcon
                      color={colors['Primary-500']}
                      name="livo"
                      size={16}
                    />
                  )}
                  {professional?.role === 'INTERNAL_PROFESSIONAL' && (
                    <LivoIcon
                      color={colors['Secondary-500']}
                      name="livo"
                      size={16}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Info */}
      <Stack spacing={0.5} className="min-w-0 flex-1">
        {/* Name and Favorite */}
        <Stack direction="column" spacing={1}>
          <Typography variant="heading/small" className="truncate">
            {professional?.name}
          </Typography>
          {professional?.favorite && (
            <Box className="!mt-0 flex items-center gap-1 text-red-400">
              <IconHeartFilled size={16} className="text-red-400" />
              <Typography
                variant="info/caption"
                className="!font-bold text-red-400"
              >
                {t('favorite_label', { ns: 'professionals/favorite' })}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Experience */}
        <Typography variant="body/small" className="!mt-0 text-Text-Subtle">
          {markdown(
            `{color:${colors['Text-Default']}}${t('total_shifts_subtitle', {
              num: professional?.completedShiftsInFacility,
            })}{/color} `
          )}
          {t('total_shifts_subtitle_in_facility')}
        </Typography>

        {/* Note */}
        {!!professional?.note && (
          <span className="mt-1 flex items-center gap-1">
            <IconAlertTriangle size={16} className="text-Action-Notification" />
            <Typography
              variant="body/small"
              className="!mt-0 text-Action-Notification"
            >
              {professional?.note}
            </Typography>
          </span>
        )}

        {/* See more link */}
        {showSeeMore && (
          <Typography
            variant="action/small"
            className="w-fit cursor-pointer !text-Primary-500 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewProfile?.();
            }}
          >
            {t('see_more')}
          </Typography>
        )}
      </Stack>

      {/* Role badge */}
      {professional?.role === 'INTERNAL_PROFESSIONAL' && (
        <Chip
          label={t('internal_label')}
          size="small"
          className="absolute -right-1 top-0"
        />
      )}

      {/* Trailing action (delete button for selected) */}
      {trailing}
    </div>
  );
};

/**
 * Custom option component for ShiftProfessionalAutocomplete
 * Displays professional information with avatar, name, favorite status, and experience
 */
const ProfessionalOptionItem: React.FC<ProfessionalOptionItemProps> = ({
  props,
  option,
  _state,
}) => {
  const { original: professional } = option;
  const { openModal } = useModal();

  const { key, ...restProps } = props;
  const itemKey = key || `professional-${option.value}`;

  const handleViewProfile = () => {
    const modalContent = (
      <ProfessionalDetailsModal professionalId={professional.id} />
    );
    openModal(modalContent, {
      className:
        'w-1/3 max-w-[457px] min-w-[320px] max-h-[90%] !shadow-lg !rounded-2xl !p-0 !overflow-y-auto overflow-x-hidden',
    });
  };

  return (
    <li key={itemKey} {...restProps} className="p-3 hover:bg-gray-50">
      <ProfessionalDisplay
        professional={professional}
        onViewProfile={handleViewProfile}
      />
    </li>
  );
};

/**
 * Renders the selected professional in a compact format for the autocomplete input
 * Reuses ProfessionalDisplay component but with customized styling
 */
export const renderSelected = (
  option: ProfessionalOption,
  onClear?: () => void
): React.ReactNode => {
  const professional = option.original;

  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-300 bg-white p-3">
      <ProfessionalDisplay
        professional={professional}
        showSeeMore={false}
        showBadge={true}
        trailing={
          !option?.locked ? (
            <IconButton
              size="medium"
              className="ml-2 text-gray-400 hover:text-gray-600"
              onClick={() => onClear?.()}
              aria-label="remove-selected-professional"
            >
              <IconTrash size={24} className="text-neutral-400" />
            </IconButton>
          ) : null
        }
      />
      {option?.lockedReason && (
        <Typography variant="body/small" className="!mt-0 !text-Text-Subtle">
          {translate((option.lockedReason ?? '') as never)}
        </Typography>
      )}
    </div>
  );
};

export default ProfessionalOptionItem;
