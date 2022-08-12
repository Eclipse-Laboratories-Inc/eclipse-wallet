import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Modal, StyleSheet, View } from 'react-native';

import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalImage from '../../component-library/Global/GlobalImage';
import { LOGOS } from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';

const QRScan = ({
  active,
  onClose,
  onRead,
  title = 'Scan QR Code',
  chain = 'SOLANA',
}) => (
  <Modal animationType="slide" onRequestClose={onClose} visible={active}>
    <QRCodeScanner
      fadeIn={false}
      onRead={onRead}
      containerStyle={styles.mainContainer}
      showMarker
      markerStyle={styles.marker}
      topViewStyle={styles.headerContainer}
      topContent={
        <View style={styles.titleContainer}>
          <GlobalBackTitle title={title} onBack={onClose} />
        </View>
      }
      bottomContent={
        <View style={globalStyles.centered}>
          <GlobalImage
            source={getMediaRemoteUrl(LOGOS[chain])}
            size="xl"
            circle
          />
        </View>
      }
    />
  </Modal>
);
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: theme.gutters.paddingNormal,
    paddingBottom: theme.gutters.padding4XL,
    width: '100%',
    maxWidth: theme.variables.mobileWidthLG,
    backgroundColor: theme.colors.bgPrimary,
  },
  headerContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    flexGrow: 1,
  },
  marker: { borderColor: theme.colors.white, borderRadius: 40 },
});

export default QRScan;
