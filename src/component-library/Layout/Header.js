import React, { useEffect, useState } from 'react';
import theme from '../../component-library/Global/theme';
import { StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from '../../pages/Settings/routes';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from '../../pages/Token/routes';
import AvatarImage from '../../component-library/Image/AvatarImage';
import {
  getWalletName,
  getShortAddress,
  getWalletAvatar,
} from '../../utils/wallet';
import IconQRCodeScanner from '../../assets/images/IconQRCodeScanner.png';
import GlobalToast from '../../component-library/Global/GlobalToast';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalImage from '../../component-library/Global/GlobalImage';
import IconCopy from '../../assets/images/IconCopy.png';
import { getMediaRemoteUrl } from '../../utils/media';
import { isExtension, isNative } from '../../utils/platform';
import clipboard from '../../utils/clipboard.native';
import storage from '../../utils/storage';
import { withTranslation } from '../../hooks/useTranslations';
import QRScan from '../../features/QRScan/QRScan';
import Tooltip from '../Tooltip/Tooltip';

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
    alignItems: 'center',
  },
  narrowBtn: {
    paddingHorizontal: theme.gutters.paddingSM,
  },
  addressCopyIcon: {
    marginLeft: theme.gutters.margin,
    marginTop: 1,
    position: 'absolute',
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
});

const Header = ({ activeWallet, config, t }) => {
  const [showToast, setShowToast] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const [hostname, setHostname] = useState(null);

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
    // clipboard.copy(activeWallet.getReceiveAddress());
    console.log('copied');
    setShowToast(false);
  };

  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.avatarWalletAddressActions}>
        <View style={styles.avatarWalletAddress}>
          <TouchableOpacity onPress={onClickAvatar}>
            <AvatarImage
              src={getMediaRemoteUrl(
                getWalletAvatar(activeWallet.getReceiveAddress(), config),
              )}
              size={42}
            />
          </TouchableOpacity>
          <View style={styles.walletNameAddress}>
            <GlobalText
              type="body2"
              style={styles.walletName}
              numberOfLines={1}>
              {getWalletName(activeWallet.getReceiveAddress(), config)}
            </GlobalText>
            <TouchableOpacity onPress={onCopyAddress}>
              <GlobalText
                type="body1"
                color="tertiary"
                style={styles.walletAddress}
                numberOfLines={1}>
                ({getShortAddress(activeWallet.getReceiveAddress())})
                <GlobalImage
                  source={IconCopy}
                  style={styles.addressCopyIcon}
                  size="xxs"
                />
              </GlobalText>
            </TouchableOpacity>
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
