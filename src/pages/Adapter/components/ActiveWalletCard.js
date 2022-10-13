import React, { useContext, useMemo } from 'react';

import GlobalText from '../../../component-library/Global/GlobalText';
import { AppContext } from '../../../AppProvider';
import { getShortAddress, getWalletName } from '../../../utils/wallet';

export const ActiveWalletCard = () => {
  const [{ activeWallet, config }] = useContext(AppContext);
  const address = useMemo(
    () => activeWallet.getReceiveAddress(),
    [activeWallet],
  );

  return (
    <>
      <GlobalText color="primary">{getWalletName(address, config)}</GlobalText>
      <GlobalText type="caption">{getShortAddress(address)}</GlobalText>
    </>
  );
};
