import React from 'react';
import { View } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';

import { globalStyles } from './theme';
import GlobalButton from './GlobalButton';

const GlobalSendReceive = ({ goToSend, goToReceive, t }) => (
  <View style={globalStyles.inlineFlexButtons}>
    <GlobalButton
      type="primary"
      flex
      title={t('actions.send')}
      onPress={goToSend}
      key={'send-button'}
      style={[globalStyles.button, globalStyles.buttonLeft]}
      touchableStyles={globalStyles.buttonTouchable}
    />

    <GlobalButton
      type="primary"
      flex
      title={t('actions.receive')}
      onPress={goToReceive}
      style={[globalStyles.button, globalStyles.buttonRight]}
      touchableStyles={globalStyles.buttonTouchable}
    />
  </View>
);
export default withTranslation()(GlobalSendReceive);
