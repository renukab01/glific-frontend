import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import { Loading } from 'components/UI/Layout/Loading/Loading';
import { GET_PROVIDERS } from 'graphql/queries/Organization';
import { Heading } from 'components/UI/Heading/Heading';
import Track from 'services/TrackService';
import styles from './SettingList.module.css';

export const SettingHeading = ({
  formTitle,
  desc = 'Manage organisation name, supported languages',
}: any) => {
  return (
    <div className={styles.SettingHeader} data-testid="setting-header">
      <div>
        <div className={styles.SettingTitle}>{formTitle}</div>
        <div className={styles.SettingTextHeader}>{desc}</div>
      </div>
    </div>
  );
};

export const SettingList = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: providerData, loading } = useQuery(GET_PROVIDERS);

  useEffect(() => {
    Track('Visit Settings');
  }, []);

  if (loading) return <Loading />;

  const list = [
    {
      name: 'Organisation',
      shortcode: 'organization',
      description: t('Manage organisation name, supported languages.'),
    },
    {
      name: 'Flows',
      shortcode: 'organization-flows',
      description: t('Manage organisation flows.'),
    },
    {
      name: 'Billing',
      shortcode: 'billing',
      description: t('Setup for glific billing account'),
    },
  ];

  let cardList: any = [];
  if (providerData) {
    // create setting list of Organisation & providers
    cardList = [...list, ...providerData.providers];
  }

  const drawer = (
    <div className={styles.Drawer} data-testid="setting-drawer">
      {cardList
        .sort((first: any, second: any) => (first.name > second.name ? 1 : -1))
        .map((data: any, index: number) => (
          <div
            key={index}
            onClick={() => navigate(`/settings/${data.shortcode}`)}
            className={`${styles.Tab} ${
              location.pathname == `/settings/${data.shortcode}` && styles.ActiveTab
            }
          ${
            location.pathname == '/settings' && data.shortcode == 'organization' && styles.ActiveTab
          }
          `}
          >
            {data.name}
          </div>
        ))}
    </div>
  );

  const formheading = (pathname: string) => {
    if (pathname == '/settings') {
      return 'Organisation';
    }
    pathname = pathname
      .replace(/\/settings\//gi, '')
      .replace(/_/gi, ' ')
      .replace(/-/gi, ' ');
    return pathname.charAt(0).toUpperCase() + pathname.slice(1);
  };

  let formTitle = formheading(location.pathname);

  return (
    <>
      <Heading formTitle="Settings" />
      <Box className={styles.SettingsContainer}>
        {drawer}
        <Box className={styles.SettingBody}>
          <SettingHeading formTitle={formTitle} />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default SettingList;
