import React, { useContext, useMemo } from 'react';
import { View } from 'react-native';

import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import CardButton from '../../component-library/CardButton/CardButton';

import IconEditCircle from '../../assets/images/IconEditCircle.png';
import { AppContext } from '../../AppProvider';
import { getMediaRemoteUrl } from '../../utils/media';

const AccountEditPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ accounts }] = useContext(AppContext);
  const onBack = () => navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_SELECT);

  const account = useMemo(
    () => accounts.find(({ id }) => id === params.id),
    [accounts, params.id],
  );

  const { id } = params;

  const goToEditProfile = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE, { id });

  const goToEditName = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_NAME, { id });

  const goToSeedPhrase = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_SEEDPHRASE, { id });

  const goToPrivateKey = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PRIVATEKEY, { id });

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.edit_wallet`)}
        />

        <View style={globalStyles.centered}>
          <View style={globalStyles.floatingTransactionBox}>
            <GlobalImage
              source={getMediaRemoteUrl(account.avatar)}
              size="3xl"
              style={globalStyles.bigImage}
              circle
            />
            <CardButton
              onPress={goToEditProfile}
              buttonStyle={globalStyles.floatingTransaction}
              transparent>
              <GlobalImage source={IconEditCircle} size="md" circle />
            </CardButton>
          </View>
        </View>

        <GlobalPadding />

        <CardButton
          title={t(`general.name`)}
          actionIcon="right"
          onPress={goToEditName}>
          <GlobalText type="caption">{account.name}</GlobalText>
        </CardButton>

        <CardButton
          title={t(`general.seed_phrase`)}
          actionIcon="right"
          onPress={goToSeedPhrase}
        />

        <CardButton
          title={t(`general.private_key`)}
          actionIcon="right"
          onPress={goToPrivateKey}
        />
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditPage));
