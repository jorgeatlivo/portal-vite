import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from '@/services/i18next/i18next';

type SupportedLangsCast = `${SUPPORTED_LANGUAGES}`;

export default function useCurrentLanguage() {
  const { i18n } = useTranslation();
  const currentLanguage = useMemo(() => {
    return i18n.language as SupportedLangsCast;
  }, [i18n.language]);

  return currentLanguage;
}
