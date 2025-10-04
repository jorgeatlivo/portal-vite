import { useTranslation } from 'react-i18next';

import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { IconHeartHandshake } from '@tabler/icons-react';
import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';

import colors from '@/config/color-palette';

interface OnboardingShiftCheckBoxProps {
  isOnboardingShift: boolean;
  setOnboardingShift: (isOnboarding: boolean) => void;
  disabled?: boolean;
}

export const OnboardingShiftCheckBox: React.FC<
  OnboardingShiftCheckBoxProps
> = ({ isOnboardingShift, setOnboardingShift, disabled = false }) => {
  const { t } = useTranslation(['publish-shift', 'shift-claim-details']);
  return (
    <Box className="flex w-full flex-col gap-1">
      <Box
        className={clsx(
          'flex h-14 w-full items-center justify-between space-x-small rounded-lg border border-solid border-Divider-Default px-small',
          { 'opacity-50': disabled }
        )}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={isOnboardingShift}
              onChange={(event) => setOnboardingShift(event.target.checked)}
              disabled={disabled}
            />
          }
          label={
            <Box className="flex items-center gap-2">
              <Box className="size-6">
                <IconHeartHandshake
                  size={24}
                  color={disabled ? '#9CA3AF' : colors['Neutral-400']}
                />
              </Box>
              <Typography
                variant="body/regular"
                className={clsx(
                  'grow text-left',
                  disabled ? 'text-Text-Disabled' : 'text-Text-Default'
                )}
              >
                {t('shift-claim-details:requires_onboarding_shift')}
              </Typography>
            </Box>
          }
          className="!m-0 w-full justify-between"
          sx={{
            '& .MuiFormControlLabel-label': {
              flex: 1,
            },
          }}
          labelPlacement="start"
          disabled={disabled}
        />
      </Box>
      <Typography
        variant="body/regular"
        className={clsx(disabled ? 'text-Text-Disabled' : 'text-Text-Subtle')}
      >
        {t('shift-claim-details:requires_onboarding_shift_note')}
      </Typography>
    </Box>
  );
};
