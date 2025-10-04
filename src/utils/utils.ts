import { translate } from '@/services/i18next/translate';

import { ValueDisplayPair } from '@/types/offers';
export function allNonEmpty(...strings: string[]): boolean {
  return strings.every((str) => str && str !== '');
}

export function allFalse(...booleans: boolean[]): boolean {
  return booleans.every((bool) => !bool);
}

export function formatTimeSince(dateUTC: string) {
  const now = new Date();
  const past = new Date(dateUTC);

  // Ensure both are treated as UTC
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (diffDays > 7) {
    // Format the date as "Publicado el 7 de Mayo de 2025"
    const day = past.getUTCDate();
    const month = past.toLocaleString('es-ES', { month: 'long' }); // Month name in Spanish
    const year = past.getUTCFullYear();
    return translate('shift-claim-details:published_on_day_month_year', {
      day,
      month,
      year,
    });
  } else if (diffDays > 0) {
    return translate('shift-claim-details:published_days_ago', {
      diffDays,
      diffHours,
    });
  } else {
    return translate('shift-claim-details:published_hours_ago', {
      diffHours,
    });
  }
}

export function formatPhoneNumber(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/\D/g, '').slice(-9);
  return `+34 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function enumOf<E>(enumObject: Record<string, string>, value: string) {
  if (Object.values(enumObject).includes(value)) {
    return value as E;
  }
  return undefined;
}

interface ShiftTitleParams {
  hasUnitAndFieldFeature: boolean;
  hasProfessionalFields: boolean;
  unit?: string;
  professionalField?: ValueDisplayPair | null;
  title: string;
}

export const formatShiftTitle = ({
  hasUnitAndFieldFeature,
  hasProfessionalFields,
  unit,
  professionalField,
  title,
}: ShiftTitleParams): string => {
  if (!hasUnitAndFieldFeature || !hasProfessionalFields) {
    return title;
  }

  if (!unit) {
    return professionalField?.displayText || title;
  }

  return `${unit} - ${professionalField?.displayText || ''}`.trim();
};
