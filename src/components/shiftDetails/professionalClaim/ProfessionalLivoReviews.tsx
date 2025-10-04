import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LivoIcon from '@/components/common/LivoIcon';

import { ProfessionalReviewInfo } from '@/types/professional-review';

import colors from '@/config/color-palette';

interface ProfessionalLivoReviewsProps {
  review: ProfessionalReviewInfo;
  noPadding: boolean;
}

export const ProfessionalLivoReviews: React.FC<
  ProfessionalLivoReviewsProps
> = ({ review, noPadding = false }) => {
  const { t } = useTranslation('professional-claim');
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState('0px');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) {
      setHeight(`${contentRef.current?.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [expanded]);

  return (
    <div className={`flex w-full flex-col ${noPadding ? '' : 'p-medium'}`}>
      <div className="mb-large flex flex-row space-x-small">
        <LivoIcon size={24} name="star" color={colors['Grey-400']} />
        <p className="body-regular">{t('livo_experience')}</p>
      </div>
      <div className="ring-solid mb-large flex w-full flex-row items-center space-x-small rounded-[8px] bg-white px-small py-medium ring-1 ring-Divider-Subtle">
        <div className="flex w-full flex-col">
          <p className="subtitle-regular">{t('total_reviews_title')}</p>
          <p className="body-regular text-Text-Subtle">
            {t('in')}{' '}
            {t('review_label', {
              count: review?.totalReviews,
            })}
          </p>
        </div>
        <div className="flex flex-row items-center space-x-small">
          <p className="heading-sm">{review?.averageRating?.toFixed(1)}</p>
          <LivoIcon size={24} name="star-filled" color={colors['Orange-400']} />
        </div>
      </div>
      <div
        onClick={() => setExpanded(!expanded)}
        className="mb-small flex cursor-pointer flex-row items-center space-x-small"
      >
        <p className="action-regular text-Primary-500">
          {expanded ? 'Ver menos' : 'Ver más'}
        </p>
        <LivoIcon
          size={24}
          name={expanded ? 'chevron-up' : 'chevron-down'}
          color={colors['Primary-500']}
        />
      </div>
      <div
        ref={contentRef}
        style={{ maxHeight: height, transition: 'max-height 0.3s ease' }}
        className="overflow-y-hidden"
      >
        <div className="flex w-full flex-col space-y-small">
          {review.reviews.map((review, index) => (
            <div key={index} className="flex w-full flex-row space-x-small">
              <div className="flex w-full flex-col">
                <p className="subtitle-regular">{review.facilityName}</p>
                <p className="body-regular capitalize text-Text-Subtle">
                  {review.month} {review.year}
                </p>
              </div>
              <div className="flex flex-row items-center space-x-tiny">
                <p className="subtitle-regular">
                  {review.review.generalRating.toFixed(1)}
                </p>
                <LivoIcon
                  size={16}
                  name="star-filled"
                  color={colors['Orange-400']}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
