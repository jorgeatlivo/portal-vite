import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { MenuItem, Select } from '@mui/material';

import { supportedLanguages } from '@/services/i18next/i18next';
import { changeLanguage } from '@/services/i18next/translate';

import useCurrentLanguage from '@/hooks/use-current-language';

interface ChangeLanguageTabProps {
  onComplete?: () => void;
}

const LanguageFlag = {
  en: '🇬🇧',
  it: '🇮🇹',
  es: '🇪🇸',
  pl: '🇵🇱',
};

const ChangeLanguageModal: React.FC<ChangeLanguageTabProps> = (props) => {
  const { t } = useTranslation('professionals/profile');

  const currentLanguage = useCurrentLanguage();

  const onChangeLanguage = (lang: string) => {
    changeLanguage(lang);
  };

  const languagesOption = useMemo(() => {
    return supportedLanguages.map((lang) => {
      return {
        value: lang,
        label: t(`lang_${lang}`),
        flag: LanguageFlag[lang] ?? '',
      };
    });
  }, [t]);

  return (
    <div className="flex w-full flex-col gap-6 px-4 pb-6">
      <div className="flex-1 overflow-y-auto p-2">
        <Select
          fullWidth
          value={currentLanguage}
          onChange={(e) => {
            onChangeLanguage(e.target.value as string);
            props.onComplete?.();
          }}
        >
          {languagesOption.map((language) => (
            <MenuItem
              key={`select-lang-opt-${language.label}`}
              value={language.value}
            >
              {language.flag + '\t' + language.label}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default React.memo(ChangeLanguageModal);
