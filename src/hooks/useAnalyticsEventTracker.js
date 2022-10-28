import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { isExtension } from '../utils/platform';

const useAnalyticsEventTracker = section => {
  useEffect(() => {
    if (!isExtension()) {
      ReactGA.send({ hitType: 'pageview', page: section });
    }
  }, [section]);

  const trackEvent = (action, label) => {
    if (!isExtension()) {
      ReactGA.event({
        category: section,
        action: action,
        label: label,
      });
    }
  };
  return { trackEvent };
};

export default useAnalyticsEventTracker;
