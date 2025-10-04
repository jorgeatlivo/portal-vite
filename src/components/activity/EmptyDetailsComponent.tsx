import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ActionButton } from '@/components/common/ActionButton';

import { RouteBreadcrumbs } from '@/routers/config';

export const EmptyDetailsComponent = () => {
  const { t } = useTranslation('calendar');
  const navigate = useNavigate();

  return (
    <div className="mt-5 flex flex-col items-center rounded-2xl bg-white p-24 text-center">
      <p className="mb-small text-[72px]">🙌</p>
      <p className="heading-md mb-small text-Text-Default">
        {t('activity_details_empty_state_title')}
      </p>
      <p className="body-regular mb-medium text-Text-Default">
        {t('activity_details_empty_state_subtitle')}
      </p>
      <div className="flex flex-col items-center">
        <ActionButton
          isDisabled={false}
          isLoading={false}
          onClick={() => {
            navigate(`/${RouteBreadcrumbs.ShiftsPage}`);
          }}
          style={{
            padding: '12px',
          }}
        >
          <div className="flex items-center text-center">
            <p className="action-regular">{t('activity_details_button')}</p>
          </div>
        </ActionButton>
      </div>
    </div>
  );
};
