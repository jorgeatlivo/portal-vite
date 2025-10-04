import { useTranslation } from 'react-i18next';

export const HolidayTag = ({ holiday }: { holiday?: boolean }) => {
  const { t } = useTranslation('shift-claim-details');
  if (!holiday) {
    return null;
  }
  return (
    <div className="rounded-[4px] px-[2px] ring-2 ring-Purple-400">
      <p className="info-caption text-Purple-900">{t('holiday_tag')}</p>
    </div>
  );
};
