import { useTranslation } from 'react-i18next';

import { CustomInput } from '@/components/common/CustomInput';

interface FacilityStaffPersonalDataProps {
  firstName: string;
  lastName: string;
  email: string;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
}

export const FacilityStaffPersonalData: React.FC<
  FacilityStaffPersonalDataProps
> = ({ firstName, lastName, email, setFirstName, setLastName, setEmail }) => {
  const { t } = useTranslation('facility-staff');
  return (
    <div>
      <p className="subtitle-regular">{t('personal_data_title')}</p>
      <div className="w-full py-medium">
        <CustomInput
          selectedValue={firstName}
          setValue={setFirstName}
          placeHolder={t('form_first_name')}
          label={t('form_first_name')}
        />
      </div>
      <div className="w-full py-medium">
        <CustomInput
          selectedValue={lastName}
          setValue={setLastName}
          placeHolder={t('form_last_name')}
          label={t('form_last_name')}
        />
      </div>
      <div className="w-full py-medium">
        <CustomInput
          selectedValue={email}
          setValue={setEmail}
          placeHolder={t('form_email')}
          label={t('form_email')}
        />
      </div>
    </div>
  );
};
