import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import groupBy from 'lodash/groupBy';

import { AppContext } from '../../AppProvider';
import { getWalletName, LOGOS } from '../../utils/wallet';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP as WALLET_ROUTES_MAP } from '../Wallet/routes';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { getMediaRemoteUrl } from '../../utils/media';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';

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

const AccountSelectPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, wallets, locked }, { changeActiveWallet }] =
    useContext(AppContext);
  const addNewWallet = () => navigate(ONBOARDING_ROUTES_MAP.ONBOARDING_HOME);
  const groupedWallets = groupBy(wallets, 'chain');
  const getWalletIndex = wallet =>
    wallets.findIndex(w => w.address === wallet.address);
  const selectWallet = async wallet => {
    await changeActiveWallet(getWalletIndex(wallet));
    navigate(WALLET_ROUTES_MAP.WALLET_OVERVIEW);
  };
  const editWallet = ({ address }) => {
    console.log(address);
    navigate(ROUTES_MAP.SETTINGS_ACCOUNT_EDIT, { address });
  };

  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  return (
    !locked && (
      <GlobalLayout>
        <GlobalLayout.Header>
          <GlobalBackTitle onBack={onBack} title="Your Wallets" />

          <GlobalPadding />

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
                  <CardButtonWallet
                    key={wallet.address}
                    title={getWalletName(wallet, getWalletIndex(wallet) + 1)}
                    address={wallet.address}
                    chain={wallet.chain}
                    selected={
                      activeWallet.getReceiveAddress() === wallet.address
                    }
                    onPress={() => selectWallet(wallet)}
                    onSecondaryPress={() => editWallet(wallet)}
                  />
                ))}
              </>
            </React.Fragment>
          ))}
        </GlobalLayout.Header>

        <GlobalLayout.Footer>
          <GlobalButton
            type="primary"
            wide
            title="Add New Wallet"
            onPress={addNewWallet}
          />
        </GlobalLayout.Footer>
      </GlobalLayout>
    )
  );
};

export default AccountSelectPage;
