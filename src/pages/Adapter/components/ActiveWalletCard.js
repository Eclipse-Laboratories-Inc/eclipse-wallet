import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../../../component-library/Global/theme';
import GlobalText from '../../../component-library/Global/GlobalText';
import { AppContext } from '../../../AppProvider';
import { getShortAddress } from '../../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wallet: {
    flexDirection: 'column',
  },
  environment: {
    padding: theme.gutters.paddingXXS,
    borderWidth: 1,
    borderColor: theme.colors.labelPrimary,
    borderRadius: theme.borderRadius.borderRadiusNormal,
  },
});

export const ActiveWalletCard = ({ showEnvironment = false }) => {
  const [{ activeAccount, activeBlockchainAccount, context }] =
    useContext(AppContext);

  const environment = useMemo(
    () => context.get('network') || activeBlockchainAccount.network.environment,
    [context, activeBlockchainAccount],
  );

  return (
    <View style={styles.container}>
      <View style={styles.wallet}>
        <GlobalText color="primary">{activeAccount.name}</GlobalText>
        <GlobalText type="caption">
          {getShortAddress(activeBlockchainAccount.getReceiveAddress())}
        </GlobalText>
      </View>
      {showEnvironment && (
        <GlobalText style={styles.environment} type="caption" center uppercase>
          {environment}
        </GlobalText>
      )}
    </View>
  );
};
