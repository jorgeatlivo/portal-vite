/* eslint-disable import/no-named-as-default-member */
import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import ICU from 'i18next-icu';

import { I18N_NAMESPACES } from '@/services/i18next/config';
import { updateNetworksLocale } from '@/services/i18next/network-headers';
import { Logger } from '@/services/logger.service';

const LOCAL_TRANSLATIONS_PATH = '/locales';

export enum SUPPORTED_LANGUAGES {
  es = 'es',
  it = 'it',
  en = 'en',
  pl = 'pl',
}

export enum SUPPORTED_LOCALES {
  'es-ES' = 'es-ES',
  'it-IT' = 'it-IT',
  'en-US' = 'en-US',
  'pl-PL' = 'pl-PL',
}

type SUPPORTED_LOCALES_CAST = `${SUPPORTED_LOCALES}`;

export const LocaleMap: Record<SUPPORTED_LANGUAGES, SUPPORTED_LOCALES_CAST> = {
  es: 'es-ES',
  it: 'it-IT',
  en: 'en-US',
  pl: 'pl-PL',
};

export function getCurrentLocale() {
  const lang = i18n.language as keyof typeof LocaleMap;
  return LocaleMap[lang] || 'es-ES';
}

export function getLanguageByLocale(locale: string) {
  return Object.keys(LocaleMap).find(
    (key) => LocaleMap[key as keyof typeof LocaleMap] === locale
  ) as SUPPORTED_LANGUAGES;
}

// convert enum to array
export const supportedLanguages = Object.values(SUPPORTED_LANGUAGES);

// convert enum to map
export const languagesMap = new Map(
  Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => [key, value])
);

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    saveMissing: true,
    fallbackLng: SUPPORTED_LANGUAGES.es,
    debug: process.env.NODE_ENV === 'development',
    interpolation: { escapeValue: false },
    missingKeyHandler: function (lng, ns, key) {
      Logger.warn(`Missing translation: [${lng}] ${ns}:${key}`);
    },
    backend: {
      loadPath: `${LOCAL_TRANSLATIONS_PATH}/{{ns}}.{{lng}}.json`, // Load translations dynamically from public/locales
    },
    supportedLngs: supportedLanguages,
    load: 'currentOnly',
    ns: I18N_NAMESPACES,
    defaultNS: 'common',
    i18nFormat: {
      locales: supportedLanguages,
    },
  })
  .then(() => {
    // When the i18next instance is ready, update the locale in the network headers
    const locale = getCurrentLocale();
    updateNetworksLocale(locale);
  });

export default i18n;
