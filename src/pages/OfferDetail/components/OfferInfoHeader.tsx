import React from 'react';

import { CategoryTag } from '@/components/common/CategoryTag';
import OfferStatus from '@/components/Offer/OfferStatus';

import { OfferDetail } from '@/types/offers';

import OfferActionsPopper from '@/pages/OfferDetail/OfferDetailPage/components/OfferActionPopper';
import {
  NOT_DELETABLE_STATUSES,
  NOT_EDITABLE_STATUSES,
} from '@/pages/OfferDetail/utils';
import { useOfferLabels } from '../hooks/useOfferTitle';

function OfferInfoHeader({
  offer,
  isDetailView,
}: {
  offer: OfferDetail;
  isDetailView?: boolean;
}) {
  const { getOfferTitle } = useOfferLabels();

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {!!offer.statusTag && <OfferStatus {...offer.statusTag} />}
        {isDetailView && (
          <OfferActionsPopper
            offer={offer}
            disabledDelete={NOT_DELETABLE_STATUSES.includes(offer.status)}
            disabledEdit={NOT_EDITABLE_STATUSES.includes(offer.status)}
          />
        )}
      </div>
      <div className="mb-xLarge flex items-center">
        <CategoryTag text={offer.category} />
        <h1 className="heading-md ml-small font-bold">
          {getOfferTitle(
            offer.livoUnit?.displayText,
            offer.facilityType?.displayText,
            offer.professionalField?.displayText
          )}
        </h1>
      </div>
    </>
  );
}

export default OfferInfoHeader;
