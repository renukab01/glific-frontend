import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Loading } from 'components/UI/Layout/Loading/Loading';
import { GET_PROVIDERS } from 'graphql/queries/Organization';
import styles from './SettingList.module.css';
import { useEffect } from 'react';
import Track from 'services/TrackService';
import { Heading } from 'containers/Form/FormLayout';

export const SettingList = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: providerData, loading } = useQuery(GET_PROVIDERS);

  useEffect(() => {
    Track('Visit Settings');
  }, []);

  if (loading) return <Loading />;

  const List = [
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

  let CardList: any = [];
  if (providerData) {
    // create setting list of Organisation & providers
    CardList = [...List, ...providerData.providers];
  }

  const drawer = (
    <div className={styles.Drawer}>
      {CardList.map((data: any, index: number) => (
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
          {data?.name}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Heading formTitle="Settings" />
      <Box sx={{ display: 'flex' }}>
        {drawer}
        <Box className={styles.SettingBody}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default SettingList;
