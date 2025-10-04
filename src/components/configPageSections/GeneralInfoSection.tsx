import { PropsWithChildren, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { UserFeatureEnum } from '@/services/account';
import { RootState } from '@/store/types';

import ChangeLanguageTab from '@/components/account/ChangeLanguageTab';
import { ChangePasswordComponent } from '@/components/account/ChangePassword';
import { InformationRow } from '@/components/common/InformationRow';
import { ModalWindow } from '@/components/common/modal/ModalWindow';
import FavoriteProfessionalsSection from '@/components/common/modal/ProfileModal/FavoriteProfessionalsSection';
import { TagLabel } from '@/components/common/TagLabel';

import useCurrentLanguage from '@/hooks/use-current-language';
import { useModal } from '@/hooks/use-modal';

enum ModalType {
  PASSWORD = 'PASSWORD',
  LOCALE = 'LOCALE',
  FAVORITE_PROFESSIONALS = 'FAVORITE_PROFESSIONALS',
}

const Section = ({ children, title }: PropsWithChildren<{ title: string }>) => (
  <section className="flex flex-col">
    <p className="subtitle-regular mb-3 font-semibold text-Teal-950">{title}</p>
    <div className="flex flex-col gap-3">{children}</div>
  </section>
);

export const GeneralInfoSection: React.FC = () => {
  const { t } = useTranslation(['config', 'professionals/profile']);
  const profile = useSelector((state: RootState) => state.account.accountInfo);
  const { openModal, closeModal } = useModal();
  const currentLanguage = useCurrentLanguage();

  const handleOpenModal = useCallback(
    (modalType: ModalType) => {
      let content;
      let title;

      switch (modalType) {
        case ModalType.PASSWORD:
          title = t('change_password_cta');
          content = <ChangePasswordComponent onSubmit={closeModal} />;
          break;
        case ModalType.FAVORITE_PROFESSIONALS:
          title = t('favorite_professionals_title');
          content = <FavoriteProfessionalsSection />;
          break;
        case ModalType.LOCALE:
          title = t('language');
          content = <ChangeLanguageTab onComplete={closeModal} />;
          break;
      }

      openModal(
        <ModalWindow title={title} closeModal={closeModal}>
          {content}
        </ModalWindow>,
        {
          className:
            '!bg-Grey-050 w-[450px] max-w-[95dvw] !shadow-lg !rounded-2xl !p-0 !overflow-hidden',
        }
      );
    },
    [closeModal, openModal]
  );

  return (
    <main className="mb-xLarge flex flex-col gap-[40px] rounded-lg bg-white p-huge">
      <Section title={t('user_info')}>
        <InformationRow iconName={'user'}>
          <p>
            {profile?.firstName} {profile?.lastName}
          </p>
        </InformationRow>
        <InformationRow iconName={'mail'}>
          <p>{profile?.email}</p>
        </InformationRow>

        <InformationRow iconName={'key'}>
          <p
            className="cursor-pointer font-semibold text-Primary-500"
            onClick={() => handleOpenModal(ModalType.PASSWORD)}
          >
            {t('change_password_cta')}
          </p>
        </InformationRow>

        {import.meta.env.NODE_ENV === 'development' && (
          <InformationRow iconName={'lang'}>
            <p
              className="cursor-pointer font-semibold text-Primary-500"
              onClick={() => handleOpenModal(ModalType.LOCALE)}
            >
              {t(`professionals/profile:lang_${currentLanguage}`)}
            </p>
          </InformationRow>
        )}
      </Section>

      {profile?.userFeatures?.includes(
        UserFeatureEnum.FAVOURITE_PROFESSIONALS_MANAGEMENT
      ) && (
        <Section title={t('favorite_professionals_title')}>
          <InformationRow iconName={'heart'}>
            <p
              className="cursor-pointer font-semibold text-Primary-500"
              onClick={() => handleOpenModal(ModalType.FAVORITE_PROFESSIONALS)}
            >
              {t('favorite_professionals_title')}
            </p>
          </InformationRow>
        </Section>
      )}

      <Section title={t('facility_info')}>
        {profile?.facilityGroup ? (
          <>
            <InformationRow iconName={'briefcase'}>
              <p>{profile?.facilityGroup?.name}</p>
            </InformationRow>
            <InformationRow iconName={'internal-hospital'}>
              <p>
                {t('facilities_counter', {
                  facilities: profile?.facilityGroup?.facilities.length,
                })}
              </p>
            </InformationRow>
          </>
        ) : (
          <>
            <p className="subtitle-regular font-semibold  text-Teal-950"></p>
            <InformationRow iconName={'briefcase'}>
              <p>{profile?.facility?.name}</p>
            </InformationRow>
            <InformationRow iconName={'internal-hospital'}>
              <p>{profile?.facility?.publicName}</p>
            </InformationRow>
            {(profile?.units?.length ?? 0) > 0 && (
              <InformationRow iconName={'patient-in-bed'}>
                <div className="flex w-full flex-wrap gap-1 overflow-hidden">
                  {profile?.units?.map((unit, index) => (
                    <TagLabel text={unit.displayName} key={index} />
                  ))}
                </div>
              </InformationRow>
            )}
            {profile?.facility?.cif && (
              <InformationRow iconName="cif">
                <p>{profile?.facility.cif}</p>
              </InformationRow>
            )}

            {profile?.facility.address && (
              <InformationRow iconName="map-pin">
                <p
                  className="cursor-pointer font-semibold text-Primary-500"
                  onClick={
                    profile?.facility?.mapLink
                      ? () =>
                          window.open(
                            profile.facility.mapLink,
                            '_blank',
                            'noopener,noreferrer'
                          )
                      : undefined
                  }
                >
                  {profile?.facility.address}
                </p>
              </InformationRow>
            )}
            {profile?.facility?.addressCity && (
              <InformationRow iconName="building-community">
                <p>{profile?.facility.addressCity}</p>
              </InformationRow>
            )}
            {profile?.facility?.webPage && (
              <InformationRow iconName="world">
                <a
                  href={normalizeUrl(profile.facility?.webPage) ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer font-semibold text-Primary-500"
                >
                  {profile.facility.webPage}
                </a>
              </InformationRow>
            )}
          </>
        )}
      </Section>
    </main>
  );
};

function normalizeUrl(domainOrUrl?: string | null) {
  if (!domainOrUrl) return '';
  if (!domainOrUrl.startsWith('http')) {
    return `http://${domainOrUrl}`;
  }
  return domainOrUrl;
}
