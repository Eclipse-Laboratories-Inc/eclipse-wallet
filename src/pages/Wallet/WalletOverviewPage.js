import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSendReceive from '../../component-library/Global/GlobalSendReceive';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalNftList from '../../component-library/Global/GlobalNftList';

import AvatarImage from '../../component-library/Image/AvatarImage';
import Avatar from '../../assets/images/Avatar.png';
import IconNotifications from '../../assets/images/IconNotifications.png';
import IconNotificationsAdd from '../../assets/images/IconNotificationsAdd.png';
import IconQRCodeScanner from '../../assets/images/IconQRCodeScanner.png';

import TokenList from '../../features/TokenList/TokenList';
import WalletBalanceCard from '../../component-library/Global/GlobalBalance';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP as WALLET_MAP } from '../../pages/Wallet/routes';
import { ROUTES_MAP } from '../../routes/app-routes';
import { getWalletName, getShortAddress } from '../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    padding: theme.gutters.paddingMD,
  },
  avatarWalletAddressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.gutters.paddingNormal,
    marginBottom: theme.gutters.paddingXL,
    marginRight: theme.gutters.paddingXS * -1,
  },
  avatarWalletAddress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletNameAddress: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: theme.gutters.paddingSM,
  },
  walletName: {
    lineHeight: theme.fontSize.fontSizeNormal + 4,
  },
  walletAddress: {
    lineHeight: theme.fontSize.fontSizeNormal + 4,
  },
  walletActions: {
    flexDirection: 'row',
  },
  narrowBtn: {
    paddingHorizontal: theme.gutters.paddingXS,
  },
});

const WalletOverviewPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, walletNumber, selectedEndpoints }] =
    useContext(AppContext);
  const [totalBalance, setTotalBalance] = useState({});
  const [tokenList, setTokenList] = useState([]);
  const [ntfsList, setNtfsList] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);

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
    navigate(ROUTES_MAP.TOKEN_DETAIL, {
      tokenId: t.address,
    });

  const goToNotifications = () => setHasNotifications(!hasNotifications);

  const goToQR = t => navigate(ROUTES_MAP.TOKEN_DETAIL, { tokenId: t.address });

  const goToNFTs = t =>
    navigate(WALLET_MAP.WALLET_NTFS, { tokenId: t.address });

  return (
    loaded &&
    activeWallet && (
      <GlobalLayoutForTabScreen styles={styles.container}>
        <View style={styles.avatarWalletAddressActions}>
          <View style={styles.avatarWalletAddress}>
            <AvatarImage url={Avatar} size={42} />

            <View style={styles.walletNameAddress}>
              <GlobalText
                type="body2"
                style={styles.walletName}
                numberOfLines={1}>
                {getWalletName(activeWallet, walletNumber)}
              </GlobalText>

              <GlobalText
                type="body1"
                color="tertiary"
                style={styles.walletAddress}
                numberOfLines={1}>
                ({getShortAddress(activeWallet.getReceiveAddress())})
              </GlobalText>
            </View>
          </View>

          <View style={styles.walletActions}>
            <GlobalButton
              type="icon"
              transparent
              icon={hasNotifications ? IconNotificationsAdd : IconNotifications}
              style={styles.narrowBtn}
              onPress={goToNotifications}
            />
            <GlobalButton
              type="icon"
              transparent
              icon={IconQRCodeScanner}
              style={styles.narrowBtn}
              onPress={goToQR}
            />
          </View>
        </View>

        <WalletBalanceCard
          balance={totalBalance}
          positiveTotal="$2.30"
          negativeTotal="$2.30"
          messages={[]}
          actions={
            <GlobalSendReceive goToSend={goToSend} goToReceive={goToReceive} />
          }
        />

        <GlobalPadding />

        <GlobalCollapse title="My Tokens" isOpen>
          <TokenList tokens={tokenList} onDetail={goToTokenDetail} />
        </GlobalCollapse>

        <GlobalPadding />

        <GlobalCollapse title="My NFTs" viewAllAction={goToNFTs} isOpen>
          <GlobalNftList nonFungibleTokens={ntfsList} />
        </GlobalCollapse>

        <GlobalPadding />
      </GlobalLayoutForTabScreen>
    )
  );
};

export default WalletOverviewPage;
