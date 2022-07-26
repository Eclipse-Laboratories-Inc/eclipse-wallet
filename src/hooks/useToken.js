import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppProvider';
import { cache, CACHE_TYPES } from '../utils/cache';

const useToken = ({ tokenId }) => {
  const [loaded, setloaded] = useState(false);
  const [{ activeWallet }] = useContext(AppContext);
  const [token, setToken] = useState({});

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
      ]).then(([balance]) => {
        const tokenSelected = (balance.items || []).find(
          i => i.address === tokenId,
        );
        setToken(tokenSelected || {});
        setloaded(true);
      });
    }
  }, [activeWallet, tokenId]);

  return { loaded, token };
};

export default useToken;
