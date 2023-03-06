import React from 'react';
import { View } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';

import { globalStyles } from './theme';
import GlobalButton from './GlobalButton';

const GlobalSendReceive = ({
  goToSend,
  goToReceive,
  goToList,
  goToBurn,
  goToBridge,
  canSend = false,
  canReceive = false,
  canList = false,
  canBurn = false,
  canBridge = false,
  titleList,
  listedLoaded,
  t,
}) => {
  return (
    <View style={globalStyles.inlineFlexButtons}>
      {canSend && (
        <GlobalButton
          type="primary"
          flex
          title={t('actions.send')}
          onPress={goToSend}
          key={'send-button'}
          style={[globalStyles.button, globalStyles.buttonLeft]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      )}
      {canReceive && (
        <GlobalButton
          type="primary"
          flex
          title={t('actions.receive')}
          onPress={goToReceive}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      )}
      {canList && (
        <GlobalButton
          type="secondary"
          flex
          title={titleList}
          onPress={goToList}
          disabled={!listedLoaded}
          key={'list-button'}
          style={[globalStyles.button, globalStyles.buttonLeft]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      )}
      {canBurn && (
        <GlobalButton
          type="secondary"
          flex
          title={t('nft.burn_nft')}
          onPress={goToBurn}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      )}
      {canBridge && (
        <GlobalButton
          type="primary"
          flex
          title={t('actions.bridge')}
          onPress={goToBridge}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      )}
    </View>
  );
};
export default withTranslation()(GlobalSendReceive);
