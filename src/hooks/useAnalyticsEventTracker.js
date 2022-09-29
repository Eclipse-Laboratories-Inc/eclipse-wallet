import React from 'react';
import { useEffect } from 'react';

const useAnalyticsEventTracker = section => {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    gtag('event', section);
  }, [section]);

  const trackEvent = params => {
    // eslint-disable-next-line no-undef
    gtag('event', section, params);
  };

  return { trackEvent };
};
export default useAnalyticsEventTracker;
