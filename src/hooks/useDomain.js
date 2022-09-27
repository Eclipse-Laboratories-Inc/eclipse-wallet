import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppProvider';
import { cache, CACHE_TYPES } from '../utils/cache';

const useDomain = () => {
  const [{ activeWallet }] = useContext(AppContext);
  const [domain, setDomain] = useState(null);

  useEffect(() => {
    if (activeWallet) {
      activeWallet.getDomain().then(result => {
        setDomain(result);
      });
    }
  }, [activeWallet, domain]);

  return { domain };
};

export default useDomain;
