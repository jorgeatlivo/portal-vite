import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { t } = useTranslation('common');
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-gray-900">
      <h1 className="text-9xl font-extrabold text-Action-Secondary">404</h1>
      <p className="mt-2 font-semibold text-2xl">{t('page_not_found_title')}</p>
      <p className="mt-2 text-gray-600">{t('page_not_found_subtitle')}</p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-Action-Secondary px-6 py-3 font-medium text-lg text-white shadow-md transition hover:bg-[#2c4e58]"
      >
        {t('page_not_found_button')}
      </Link>
    </div>
  );
};

export default NotFound;
