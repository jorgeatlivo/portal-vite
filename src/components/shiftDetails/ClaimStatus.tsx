import { ForwardRefExoticComponent, memo, RefAttributes, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from '@mui/material';
import { Icon, IconProps, IconUserCancel } from '@tabler/icons-react';

import ColoredIcon from '@/components/atoms/ColoredIcon';

import { ClaimStatus } from '@/types/claims';

import colors from '@/config/color-palette';
import LivoIcon from '../common/LivoIcon';

interface ClaimStatusIconProps {
	status: ClaimStatus;
	className?: string;
}

// Memoized main component to prevent re-renders when props don't change
const ClaimStatusIcon = memo(({ status }: ClaimStatusIconProps) => {
	const { t } = useTranslation('shift-claim-details');

	// Constants defined inside component to access translations
	const STATUS_CONFIG: Partial<
		Record<
			ClaimStatus,
			{
				icon: string;
				alt: string;
				color: string;
			}
		>
	> = useMemo(
		() => ({
			[ClaimStatus.PENDING_PRO_ACCEPT]: {
				icon: 'user-hourglass',
				color: colors['Yellow-500'],
				alt: t('claim_status_pending'),
			},
			[ClaimStatus.REJECTED_BY_PRO]: {
				icon: 'icon-user-x',
				color: colors['Negative-500'],
				alt: t('claim_status_rejected'),
			},
			[ClaimStatus.INVITATION_EXPIRED]: {
				icon: 'user-hourglass',
				color: colors['Grey-700'],
				alt: t('claim_status_expired'),
			},
			[ClaimStatus.PRO_NOT_AVAILABLE]: {
				icon: 'user-cancel',
				color: colors['Grey-700'],
				alt: 'Professional not available',
			},
		}),
		[t]
	);

	const config = useMemo(() => STATUS_CONFIG[status], [STATUS_CONFIG, status]);

	if (!config) {
		return null;
	}

	return (
		<Tooltip title={config.alt} placement='bottom'>
			<LivoIcon
				name={config.icon}
				size={24}
				color={config.color}
				aria-label={config.alt}
			/>
		</Tooltip>
	);
});

ClaimStatusIcon.displayName = 'ClaimStatusIcon';

export default ClaimStatusIcon;
