import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent } from '@mui/material';

import { Typography } from '@/components/atoms/Typography';
import Chip from '@/components/common/Chip';
import { NotificationsBadge } from '@/components/common/NotificationsBadge';
import OfferStatus from '@/components/Offer/OfferStatus';

import { Offer } from '@/types/offers';

import colors from '@/config/color-palette';
import { useOfferLabels } from '@/pages/OfferDetail/hooks/useOfferTitle';
import { RouteBreadcrumbs } from '@/routers/config';

const OfferRowItem = ({ offer }: { offer: Offer }) => {
  const navigate = useNavigate();
  const { getOfferTitle } = useOfferLabels();

  const onClick = useCallback(() => {
    navigate(`/${RouteBreadcrumbs.OffersPage}?offerId=${offer.id}`, {
      state: {
        livoUnitDisplayText: offer?.livoUnit ?? '',
        duration: offer?.duration ?? '',
        status: offer?.status ?? '',
      },
    });
  }, [offer, navigate]);

  if (!offer) return null;

  return (
    <Card
      onClick={onClick}
      className="isolate flex cursor-pointer flex-col items-start gap-2 rounded-xl bg-white p-4 px-5 !shadow-sm transition-shadow duration-300 ease-in-out  hover:!shadow-md md:flex-row md:items-center"
    >
      <CardContent className="flex w-full flex-col gap-1 !p-0 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex flex-[2.5] items-center gap-2 truncate">
          <Chip
            label={offer.category?.code ?? '-'}
            className="border border-Neutral-600 bg-Neutral-000"
          />
          <Typography variant="subtitle/regular" className="w-full truncate">
            {getOfferTitle(
              offer.livoUnit,
              offer.facilityType,
              offer.professionalField
            )}
          </Typography>
          <div className="block w-xLarge md:hidden">
            {offer.totalNewClaims > 0 && (
              <NotificationsBadge notifications={offer.totalNewClaims} />
            )}
          </div>
        </div>

        <div className="flex flex-[1.4] justify-start">
          <Typography variant="body/regular" className="text-ellipsis">
            {offer.duration}
          </Typography>
        </div>

        <div className="flex flex-[1.4] justify-start">
          <Typography
            variant="subtitle/regular"
            color={
              colors[offer.compensation?.defined ? 'Green-700' : 'Text-Subtle']
            }
          >
            {offer.compensation?.displayText ?? ''}
          </Typography>
        </div>

        <div className="flex flex-[1.2] justify-start">
          <OfferStatus {...(offer.statusTag ?? {})} />
        </div>

        <div className="hidden w-xLarge md:block">
          {offer.totalNewClaims > 0 && (
            <NotificationsBadge notifications={offer.totalNewClaims} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferRowItem;
