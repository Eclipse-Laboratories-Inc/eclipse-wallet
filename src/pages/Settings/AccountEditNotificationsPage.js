import React from 'react';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import CardButton from '../../component-library/CardButton/CardButton';

const AccountEditNotificationsPage = ({ t }) => {
  const navigate = useNavigation();

  const onBack = () => navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title={t(`settings.notifications`)} />

        <CardButton
          title="Nofification 1"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          actionIcon="ToggleOn"
          onPress={() => {}}
        />

        <CardButton
          title="Nofification 2"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          actionIcon="ToggleOff"
          onPress={() => {}}
        />

        <CardButton
          title="Nofification 3"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          actionIcon="ToggleOn"
          onPress={() => {}}
        />

        <CardButton
          title="Nofification 4"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          actionIcon="ToggleOff"
          onPress={() => {}}
        />
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(AccountEditNotificationsPage);
