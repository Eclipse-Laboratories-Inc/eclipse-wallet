import React, { useContext } from 'react';
import { View } from 'react-native';
import get from 'lodash/get';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

const TrustedAppsPage = ({ t }) => {
  const navigate = useNavigation();

  const onBack = () => navigate(ROUTES_SETTINGS_MAP.SETTINGS_OPTIONS);

  const TrustedAppItem = ({ name, icon, origin, onRemove }) => (
    <>
      <View style={globalStyles.inlineWell}>
        <GlobalImage source={icon} size="sm" />
        <GlobalText type="body2">{name || origin}</GlobalText>
        <GlobalButton
          type="primary"
          title={t(`actions.remove`)}
          onPress={onRemove}
          size="medium"
        />
      </View>
      <GlobalPadding size="xs" />
    </>
  );

  const [{ activeWallet, config }, { removeTrustedApp }] =
    useContext(AppContext);

  const address = activeWallet.getReceiveAddress();
  const trustedApps = get(config, `${address}.trustedApps`, {});

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title={t(`settings.trusted_apps`)} />

        <GlobalPadding />

        <View style={globalStyles.centered}>
          {Object.entries(trustedApps).map(([origin, { name, icon }]) => (
            <TrustedAppItem
              key={origin}
              name={name}
              icon={icon}
              origin={origin}
              onRemove={() => removeTrustedApp(address, origin)}
            />
          ))}
        </View>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(TrustedAppsPage);
