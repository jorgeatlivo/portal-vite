import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { showToastAction } from '@/store/actions/appConfigurationActions';

import colors from '@/config/color-palette';
import { AppDispatch } from '@/store';
import LivoIcon from './LivoIcon';

interface CopyButtonProps {
  successMessage?: string;
  text: string;
  style?: any;
  iconSize?: number;
}
export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  style,
  iconSize = 16,
  successMessage,
}) => {
  const { t } = useTranslation('shift-claim-details');
  const dispatch = useDispatch<AppDispatch>();
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        dispatch(
          showToastAction({
            message: successMessage || t('copy_field_success'),
            severity: 'success',
          })
        );
      }}
    >
      <div className="flex items-center justify-center" style={style}>
        <LivoIcon name={'copy'} size={iconSize} color={colors['Primary-500']} />
      </div>
    </button>
  );
};
