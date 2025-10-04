import { useTranslation } from 'react-i18next';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

export default function FavoriteTag() {
  const { t } = useTranslation('professionals/favorite');
  return (
    <div className="flex flex-row items-center">
      <LivoIcon name="heart-filled" size={16} color={colors['Negative-400']} />
      <span className="subtitle-sm ml-tiny font-bold">
        {t('favorite_label')}
      </span>
    </div>
  );
}
