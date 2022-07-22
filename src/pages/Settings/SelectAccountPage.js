import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import groupBy from 'lodash/groupBy';

import { AppContext } from '../../AppProvider';
import { getWalletName, LOGOS } from '../../utils/wallet';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

import WalletButton from '../../features/WalletButton/WalletButton';

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

const SelectAccountPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, wallets }, { changeActiveWallet }] =
    useContext(AppContext);
  const addNewWallet = () => navigate(ONBOARDING_ROUTES_MAP.ONBOARDING_HOME);
  const groupedWallets = groupBy(wallets, 'chain');
  const getWalletIndex = wallet =>
    wallets.findIndex(w => w.address === wallet.address);
  const selectWallet = wallet => changeActiveWallet(getWalletIndex(wallet));
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);
  return (
    <GlobalLayoutForTabScreen>
      <GlobalBackTitle onBack={onBack}>
        <GlobalText type="subtitle2" center nospace>
          Your Wallets
        </GlobalText>
      </GlobalBackTitle>

      <GlobalPadding />

      {Object.keys(groupedWallets).map(chain => {
        console.log(LOGOS[chain]);

        return (
          <React.Fragment key={chain.address}>
            <View style={styles.sectionTitle}>
              <GlobalImage source={LOGOS[chain]} style={styles.chainImg} />
              <GlobalText type="body1" color="secondary">
                {chain}
              </GlobalText>
            </View>
            <>
              {groupedWallets[chain].map(wallet => (
                <GlobalButtonCard
                  key={wallet.address}
                  type="wallet"
                  imageSize="xl"
                  active={activeWallet.getReceiveAddress() === wallet.address}
                  image={LOGOS[wallet.chain]}
                  title={getWalletName(wallet, getWalletIndex(wallet) + 1)}
                  description={wallet.address}
                  goToButton
                  onPress={() => selectWallet(wallet)}
                />
              ))}
            </>
          </React.Fragment>
        );
      })}

      <GlobalPadding />

      <GlobalButton
        type="primary"
        block
        title="Add new Wallet"
        onPress={addNewWallet}
      />
    </GlobalLayoutForTabScreen>
  );
};

export default SelectAccountPage;
