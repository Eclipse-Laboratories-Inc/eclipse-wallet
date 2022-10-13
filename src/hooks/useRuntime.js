import { useMemo } from 'react';
import { isExtension } from '../utils/platform';

const useRuntime = () => {
  const context = useMemo(
    () => new URLSearchParams(window.location.hash.slice(1)),
    [],
  );
  const opener = useMemo(() => window.opener, []);

  return {
    ready: true,
    context,
    opener,
    isAdapter: context.has('origin') && (isExtension() || !!opener),
  };
};

export default useRuntime;
