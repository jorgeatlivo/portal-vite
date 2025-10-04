import { getDisplayOfferTopBanner } from '@/services/common';

export const DISPLAY_OFFER_BANNER_KEY = 'display_offer_banner';
export const BANNER_STATUS_KEY = 'offer_banner_status';
export const PREVIOUS_BANNER_STATUS_KEY = 'previous_banner_status';

export enum BannerStatus {
  OPENED = 'OPENED',
  MINIMIZED = 'MINIMIZED',
  CLOSED = 'CLOSED',
}

export const getBannerDisplayState = (key: string): boolean =>
  localStorage.getItem(key) === 'true';

export const setBannerDisplayState = (
  key: string,
  displayBanner: boolean
): void => localStorage.setItem(key, displayBanner.toString());

export const checkBannerDisplay = async (): Promise<boolean> => {
  try {
    const { displayOfferTopBanner } = await getDisplayOfferTopBanner();
    setBannerDisplayState(DISPLAY_OFFER_BANNER_KEY, displayOfferTopBanner);
    window.dispatchEvent(new Event('storage'));
    return displayOfferTopBanner;
  } catch {
    return false;
  }
};
