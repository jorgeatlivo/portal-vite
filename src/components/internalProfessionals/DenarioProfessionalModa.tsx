import { useTranslation } from 'react-i18next';

import { DenarioProfessional } from '@/types/internal';

interface DenarioProfessionalModalProps {
  denarioProfessional: DenarioProfessional;
  onClose: () => void;
  onAcceptProfessionalData: () => void;
}

export const DenarioProfessionalModal: React.FC<
  DenarioProfessionalModalProps
> = ({ denarioProfessional, onClose, onAcceptProfessionalData }) => {
  const { t } = useTranslation('internal-professional-page');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative z-[51] w-96 rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('denario_pro_modal_title')}</h2>
        </div>
        <div className="mb-4">
          <p className="mb-2 font-['Roboto'] text-base font-normal leading-normal text-Grey-950">
            {t('denario_pro_modal_subtitle')}
          </p>
          <div className="rounded-md bg-gray-50 p-4">
            <p className="font-medium">
              {denarioProfessional.firstName} {denarioProfessional.lastName}
            </p>
            <p className="text-gray-600">
              {t('dni_label')}: {denarioProfessional.nationalId}
            </p>
            <p className="text-gray-600">
              {t('category_label')}: {denarioProfessional.category}
            </p>
            <p className="text-gray-600">
              {t('employee_number_label')}: {denarioProfessional.employeeNumber}
            </p>
            <p className="text-gray-600">
              {t('unit_label')}: {denarioProfessional.unit}
            </p>
          </div>

          <p className="mt-4 font-['Roboto'] text-base font-normal leading-normal text-Grey-950">
            {t('denario_pro_modal_subtitle_2')}
          </p>
        </div>
        <div className="flex w-full justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-[49%] rounded-full px-4 py-2 hover:bg-gray-50"
          >
            {t('denario_pro_modal_return_label')}
          </button>
          <button
            type="button"
            className="w-[49%] rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={onAcceptProfessionalData}
          >
            {t('denario_pro_modal_applied_data_label')}
          </button>
        </div>
      </div>
    </div>
  );
};
