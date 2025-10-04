import i18n from '@/services/i18next';
import { getLanguageByLocale } from '@/services/i18next/i18next';
import { updateNetworksLocale } from '@/services/i18next/network-headers';

import { changeDatetimeLocale } from '@/utils/datetime';

type ParamsType = Parameters<typeof i18n.t>;

/**
 * Translates a given key using i18next.
 * @param key - The translation key.
 * @param options - Optional parameters for ICU formatting.
 * @returns The translated string.
 */
export const translate = (...args: ParamsType) => {
  return (i18n.t(...args) ?? '') as string;
};

/**
 * Changes the current language.
 * @param lng - The language code (e.g., "es", "it").
 */
export const changeLanguage = async (lng: string) => {
  localStorage.setItem('i18nextLng', lng);
  await changeDatetimeLocale(lng);
  i18n.changeLanguage(lng);
};

export const changeLanguageByLocale = async (locale: string) => {
  let lang = getLanguageByLocale(locale);
  if (!lang) {
    return;
  }

  updateNetworksLocale(locale);
  localStorage.setItem('i18nextLng', lang);
  await changeDatetimeLocale(lang);
  i18n.changeLanguage(lang);
};

/**
 * Retrieves the current language.
 * @returns The current language code.
 */
export const getCurrentLanguage = () => {
  return i18n.language;
};
