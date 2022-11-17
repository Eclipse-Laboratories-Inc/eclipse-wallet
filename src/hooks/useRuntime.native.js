import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

const ADAPTER_PREFIXES = ['solana-wallet:', 'https://salmonwallet.io/adapter'];

const useRuntime = () => {
  const [ready, setReady] = useState(false);
  const [isAdapter, setIsAdapter] = useState(false);

  useEffect(() => {
    Linking.getInitialURL()
      .then(url => setIsAdapter(ADAPTER_PREFIXES.some(p => url?.startsWith(p))))
      .finally(() => setReady(true));
  }, []);

  return {
    ready,
    context: new URLSearchParams(),
    opener: null,
    isAdapter,
  };
};

export default useRuntime;
