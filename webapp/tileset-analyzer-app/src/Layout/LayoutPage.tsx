import { NavLink, Outlet, useLocation } from 'react-router-dom';
import CustomBreadcrumb from './CustomBreadcrumb';
import React, { FC, useEffect, useState } from 'react';
import {
  AppLayout,
  Box,
  Button,
  Modal,
  SideNavigation,
  SpaceBetween,
  Tabs,
  TopNavigation,
} from '@cloudscape-design/components';
import GeneralSettingsTab from './Settings/GeneralSettingsTab';

const LayoutPage: FC = () => {
  const location = useLocation();

  const [active, setActive] = useState<string | undefined>(undefined);
  const [settingsVisible, setSettingsVisible] = React.useState(false);

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const i18nStrings = {
    searchIconAriaLabel: 'Search',
    searchDismissIconAriaLabel: 'Close search',
    overflowMenuTriggerText: 'More',
    overflowMenuTitleText: 'All',
    overflowMenuBackIconAriaLabel: 'Back',
    overflowMenuDismissIconAriaLabel: 'Close menu',
  };

  const navItems: any[] = [
    {
      type: 'section',
      text: 'Infomation',
      items: [
        { type: 'link', text: 'Tileset Info', href: '/tileset-info' },
        { type: 'link', text: 'Map View', href: '/map-view' },
      ],
    },
    {
      type: 'section',
      text: 'Tileset Metrics',
      items: [
        { type: 'link', text: 'Tile Count', href: '/tile-count' },
        { type: 'link', text: 'Tile Size', href: '/tile-size' },
        { type: 'link', text: 'Tile Layer Size', href: '/tile-layer-size' },
        { type: 'link', text: 'Tile Layer Size (TreeMap)', href: '/tile-layer-size-tree-map' },
      ],
    },
  ];

  return (
    <>
      <TopNavigation
        i18nStrings={i18nStrings}
        identity={{
          href: '#',
          title: 'Tile Analyzer',
          logo: { src: '/logo.png', alt: 'Tile Analyzer' },
        }}
        utilities={[
          {
            type: 'button',
            iconName: 'settings',
            title: 'Settings',
            ariaLabel: 'Settings',
            onClick: () => {
              setSettingsVisible(!settingsVisible);
            },
          },
        ]}
      />
      <AppLayout
        toolsHide
        headerSelector="#header"
        ariaLabels={{ navigationClose: 'close' }}
        navigation={<SideNavigation activeHref={active} items={navItems} />}
        breadcrumbs={<CustomBreadcrumb />}
        content={<Outlet />}
        contentType="dashboard"
      />
      (
      <Modal
        onDismiss={() => setSettingsVisible(false)}
        visible={settingsVisible}
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={() => setSettingsVisible(false)}>
                Ok
              </Button>
            </SpaceBetween>
          </Box>
        }
        header="Settings"
      >
        <Tabs
          tabs={[
            {
              label: 'General',
              id: 'general',
              content: <GeneralSettingsTab />,
            },
          ]}
        />
      </Modal>
      )
    </>
  );
};

export default LayoutPage;
