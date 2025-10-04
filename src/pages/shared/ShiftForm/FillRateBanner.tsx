import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import clsx from 'clsx';

import {
  CommonBannerDto,
  PredictionBandsCounter,
  ShiftFillRateResponse,
} from '@/services/fill-rate';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import { markdown } from '@/utils/markdown';

import colors from '@/config/color-palette';

interface Props {
  data: ShiftFillRateResponse | undefined;
  recurrentDates: boolean;
}

export const FillRateBanner = ({ data, recurrentDates }: Props) => {
  //  Cached data is needed to animate
  const [cachedData, setCachedData] = useState<{
    recurrentDates: boolean;
    banner: CommonBannerDto;
    bands: PredictionBandsCounter;
  }>();

  const background = cachedData
    ? `bg-[${cachedData.banner?.backgroundColor.toLowerCase()}]`
    : '';

  useEffect(() => {
    if (data?.banner && data.bands) {
      setCachedData({
        banner: data.banner,
        bands: data.bands,
        recurrentDates,
      });
    }
  }, [data, recurrentDates]);

  return (
    <div
      className={clsx(
        'grid transition-all duration-300 ease-in-out',
        data?.displayBanner
          ? 'grid-rows-[1fr] opacity-100'
          : 'grid-rows-[0fr] opacity-0'
      )}
    >
      <div className="overflow-hidden">
        {cachedData?.banner ? (
          <div className={`flex flex-row gap-3 px-5 py-4 ${background}`}>
            <div className="pt- flex flex-col">
              <LivoIcon
                size={24}
                name={cachedData.banner.icon.name}
                color={cachedData.banner.icon.color ?? colors['Grey-700']}
              />
            </div>
            <div className="flex w-full flex-col gap-2 ">
              <div className="flex w-full flex-row items-center gap-2">
                <Typography variant={'body/regular'}>
                  {cachedData.banner.title}{' '}
                  <Bands
                    bands={cachedData.bands}
                    recurrentDates={recurrentDates}
                  />
                </Typography>
              </div>
              <div className="flex w-full flex-row">
                <Typography variant={'body/small'}>
                  {markdown(cachedData.banner.body)}
                </Typography>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

const Bands = ({
  bands,
  recurrentDates,
}: {
  bands: PredictionBandsCounter;
  recurrentDates: boolean;
}) => {
  if (bands.low && bands.medium)
    return (
      <span className="body-regular">
        <Trans
          ns={'fill-rate'}
          i18nKey="tooltip_with_both"
          values={{ low: bands.low, medium: bands.medium }}
          components={{ LowBand: <LowBand />, MediumBand: <MediumBand /> }}
        />
      </span>
    );

  if (recurrentDates)
    return bands.low ? (
      <span>
        <Trans
          ns={'fill-rate'}
          i18nKey="tooltip_with_band"
          values={{ count: bands.low }}
          components={{ Band: <LowBand /> }}
        />
      </span>
    ) : bands.medium ? (
      <span>
        <Trans
          ns={'fill-rate'}
          i18nKey="tooltip_with_band"
          values={{ count: bands.medium }}
          components={{ Band: <MediumBand /> }}
        />
      </span>
    ) : null;

  return bands.low ? <LowBand /> : bands.medium ? <MediumBand /> : null;
};

const LowBand = () => {
  const { t } = useTranslation(['fill-rate']);

  return (
    <span className={'info-caption rounded-md bg-Red-700 px-2 py-1 text-white'}>
      {t('low')}
    </span>
  );
};

const MediumBand = () => {
  const { t } = useTranslation(['fill-rate']);

  return (
    <span
      className={'info-caption rounded-md bg-Yellow-700 px-2 py-1 text-white'}
    >
      {t('medium')}
    </span>
  );
};
