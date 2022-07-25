import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from './theme';
import GlobalButton from './GlobalButton';

const styles = StyleSheet.create({
  inlineFlexButtons: {
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

const GlobalSendReceive = ({ goToSend, goToReceive }) => (
  <View style={styles.inlineFlexButtons}>
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
);
export default GlobalSendReceive;
