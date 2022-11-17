import { useState, useEffect } from 'react';

import storage from '../utils/storage';

const STORAGE_KEYS = {
  USER_CONFIG: 'user_config',
};
import { EXPLORERS, DEFAULT_EXPLORERS } from '../config/explorers';

const useUserConfig = chain => {
  const [userConfig, setUserConfig] = useState(null);
  const [explorer, setExplorer] = useState();
  const [explorers, setExplorers] = useState();

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
      setExplorer(EXPLORERS[chain][config.explorers[chain]]);
      setExplorers(toArray(EXPLORERS[chain]));
    });
  }, [chain]);

  const changeExplorer = async value => {
    userConfig.explorers[chain] = value;
    setExplorer(EXPLORERS[chain][userConfig.explorers[chain]]);
    storage.setItem(STORAGE_KEYS.USER_CONFIG, userConfig);
  };

  return { userConfig, explorer, explorers, changeExplorer };
};

export default useUserConfig;
