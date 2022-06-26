import React, {useContext} from 'react';
import {AppContext} from '../../AppProvider';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextTitle from '../../component-library/Text/TextTitle';
import {ROUTES_MAP} from '../../routes/app-routes';
import {useNavigation} from '../../routes/hooks';

const SettingsPage = () => {
  const navigate = useNavigation();
  const [, {logout}] = useContext(AppContext);
  const handleLogout = () => {
    logout();
    navigate(ROUTES_MAP.ONBOARDING);
  };
  return (
    <PageLayout>
      <TextTitle>Settings</TextTitle>
      <Box>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </PageLayout>
  );
};

export default SettingsPage;
