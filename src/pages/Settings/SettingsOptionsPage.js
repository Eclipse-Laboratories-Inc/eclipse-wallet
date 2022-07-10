import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

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
    <GlobalLayoutForTabScreen>
      <GlobalText type="headline2" center>
        Settings
      </GlobalText>

      <GlobalButton
        type="primary"
        block
        title="Change Network"
        onPress={goToNetwork}
      />

      <GlobalPadding />

      <GlobalButton
        type="secondary"
        block
        title="Logout"
        onPress={handleLogout}
      />
    </GlobalLayoutForTabScreen>
  );
};

export default SettingsOptionsPage;
