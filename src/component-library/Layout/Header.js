import React, { useContext, useEffect, useState } from 'react';
import theme from '../../component-library/Global/theme';
import { StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { getNetworks, getSwitches } from '4m-wallet-adapter';
import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP as ROUTES_WALLET_MAP } from '../../pages/Wallet/routes';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from '../../pages/Settings/routes';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from '../../pages/Token/routes';
import AvatarImage from '../../component-library/Image/AvatarImage';
import { getShortAddress } from '../../utils/wallet';
import GlobalToast from '../../component-library/Global/GlobalToast';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalImage from '../../component-library/Global/GlobalImage';
import IconCopy from '../../assets/images/IconCopy.png';
import IconChangeWallet from '../../assets/images/IconChangeWallet.png';
import IconQRCodeScanner from '../../assets/images/IconQRCodeScanner.png';
import { getMediaRemoteUrl } from '../../utils/media';
import { isExtension, isNative } from '../../utils/platform';
import clipboard from '../../utils/clipboard.native';
import storage from '../../utils/storage';
import { withTranslation } from '../../hooks/useTranslations';
import QRScan from '../../features/QRScan/QRScan';
import Tooltip from '../Tooltip/Tooltip';
import NetworkSelector from '../../pages/Wallet/components/NetworkSelector';

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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: theme.gutters.paddingSM,
  },
  walletName: {
    lineHeight: theme.fontSize.fontSizeNormal + 4,
  },
  walletAddressActions: {
    flexDirection: 'row',
  },
  walletAddress: {
    lineHeight: theme.fontSize.fontSizeNormal + 4,
    marginLeft: theme.gutters.paddingXS,
  },
  walletActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  narrowBtn: {
    paddingHorizontal: theme.gutters.paddingSM,
  },
  addressIcon: {
    marginLeft: theme.gutters.margin,
    marginTop: 1,
  },
  appStatus: {
    marginRight: theme.gutters.paddingNormal,
    borderRadius: 50,
    height: 14,
    width: 14,
  },
  appConnectedStatus: {
    backgroundColor: theme.colors.positiveBright,
  },
  appDisconnectedStatus: {
    backgroundColor: theme.colors.negativeBright,
  },
  networkSelector: {
    marginRight: theme.gutters.paddingXS,
    minWidth: 120,
  },
});

const Header = ({ isHome, t }) => {
  const [
    { activeAccount, activeBlockchainAccount, networkId },
    { changeNetwork },
  ] = useContext(AppContext);

  const [showToast, setShowToast] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const [hostname, setHostname] = useState(null);
  const [networks, setNetworks] = useState([]);

  const navigate = useNavigation();

  useEffect(() => {
    const checkConnection = async () => {
      if (isExtension()) {
        // eslint-disable-next-line no-undef
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        try {
          setHostname(new URL(tabs?.[0]?.url).hostname);
        } catch (err) {
          console.log(err);
        }
        const tabsIds = await storage.getItem('connectedTabsIds');
        setIsConnected(tabsIds?.includes(tabs?.[0]?.id));
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    const load = async () => {
      const switches = await getSwitches();
      const allNetworks = await getNetworks();
      setNetworks(
        allNetworks
          .filter(({ id }) => switches[id]?.enable)
          .map(({ name: label, id: value }) => ({ label, value })),
      );
    };

    load();
  }, []);

  const toggleScan = () => {
    setShowScan(!showScan);
  };

  const onRead = qr => {
    const data = qr;
    setShowScan(false);
    navigate(TOKEN_ROUTES_MAP.TOKEN_SELECT_TO, {
      action: 'sendTo',
      toAddress: data.data,
    });
  };

  const onClickAvatar = () => {
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_SELECT);
  };

  const onCopyAddress = () => {
    clipboard.copy(activeBlockchainAccount.getReceiveAddress());
    setShowToast(true);
  };

  const onSelectPathIndex = () => {
    navigate(ROUTES_WALLET_MAP.WALLET_INDEX_PATH);
  };

  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.avatarWalletAddressActions}>
        <View style={styles.avatarWalletAddress}>
          <TouchableOpacity onPress={onClickAvatar}>
            <AvatarImage
              src={getMediaRemoteUrl(activeAccount.avatar)}
              size={42}
            />
          </TouchableOpacity>
          <View style={styles.walletNameAddress}>
            <GlobalText
              type="body2"
              style={styles.walletName}
              numberOfLines={1}>
              {activeAccount.name}
            </GlobalText>
            <View style={styles.walletAddressActions}>
              <GlobalText
                type="caption"
                color="tertiary"
                style={styles.walletAddress}
                numberOfLines={1}>
                ({getShortAddress(activeBlockchainAccount.getReceiveAddress())})
              </GlobalText>
              <TouchableOpacity onPress={onCopyAddress}>
                <GlobalImage
                  source={IconCopy}
                  style={styles.addressIcon}
                  size="xxs"
                />
              </TouchableOpacity>
              {isHome &&
                activeAccount.networksAccounts[networkId].length > 1 && (
                  <TouchableOpacity onPress={onSelectPathIndex}>
                    <GlobalImage
                      source={IconChangeWallet}
                      style={styles.addressIcon}
                      size="xxs"
                    />
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </View>

        <View style={styles.walletActions}>
          {isHome && networks.length > 1 && (
            <View style={styles.networkSelector}>
              <NetworkSelector
                options={networks}
                setValue={changeNetwork}
                value={networkId}
              />
            </View>
          )}
          {/* <GlobalButton
                  type="icon"
                  transparent
                  icon={hasNotifications ? IconNotificationsAdd : IconNotifications}
                  style={styles.narrowBtn}
                  onPress={goToNotifications}
                /> */}
          {isNative() && (
            <GlobalButton
              type="icon"
              transparent
              icon={IconQRCodeScanner}
              style={styles.narrowBtn}
              onPress={toggleScan}
            />
          )}
          {isConnected !== null && (
            <Tooltip
              title={
                <GlobalText>
                  {t(isConnected ? 'header.connected' : 'header.disconnected', {
                    hostname,
                  })}
                </GlobalText>
              }>
              <View
                style={[
                  styles.appStatus,
                  isConnected
                    ? styles.appConnectedStatus
                    : styles.appDisconnectedStatus,
                ]}
              />
            </Tooltip>
          )}
        </View>
      </View>
      <GlobalToast
        message={t('wallet.copied')}
        open={showToast}
        setOpen={setShowToast}
      />
      {isNative() && (
        <QRScan active={showScan} onClose={toggleScan} onRead={onRead} />
      )}
    </SafeAreaView>
  );
};

export default withTranslation()(Header);
