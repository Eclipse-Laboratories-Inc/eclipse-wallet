import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

import TokenList from '../../features/TokenList/TokenList';
import NtfsList from '../../features/NtfsList/NtfsList';
import WalletBalanceCard from '../../features/WalletBalanceCard/WalletBalanceCard';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { getWalletName } from '../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    padding: theme.gutters.paddingMD,
  },
  sendReceiveButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonTouchable: {
    flex: 1,
    // width: '100%',
  },
  button: {
    // flex: 1,
    // width: '100%',
    alignSelf: 'stretch',
  },
  buttonLeft: {
    marginRight: theme.gutters.paddingXS,
  },
  buttonRight: {
    marginLeft: theme.gutters.paddingXS,
  },
});

const WalletOverviewPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, walletNumber, selectedEndpoints }] =
    useContext(AppContext);
  const [totalBalance, setTotalBalance] = useState({});
  const [tokenList, setTokenList] = useState([]);
  const [ntfsList, setNtfsList] = useState([]);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (activeWallet) {
      Promise.all([activeWallet.getBalance(), activeWallet.getAllNfts()]).then(
        ([balance, ntfs]) => {
          setTotalBalance(balance);
          setTokenList(balance.items);
          setNtfsList(ntfs);
          setLoaded(true);
        },
      );
    }
  }, [activeWallet, selectedEndpoints]);
  const goToSend = () => {};
  const goToReceive = () => {};
  const goToTokenDetail = t =>
    navigate(ROUTES_MAP.TOKEN_DETAIL, { tokenId: t.address });

  return (
    loaded &&
    activeWallet && (
      <GlobalLayoutForTabScreen styles={styles.container}>
        <GlobalText type="headline2">
          {getWalletName(activeWallet, walletNumber)}
        </GlobalText>
        <GlobalText type="body1">{activeWallet.getReceiveAddress()}</GlobalText>

        <WalletBalanceCard
          balance={totalBalance}
          messages={[]}
          actions={
            <View style={styles.sendReceiveButtons}>
              <GlobalButton
                type="primary"
                flex
                title="Send"
                onPress={goToSend}
                key={'send-button'}
                style={[styles.button, styles.buttonLeft]}
                touchableStyles={styles.buttonTouchable}
              />

              <GlobalButton
                type="primary"
                flex
                title="Receive"
                onPress={goToReceive}
                style={[styles.button, styles.buttonRight]}
                touchableStyles={styles.buttonTouchable}
              />
            </View>
          }
        />

        <GlobalPadding />

        <GlobalText type="headline2">Tokens</GlobalText>

        <TokenList tokens={tokenList} onDetail={goToTokenDetail} />

        <GlobalPadding />

        <GlobalText type="headline2">NTF's</GlobalText>

        <NtfsList ntfs={ntfsList} />

        <GlobalPadding />
      </GlobalLayoutForTabScreen>
    )
  );
};

export default WalletOverviewPage;
