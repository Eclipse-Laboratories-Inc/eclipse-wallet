import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import theme from '../../component-library/Global/theme';
import GlobalText from '../../component-library/Global/GlobalText';

const QRScan = ({
  active,
  onClose,
  onRead,
  title = 'Scan QR Code',
  chain = 'SOLANA',
}) => (
  <Modal animationType="slide" onRequestClose={onClose} visible={active}>
    <View style={styles.mainContainer}>
      <GlobalText>Option Unavailable</GlobalText>
    </View>
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
});

export default QRScan;
