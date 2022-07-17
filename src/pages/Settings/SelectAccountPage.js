import React, { useContext } from 'react';
import groupBy from 'lodash/groupBy';

import { AppContext } from '../../AppProvider';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import { useNavigation } from '../../routes/hooks';
import WalletButton from '../../features/WalletButton/WalletButton';
import { ROUTES_MAP as ONBOARDING_ROUTES_MAP } from '../Onboarding/routes';
import { ROUTES_MAP } from './routes';

import { StyleSheet, View } from 'react-native';
import AvatarImage from '../../component-library/Image/AvatarImage';
import { getWalletName, LOGOS } from '../../utils/wallet';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';

const styles = StyleSheet.create({
  chainContainer: {
    flexDirection: 'row',
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
        <GlobalText type="headline2" center>
          Your Wallets
        </GlobalText>
      </GlobalBackTitle>

      <GlobalPadding />

      {Object.keys(groupedWallets).map(chain => (
        <>
          <View style={styles.chainContainer}>
            <AvatarImage url={LOGOS[chain]} size={48} />
            <GlobalText type="title">{chain}</GlobalText>
          </View>
          <View>
            {groupedWallets[chain].map(wallet => (
              <WalletButton
                name={getWalletName(wallet, getWalletIndex(wallet) + 1)}
                address={wallet.address}
                chain={wallet.chain}
                onClick={() => selectWallet(wallet)}
                active={activeWallet.getReceiveAddress() === wallet.address}
              />
            ))}
          </View>
        </>
      ))}

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
