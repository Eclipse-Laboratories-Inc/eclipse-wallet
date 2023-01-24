import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppProvider';

const useDomain = () => {
  const [{ activeBlockchainAccount }] = useContext(AppContext);
  const [domain, setDomain] = useState(null);

  useEffect(() => {
    if (activeBlockchainAccount) {
      activeBlockchainAccount.getDomain().then(result => {
        setDomain(result);
      });
    }
  }, [activeBlockchainAccount, domain]);

  return { domain };
};

export default useDomain;
