import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../AppProvider';
import { cache, CACHE_TYPES } from '../utils/cache';

const useToken = ({ tokenId }) => {
  const [loaded, setloaded] = useState(false);
  const [{ activeBlockchainAccount, activeTokens }] = useContext(AppContext);
  const [token, setToken] = useState({});

  const tokensAddresses = useMemo(
    () => Object.keys(activeTokens),
    [activeTokens],
  );

  const networkId = useMemo(
    () => activeBlockchainAccount.network.id,
    [activeBlockchainAccount],
  );

  useEffect(() => {
    if (activeBlockchainAccount) {
      Promise.all([
        cache(
          `${networkId}-${activeBlockchainAccount.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeBlockchainAccount.getBalance(tokensAddresses),
        ),
      ])
        .then(([balance]) => {
          const tokenSelected = (balance.items || []).find(
            i => i.address === tokenId,
          );
          setToken(tokenSelected || {});
          setloaded(true);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [activeBlockchainAccount, networkId, tokenId, tokensAddresses]);

  return { loaded, token };
};

export default useToken;
