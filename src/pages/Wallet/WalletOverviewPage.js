import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Modal } from 'react-native';
import get from 'lodash/get';

import { AppContext } from '../../AppProvider';
import TokenList from '../../features/TokenList/TokenList';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from '../../pages/Token/routes';
import { ROUTES_MAP as WALLET_ROUTES_MAP } from '../../pages/Wallet/routes';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from '../../pages/Nfts/routes';
import {
  getWalletName,
  getShortAddress,
  getWalletAvatar,
} from '../../utils/wallet';
import { cache, CACHE_TYPES } from '../../utils/cache';
import {
  hiddenValue,
  getLabelValue,
  showAmount,
  showPercentage,
} from '../../utils/amount';
import { withTranslation } from '../../hooks/useTranslations';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSendReceive from '../../component-library/Global/GlobalSendReceive';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import WalletBalanceCard from '../../component-library/Global/GlobalBalance';

import AvatarImage from '../../component-library/Image/AvatarImage';
// import IconNotifications from '../../assets/images/IconNotifications.png';
// import IconNotificationsAdd from '../../assets/images/IconNotificationsAdd.png';
import IconQRCodeScanner from '../../assets/images/IconQRCodeScanner.png';
import { isCollection } from '../../utils/nfts';
import { getMediaRemoteUrl } from '../../utils/media';
import QRScan from '../../features/QRScan/QRScan';

const styles = StyleSheet.create({
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

const WalletOverviewPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeWallet, config, selectedEndpoints, hiddenBalance },
    { toggleHideBalance },
  ] = useContext(AppContext);
  const [totalBalance, setTotalBalance] = useState({});
  const [tokenList, setTokenList] = useState(null);
  const [nftsList, setNftsList] = useState(null);
  const [showScan, setShowScan] = useState(false);

  //const [hasNotifications, setHasNotifications] = useState(false);
  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.NFTS,
          () => activeWallet.getAllNftsGrouped(),
        ),
      ]).then(([balance, nfts]) => {
        setTotalBalance(balance);
        setTokenList(balance.items);
        setNftsList(nfts);
      });
    }
  }, [activeWallet, selectedEndpoints]);

  const toggleScan = () => {
    setShowScan(!showScan);
  };

  const onRead = qr => {
    const data = qr;
    console.log(data.data);
    setShowScan(false);
  };

  const goToSend = () =>
    navigate(TOKEN_ROUTES_MAP.TOKEN_SELECT, {
      action: 'send',
    });

  const goToReceive = () => navigate(TOKEN_ROUTES_MAP.TOKEN_RECEIVE);

  const goToTokenDetail = tok =>
    navigate(TOKEN_ROUTES_MAP.TOKEN_DETAIL, {
      tokenId: tok.address,
    });

  // const goToNotifications = () => setHasNotifications(!hasNotifications);
  const handleNftsClick = nft => {
    if (isCollection(nft)) {
      navigate(NFTS_ROUTES_MAP.NFTS_COLLECTION, { id: nft.collection });
    } else {
      navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, { id: nft.mint });
    }
  };
  const goToNFTs = tok =>
    navigate(WALLET_ROUTES_MAP.WALLET_NFTS, { tokenId: tok.address });

  return (
    activeWallet && (
      <GlobalLayout>
        <GlobalLayout.Header>
          <SafeAreaView edges={['top']}>
            <View style={styles.avatarWalletAddressActions}>
              <View style={styles.avatarWalletAddress}>
                <AvatarImage
                  src={getMediaRemoteUrl(
                    getWalletAvatar(activeWallet.getReceiveAddress(), config),
                  )}
                  size={42}
                />

                <View style={styles.walletNameAddress}>
                  <GlobalText
                    type="body2"
                    style={styles.walletName}
                    numberOfLines={1}>
                    {getWalletName(activeWallet.getReceiveAddress(), config)}
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
                {/* <GlobalButton
                  type="icon"
                  transparent
                  icon={hasNotifications ? IconNotificationsAdd : IconNotifications}
                  style={styles.narrowBtn}
                  onPress={goToNotifications}
                /> */}
                <GlobalButton
                  type="icon"
                  transparent
                  icon={IconQRCodeScanner}
                  style={styles.narrowBtn}
                  onPress={toggleScan}
                />
              </View>
            </View>
          </SafeAreaView>
          {totalBalance && (
            <WalletBalanceCard
              total={
                !hiddenBalance
                  ? showAmount(totalBalance.usdTotal)
                  : `$ ${hiddenValue}`
              }
              {...{
                [`${getLabelValue(
                  get(totalBalance, 'last24HoursChage.perc', 0),
                )}Total`]: showPercentage(
                  get(totalBalance, 'last24HoursChage.perc', 0),
                ),
              }}
              messages={[]}
              showBalance={!hiddenBalance}
              onToggleShow={toggleHideBalance}
              actions={
                <GlobalSendReceive
                  goToSend={goToSend}
                  goToReceive={goToReceive}
                />
              }
            />
          )}
          <GlobalPadding />

          <GlobalCollapse title={t('wallet.my_tokens')} isOpen>
            <TokenList
              tokens={tokenList}
              onDetail={goToTokenDetail}
              hiddenBalance={hiddenBalance}
            />
          </GlobalCollapse>

          <GlobalPadding />

          <GlobalCollapse
            title={t('wallet.my_nfts')}
            viewAllAction={goToNFTs}
            isOpen>
            <GlobalNftList
              nonFungibleTokens={nftsList}
              onClick={handleNftsClick}
            />
          </GlobalCollapse>
        </GlobalLayout.Header>
        <Modal
          animationType="slide"
          onRequestClose={toggleScan}
          visible={showScan}>
          <QRScan onClose={toggleScan} onRead={onRead} />
        </Modal>
      </GlobalLayout>
    )
  );
};

export default withTranslation()(WalletOverviewPage);
