import React, { useState } from 'react';
import UserInactivity from 'react-native-user-inactivity';
import { TIMEOUT_SEC } from './constants';

const InactivityCheck = ({ children, onIdle, active }) => {
  const [isActive, setIsActive] = useState(true);
  const handleAction = status => {
    setIsActive(status);
    if (!status) {
      onIdle();
    }
  };
  if (active) {
    return (
      <UserInactivity
        isActive={isActive}
        timeForInactivity={TIMEOUT_SEC * 1000}
        onAction={handleAction}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }}>
        {children}
      </UserInactivity>
    );
  } else {
    return children;
  }
};

export default InactivityCheck;
