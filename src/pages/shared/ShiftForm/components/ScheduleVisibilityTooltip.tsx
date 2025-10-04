import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip } from '@mui/material';
import { IconInfoCircle } from '@tabler/icons-react';

import colors from '@/config/color-palette';

export const ScheduleVisibilityTooltip = ({
  hasPredictions,
}: {
  hasPredictions: boolean;
}) => {
  const { t } = useTranslation('fill-rate');

  return (
    <Tooltip
      sx={{ whiteSpace: 'pre-line' }}
      placement="right-start"
      title={
        <div>
          <p>{t('tooltip_title')}</p>
          <p>{t('tooltip_list_header')}</p>
          <p>
            <ColouredBox color={colors['Primary-500']} />
            {t('tooltip_list_normal')}
          </p>
          <p>
            <ColouredBox color={colors['Purple-400']} />
            {t('tooltip_list_holiday')}
          </p>
          {hasPredictions && (
            <>
              <p>
                <ColouredBox color={colors['Red-200']} />
                {t('tooltip_list_low')}
              </p>
              <p>
                <ColouredBox color={'#f9e199'} />
                {t('tooltip_list_medium')}
              </p>
            </>
          )}
        </div>
      }
    >
      <IconInfoCircle
        size={16}
        color={colors['Text-Default']}
        className="mb-1 ml-1 inline-block"
      />
    </Tooltip>
  );
};

const ColouredBox = ({ color }: { color: string }) => {
  const colorBg = `bg-[${color}]`;
  return <span className={`rounded-3 mr-2 ${colorBg} px-[6px]`} />;
};
