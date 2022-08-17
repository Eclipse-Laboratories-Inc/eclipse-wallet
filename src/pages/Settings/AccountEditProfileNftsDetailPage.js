import React, { useContext, useState } from 'react';
import { View } from 'react-native';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalButton from '../../component-library/Global/GlobalButton';
import { AppContext } from '../../AppProvider';
import { getMediaRemoteUrl } from '../../utils/media';

const AccountEditProfilePage = ({ params, t }) => {
  const navigate = useNavigation();
  const [, { editWalletAvatar }] = useContext(AppContext);
  const [saving, setSaving] = useState(false);
  const nftsGroup = {
    dW212: {
      media:
        'https://cryptohasbullanft.com/wp-content/uploads/2022/05/logan-768x768.jpeg',
      name: 'Mock 2',
    },
    dW211: {
      media:
        'https://cryptohasbullanft.com/wp-content/uploads/2022/05/WhatsApp-Image-2022-05-09-at-5.45.23-AM-768x763.jpeg',
      name: 'Mock 1',
    },
  };

  const onBack = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS, {
      address: params.address,
    });
  const onSave = () => {
    setSaving(true);
    editWalletAvatar(params.address, nftsGroup[params.id].media);
    setSaving(false);
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE, {
      address: params.address,
    });
  };
  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.set_profile_picture`)}
        />

        <View style={globalStyles.centered}>
          <View style={globalStyles.squareRatio}>
            <GlobalImage
              source={getMediaRemoteUrl(nftsGroup[params.id].media)}
              style={globalStyles.bigImage}
              square
              squircle
            />
          </View>

          <GlobalPadding size="xl" />

          <GlobalButton
            type="primary"
            wideSmall
            title={t('settings.wallets.select_nft_to_profile')}
            onPress={onSave}
            disabled={saving}
          />

          <GlobalPadding />

          <GlobalButton
            type="secondary"
            wideSmall
            title={t('settings.wallets.full_nft_description')}
            onPress={() => {}}
            disabled={saving}
          />

          <GlobalPadding />

          <GlobalButton
            type="secondary"
            wideSmall
            title={t('general.home')}
            onPress={onBack}
            disabled={saving}
          />

          <GlobalPadding />
        </View>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditProfilePage));
