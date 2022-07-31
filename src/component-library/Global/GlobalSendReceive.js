import React from 'react';
import { View } from 'react-native';

import { globalStyles } from './theme';
import GlobalButton from './GlobalButton';

const GlobalSendReceive = ({ goToSend, goToReceive }) => (
  <View style={globalStyles.inlineFlexButtons}>
    <GlobalButton
      type="primary"
      flex
      title="Send"
      onPress={goToSend}
      key={'send-button'}
      style={[globalStyles.button, globalStyles.buttonLeft]}
      touchableStyles={globalStyles.buttonTouchable}
    />

    <GlobalButton
      type="primary"
      flex
      title="Receive"
      onPress={goToReceive}
      style={[globalStyles.button, globalStyles.buttonRight]}
      touchableStyles={globalStyles.buttonTouchable}
    />
  </View>
);
export default GlobalSendReceive;
