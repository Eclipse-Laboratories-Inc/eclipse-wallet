import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../AppProvider';

const useToken = ({ tokenId }) => {
  const [loaded, setloaded] = useState(false);
  const [{ activeBlockchainAccount, networkId, activeTokens }] =
    useContext(AppContext);
  const [token, setToken] = useState({});

  const tokensAddresses = useMemo(
    () => Object.keys(activeTokens),
    [activeTokens],
  );

  useEffect(() => {
    if (activeBlockchainAccount) {
      activeBlockchainAccount
        .getBalance(tokensAddresses)
        .then(balance => {
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
