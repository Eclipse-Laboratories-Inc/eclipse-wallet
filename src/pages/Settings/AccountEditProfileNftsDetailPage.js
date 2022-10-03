import React, { useContext, useState, useEffect } from 'react';
import { View } from 'react-native';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { ROUTES_MAP as ROUTES_WALLET_MAP } from '../Wallet/routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';

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
  const [{ activeWallet }, { editWalletAvatar }] = useContext(AppContext);

  const [saving, setSaving] = useState(false);
  const [currentNft, setCurrentNft] = useState(null);

  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS_ALL,
        () => activeWallet.getAllNfts(),
      ).then(result => {
        setCurrentNft(result.find(n => n.mint === params.id));
      });
    }
  }, [activeWallet, params.id]);

  const onBack = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS, {
      address: params.address,
    });
  const onSave = () => {
    setSaving(true);
    editWalletAvatar(activeWallet.getReceiveAddress(), currentNft.media);
    setSaving(false);
    navigate(ROUTES_WALLET_MAP.WALLET_OVERVIEW);
  };
  return (
    <GlobalLayout>
      {currentNft && (
        <GlobalLayout.Header>
          <GlobalBackTitle
            onBack={onBack}
            title={t(`settings.wallets.set_profile_picture`)}
          />

          <View style={globalStyles.centered}>
            <View style={globalStyles.squareRatio}>
              <GlobalImage
                source={getMediaRemoteUrl(currentNft.media)}
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
      )}
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditProfilePage));
