import { Box, Tab, Tabs } from '@mui/material';

import colors from '@/config/color-palette';
import LivoIcon from './LivoIcon';
import { NotificationsBadge } from './NotificationsBadge';

export interface Tab<T = string> {
  notifications?: number;
  displayText: string;
  value: T;
  icon: string;
}

interface Props<T> {
  tabs: Tab<T>[];
  selectedTab: string;
  onSelectTab: (value: T) => void;
  defaultTab?: T;
}

export const NavigationTabs = <T extends string>({
  tabs,
  selectedTab,
  onSelectTab,
  defaultTab,
}: Props<T>) => {
  return (
    <Box className="no-scrollbar mb-xLarge overflow-x-auto border-b border-gray-300 pt-medium">
      <Tabs
        value={selectedTab}
        onChange={(_, value) => onSelectTab(value)}
        aria-label="Navigation tabs"
        variant="scrollable"
        scrollButtons={false}
        allowScrollButtonsMobile
        defaultValue={defaultTab}
        sx={{ '& .MuiTabs-indicator': { width: '2px' } }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value as string}
            label={
              <div className="flex items-center gap-2">
                <span>{tab.displayText}</span>
                {tab.notifications && tab.notifications > 0 && (
                  <NotificationsBadge notifications={tab.notifications} />
                )}
              </div>
            }
            value={tab.value}
            iconPosition="start"
            sx={{
              fontFamily: 'Roboto',
              fontSize: '16px',
              textTransform: 'none',
              gap: '8px',
              minHeight: 'unset',
              color: colors['Text-Subtle'],
              '&.Mui-selected': {
                color: colors['Action-Secondary'],
                fontWeight: (theme) => theme.typography.fontWeightBold,
              },
            }}
            icon={
              <LivoIcon
                name={tab.icon}
                size={24}
                color={
                  colors[
                    tab.value === selectedTab
                      ? 'Action-Secondary'
                      : 'Text-Subtle'
                  ]
                }
              />
            }
          />
        ))}
      </Tabs>
    </Box>
  );
};
