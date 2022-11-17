import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../../../component-library/Global/theme';
import GlobalText from '../../../component-library/Global/GlobalText';
import { AppContext } from '../../../AppProvider';
import { getShortAddress, getWalletName } from '../../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wallet: {
    flexDirection: 'column',
  },
  network: {
    padding: theme.gutters.paddingXXS,
    borderWidth: 1,
    borderColor: theme.colors.black,
    borderRadius: theme.borderRadius.borderRadiusNormal,
  },
});

export const ActiveWalletCard = ({ showNetwork = false }) => {
  const [{ activeWallet, config, context }] = useContext(AppContext);
  const address = useMemo(
    () => activeWallet.getReceiveAddress(),
    [activeWallet],
  );
  const network = useMemo(
    () => context.get('network') || activeWallet.networkId,
    [context, activeWallet.networkId],
  );

  return (
    <View style={styles.container}>
      <View style={styles.wallet}>
        <GlobalText color="primary">
          {getWalletName(address, config)}
        </GlobalText>
        <GlobalText type="caption">{getShortAddress(address)}</GlobalText>
      </View>
      {showNetwork && (
        <GlobalText style={styles.network} type="caption" center uppercase>
          {network}
        </GlobalText>
      )}
    </View>
  );
};
