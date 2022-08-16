import React from 'react';
import { View } from 'react-native';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

const TrustedAppsPage = ({ t }) => {
  const navigate = useNavigation();

  const onBack = () => navigate(ROUTES_SETTINGS_MAP.SETTINGS_OPTIONS);

  const TrustedAppItem = ({ title }) => (
    <>
      <View style={globalStyles.inlineWell}>
        <GlobalText type="body2">{title}</GlobalText>

        <GlobalButton
          type="primary"
          title={t(`actions.remove`)}
          onPress={() => {}}
          size="medium"
        />
      </View>
      <GlobalPadding size="xs" />
    </>
  );

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title={t(`settings.trusted_apps`)} />

        <GlobalPadding />

        <View style={globalStyles.centered}>
          <TrustedAppItem title="App.Name 1" />
          <TrustedAppItem title="App.Name 2" />
          <TrustedAppItem title="App.Name 3" />
        </View>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(TrustedAppsPage);
