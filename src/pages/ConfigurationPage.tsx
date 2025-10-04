import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { MainPageHeader } from '@/components/common/MainPageHeader';
import { NavigationTabs, Tab } from '@/components/common/NavigationTabs';
import { GeneralInfoSection } from '@/components/configPageSections/GeneralInfoSection';
import { PermissionsSection } from '@/components/configPageSections/PermissionsSection';

enum ConfigTabs {
  GENERAL_INFO = 'GENERAL_INFO',
  PERMISSIONS = 'PERMISSIONS',
}

export const ConfigurationPage: React.FC = () => {
  const { t } = useTranslation(['config', 'professionals/profile']);
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs: Tab<ConfigTabs>[] = useMemo(
    () => [
      {
        displayText: t('general_info_tab'),
        value: ConfigTabs.GENERAL_INFO,
        icon: 'portal-tabs',
      },
      {
        displayText: t('permissions_tab'),
        value: ConfigTabs.PERMISSIONS,
        icon: 'key',
      },
    ],
    [t]
  );

  const paramsTab = searchParams.get('tab');
  const [selectedTab, setSelectedTab] = useState(paramsTab ?? tabs[0].value);

  const onSelectTab = useCallback((tabValue: string) => {
    setSearchParams({ tab: tabValue });
    setSelectedTab(tabValue);
  }, []);

  return (
    <div className="relative flex size-full justify-between overflow-hidden">
      <div className="no-scrollbar flex w-full flex-1 justify-center overflow-y-auto pt-xLarge">
        <div className="flex size-full max-w-[1500px] flex-col px-xLarge">
          <div>
            <MainPageHeader title={t('title')} />

            <NavigationTabs
              tabs={tabs}
              selectedTab={selectedTab}
              onSelectTab={onSelectTab}
            />
          </div>

          <main>
            {selectedTab === ConfigTabs.GENERAL_INFO && <GeneralInfoSection />}
            {selectedTab === ConfigTabs.PERMISSIONS && <PermissionsSection />}
          </main>
        </div>
      </div>
    </div>
  );
};
