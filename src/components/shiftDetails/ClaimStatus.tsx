import { ForwardRefExoticComponent, memo, RefAttributes, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from '@mui/material';
import { Icon, IconProps, IconUserCancel } from '@tabler/icons-react';

import ColoredIcon from '@/components/atoms/ColoredIcon';

import { ClaimStatus } from '@/types/claims';

import IconDeclined from '@/assets/user-declined.svg';
import IconPending from '@/assets/user-pending.svg';

interface ClaimStatusIconProps {
  status: ClaimStatus;
  className?: string;
}

// Memoized main component to prevent re-renders when props don't change
const ClaimStatusIcon = memo(
  ({ status, className = 'size-6' }: ClaimStatusIconProps) => {
    const { t } = useTranslation('shift-claim-details');

    // Constants defined inside component to access translations
    const STATUS_CONFIG: Partial<
      Record<
        ClaimStatus,
        {
          icon:
            | string
            | ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
          alt: string;
          colorClass?: string;
          color?: string;
        }
      >
    > = useMemo(
      () => ({
        [ClaimStatus.PENDING_PRO_ACCEPT]: {
          icon: IconPending,
          alt: t('claim_status_pending'),
          colorClass: 'bg-yellow-500',
        },
        [ClaimStatus.REJECTED_BY_PRO]: {
          icon: IconDeclined,
          alt: t('claim_status_rejected'),
          colorClass: 'bg-Action-Notification',
        },
        [ClaimStatus.INVITATION_EXPIRED]: {
          icon: IconPending,
          alt: t('claim_status_expired'),
          colorClass: 'bg-Divider-Strong',
        },
        [ClaimStatus.PRO_NOT_AVAILABLE]: {
          icon: IconUserCancel,
          alt: 'Professional not available',
          colorClass: 'bg-Divider-Strong',
        },
      }),
      [t]
    );

    // Use useMemo to cache config lookup
    const config = useMemo(
      () => STATUS_CONFIG[status],
      [STATUS_CONFIG, status]
    );

    if (!config) {
      return null;
    }

    return (
      <Tooltip title={config.alt} placement="bottom">
        <div>
          {typeof config.icon === 'string' && (
            <ColoredIcon
              src={config.icon}
              alt={config.alt}
              colorClass={config.colorClass}
              color={config.color}
              className={className}
            />
          )}

          {typeof config.icon !== 'string' && (
            <config.icon
              size={24}
              className={`${config.colorClass ?? 'text-Text-Subtle'}`}
              aria-label={config.alt}
            />
          )}
        </div>
      </Tooltip>
    );
  }
);

ClaimStatusIcon.displayName = 'ClaimStatusIcon';

export default ClaimStatusIcon;
