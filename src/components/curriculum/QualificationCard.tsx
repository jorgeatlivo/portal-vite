import React, { useMemo } from 'react';

import { Divider } from '@mui/material';

import {
  QualificationDataDTO,
  QualificationDTO,
} from '@/types/common/curriculum';
import { resolveIconSize } from '@/utils/uiUtils';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';
import { SDInfoRow } from '../common/SDInfoRow';

interface QualificationCardProps {
  qualification: QualificationDTO;
  messageWhenEmpty?: string;
  className?: string;
}

type QualificationSectionGroup = {
  [title: string]: QualificationSectionProps;
};

export const QualificationCard: React.FC<QualificationCardProps> = ({
  qualification,
  messageWhenEmpty,
  className,
}) => {
  const { qualifications } = qualification;
  const noQualifications =
    !qualification.qualifications || qualifications.length === 0;

  const qualificationSections = useMemo(() => {
    if (noQualifications) {
      return [];
    }

    const qualificationSectionGroup = qualifications.reduce(
      (group, qualification, index) => {
        if (!group[qualification.title]) {
          group[qualification.title] = {
            order: index,
            title: qualification.title,
            qualifications: [],
          };
        }

        group[qualification.title].qualifications.push(qualification);
        return group;
      },
      {} as QualificationSectionGroup
    );

    return Object.values(qualificationSectionGroup).sort(
      (s1, s2) => s1.order - s2.order
    );
  }, [noQualifications, qualifications]);

  return noQualifications && !messageWhenEmpty ? null : (
    <div className={'rounded-lg p-4 bg-white ' + (className || '')}>
      <Typography variant="heading/medium" className="pb-3">
        {qualification.title}
      </Typography>
      {noQualifications ? (
        <Typography variant="body/regular" color={colors['Text-Subtle']}>
          {messageWhenEmpty}
        </Typography>
      ) : (
        qualificationSections.map((sectionProps, index) => (
          <div>
            <QualificationSection {...sectionProps} key={index} />
            {index < qualificationSections.length - 1 ? (
              <div className="mb-5 mt-4">
                <Divider variant="middle" />
              </div>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
};

interface QualificationSectionProps {
  title: string;
  order: number;
  qualifications: QualificationDataDTO[];
  lastSection?: boolean;
}

function QualificationSection({ qualifications }: QualificationSectionProps) {
  return (
    <div>
      {qualifications.map((qualification, qualificationIndex) => (
        <div key={qualificationIndex}>
          <Typography variant="subtitle/regular">
            {qualification.title}
          </Typography>

          {qualification.subtitle && (
            <Typography
              variant="body/regular"
              color={colors['Text-Subtle']}
              className="pb-2"
            >
              {qualification.title}
            </Typography>
          )}

          {qualification.details.map((detail, detailIndex) => (
            <div key={detailIndex} style={{ marginBottom: detail.gap }}>
              <SDInfoRow
                title={detail.displayText}
                subtitle={detail.additionalText}
                titleTypography={detail.displayTextTypography}
                subtitleTypography={detail.additionalTextTypography}
                iconName={detail.icon?.name}
                iconColor={detail.icon?.color}
                iconSize={
                  detail.icon?.width
                    ? resolveIconSize(detail.icon?.width)
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
