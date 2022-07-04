import React, { useContext } from 'react';
import { AppContext } from '../../AppProvider';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextTitle from '../../component-library/Text/TextTitle';
import { ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

const SettingsOptionsPage = () => {
  const navigate = useNavigation();
  const [, { logout }] = useContext(AppContext);
  const handleLogout = () => {
    logout();
    navigate(ROUTES_MAP.ONBOARDING);
  };
  const goToNetwork = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_CHANGENETWORK);
  return (
    <PageLayout>
      <TextTitle>Settings</TextTitle>
      <Box>
        <Button onClick={goToNetwork}>Change Network</Button>
      </Box>
      <Box>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </PageLayout>
  );
};

export default SettingsOptionsPage;
