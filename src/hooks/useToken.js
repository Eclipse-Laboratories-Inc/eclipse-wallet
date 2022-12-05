import { useContext, useEffect, useMemo, useState } from 'react';
import get from 'lodash/get';
import { AppContext } from '../AppProvider';
import { cache, CACHE_TYPES } from '../utils/cache';

const useToken = ({ tokenId }) => {
  const [loaded, setloaded] = useState(false);
  const [{ activeWallet, config }] = useContext(AppContext);
  const [token, setToken] = useState({});

  const tokensAddresses = useMemo(
    () =>
      Object.keys(
        get(config, `${activeWallet?.getReceiveAddress()}.tokens`, {}),
      ),
    [activeWallet, config],
  );

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(tokensAddresses),
        ),
      ]).then(([balance]) => {
        const tokenSelected = (balance.items || []).find(
          i => i.address === tokenId,
        );
        setToken(tokenSelected || {});
        setloaded(true);
      });
    }
  }, [activeWallet, tokenId, tokensAddresses]);

  return { loaded, token };
};

export default useToken;
