import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { Typography } from '@/components/atoms/Typography';

import colors from '@/config/color-palette';
import { ShiftClaim } from '@/types';
import { formatDateWithToday, formatSchedule } from '@/utils';
import BoldTitleAndValue from './common/BoldTitleAndValue';

export default function ShiftInformationCard({
  claim,
  rightHeader,
}: {
  claim: ShiftClaim;
  rightHeader?: JSX.Element;
}) {
  const { t } = useTranslation(['shift-claim-details', 'shift-claim-list']);
  const reasonDisplay = claim.slotReason
    ? claim.slotReason.displayText +
      (claim.slotReason.comment ? ' - ' + claim.slotReason.comment : '')
    : '';
  return (
    <Card sx={{ m: 1 }}>
      <CardContent>
        <div className="flex flex-col items-center justify-between gap-2 pb-4 md:flex-row md:pb-0">
          <Typography
            gutterBottom
            variant={'info/caption'}
            color={colors['Text-Secondary']}
          >
            {t('shift_information_title')}
          </Typography>
          {rightHeader}
        </div>
        <Typography variant={'body/regular'}>
          {formatDateWithToday(claim.shift.startTime, false, true)}
        </Typography>
        <Typography variant={'body/regular'}>
          {formatSchedule(claim.shift.startTime, claim.shift.finishTime)}
        </Typography>
        <BoldTitleAndValue
          title={t('total_pay_label')}
          value={claim.shift.formattedTotalPay}
          className="my-xLarge"
        />
        <BoldTitleAndValue
          title={t('shift-claim-list:unit_table_title')}
          value={claim.shift.unit}
        />
        <BoldTitleAndValue
          title={t('shift-claim-list:professional_field_table_title')}
          value={claim.shift.professionalField ?? ' - '}
        />
        {claim.slotReason && (
          <BoldTitleAndValue title={t('reason_label')} value={reasonDisplay} />
        )}
      </CardContent>
    </Card>
  );
}
