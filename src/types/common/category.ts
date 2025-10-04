import { ValueDisplayPair } from '../offers';

export type Category = {
  code: CategoryCode;
  acronym: string;
  displayText: string;
  visibleForLivoPool: Boolean;
  visibleForLivoInternal: Boolean;
};
export enum CategoryCode {
  Nurse = 'ENF',
  TCAE = 'TCAE',
  Doctor = 'DOC',
  Other = 'OTHER',
}

export type CategoryCodeCast = `${CategoryCode}`;
export interface CategoryDependentElement extends ValueDisplayPair {
  eligibleCategories: string[];
}
