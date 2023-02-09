import { useState, useEffect, useContext, useMemo } from 'react';

import storage from '../utils/storage';
import STORAGE_KEYS from '../utils/storageKeys';
import { EXPLORERS, DEFAULT_EXPLORERS } from '../config/explorers';
import { AppContext } from '../AppProvider';

const useUserConfig = () => {
  const [{ activeBlockchainAccount }] = useContext(AppContext);
  const [userConfig, setUserConfig] = useState(null);
  const [explorer, setExplorer] = useState();
  const [explorers, setExplorers] = useState();

  const environment = useMemo(
    () => activeBlockchainAccount.network.environment,
    [activeBlockchainAccount],
  );
  const blockchain = useMemo(
    () => activeBlockchainAccount.network.blockchain.toUpperCase(),
    [activeBlockchainAccount],
  );

  const toArray = objects => {
    const result = Object.keys(objects).map(key => {
      return { ...objects[key], key };
    });
    return result;
  };

  useEffect(() => {
    storage.getItem(STORAGE_KEYS.USER_CONFIG).then(config => {
      if (!config) config = {};
      if (!config.explorers) config.explorers = DEFAULT_EXPLORERS;
      storage.setItem(STORAGE_KEYS.USER_CONFIG, config);
      setUserConfig(config);
      setExplorer(
        EXPLORERS[blockchain][environment][config.explorers[blockchain]],
      );
      setExplorers(toArray(EXPLORERS[blockchain][environment]));
    });
  }, [blockchain, environment]);

  const changeExplorer = async value => {
    userConfig.explorers[blockchain] = value;
    setExplorer(
      EXPLORERS[blockchain][environment][userConfig.explorers[blockchain]],
    );
    storage.setItem(STORAGE_KEYS.USER_CONFIG, userConfig);
  };

  return { userConfig, explorer, explorers, changeExplorer };
};

export default useUserConfig;
