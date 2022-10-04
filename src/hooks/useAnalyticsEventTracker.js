import React from 'react';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const useAnalyticsEventTracker = section => {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: section });
  }, [section]);

  const trackEvent = (action, label) => {
    console.log('track event');
    ReactGA.event({
      category: section,
      action: action,
      label: label,
    });
  };
  return { trackEvent };
};
export default useAnalyticsEventTracker;
