import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import groupBy from 'lodash/groupBy';

import { AppContext } from '../../AppProvider';
import { getWalletName, getWalletAvatar, LOGOS } from '../../utils/wallet';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP as WALLET_ROUTES_MAP } from '../Wallet/routes';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { getMediaRemoteUrl } from '../../utils/media';
import { withTranslation } from '../../hooks/useTranslations';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalText from '../../component-library/Global/GlobalText';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';
import SimpleDialog from '../../component-library/Dialog/SimpleDialog';

const styles = StyleSheet.create({
  sectionTitle: {
    flexDirection: 'row',
    marginBottom: theme.gutters.paddingSM,
  },
  chainImg: {
    marginRight: theme.gutters.paddingXS,
    width: 24,
    height: 24,
  },
});

const AccountSelectPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeWallet, wallets, locked, config },
    { removeWallet, changeActiveWallet },
  ] = useContext(AppContext);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [toRemove, setToRemove] = useState([]);
  const addNewWallet = () =>
    navigate(APP_ROUTES_MAP.ONBOARDING, {
      Screen: ONBOARDING_ROUTES_MAP.ONBOARDING_HOME,
    });
  const groupedWallets = groupBy(wallets, 'chain');
  const getWalletIndex = wallet =>
    wallets.findIndex(w => w.address === wallet.address);
  const selectWallet = async wallet => {
    await changeActiveWallet(getWalletIndex(wallet));
    navigate(WALLET_ROUTES_MAP.WALLET_OVERVIEW);
  };
  const editWallet = ({ address }) => {
    navigate(ROUTES_MAP.SETTINGS_ACCOUNT_EDIT, { address });
  };
  const toggleRemoveDialog = ({ address }) => {
    setToRemove(address);
    setShowRemoveDialog(!showRemoveDialog);
  };
  const handleRemoveWallet = async address => {
    await removeWallet(address);
    setShowRemoveDialog(!showRemoveDialog);
  };
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  return (
    !locked && (
      <GlobalLayout>
        <GlobalLayout.Header>
          <GlobalBackTitle
            onBack={onBack}
            title={t('settings.wallets.your_wallets')}
          />

          {Object.keys(groupedWallets).map(chain => (
            <React.Fragment key={chain}>
              <View style={styles.sectionTitle}>
                <GlobalImage
                  source={getMediaRemoteUrl(LOGOS[chain])}
                  style={styles.chainImg}
                />
                <GlobalText type="body1" color="secondary">
                  {chain}
                </GlobalText>
              </View>
              <>
                {groupedWallets[chain].map(wallet => (
                  <>
                    <CardButtonWallet
                      key={wallet.address}
                      title={getWalletName(wallet.address, config)}
                      address={wallet.address}
                      chain={wallet.chain}
                      image={getWalletAvatar(wallet.address, config)}
                      imageSize="md"
                      selected={
                        activeWallet.getReceiveAddress() === wallet.address
                      }
                      onPress={() => selectWallet(wallet)}
                      onSecondaryPress={() => editWallet(wallet)}
                      onTertiaryPress={() => toggleRemoveDialog(wallet)}
                    />
                    <SimpleDialog
                      type="danger"
                      title={
                        <GlobalText center type="headline3" numberOfLines={1}>
                          Are your sure?
                        </GlobalText>
                      }
                      btn1Title={`${t('actions.remove')} ${getWalletName(
                        toRemove,
                        config,
                      )}`}
                      btn2Title={t('actions.cancel')}
                      onClose={toggleRemoveDialog}
                      isOpen={showRemoveDialog}
                      action={() => handleRemoveWallet(toRemove)}
                      text={
                        <GlobalText center type="body1">
                          {t(`settings.wallets.remove_wallet_description`)}
                        </GlobalText>
                      }
                    />
                  </>
                ))}
              </>
            </React.Fragment>
          ))}
        </GlobalLayout.Header>

        <GlobalLayout.Footer>
          <GlobalButton
            type="primary"
            wide
            title={t('settings.wallets.add_new_wallet')}
            onPress={addNewWallet}
          />
        </GlobalLayout.Footer>
      </GlobalLayout>
    )
  );
};

export default withTranslation()(AccountSelectPage);
