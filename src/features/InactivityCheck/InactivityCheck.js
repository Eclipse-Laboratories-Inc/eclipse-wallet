import { useIdleTimer } from 'react-idle-timer';
import { TIMEOUT_SEC } from './constants';

const InactivityCheck = ({ children, onIdle, active }) => {
  useIdleTimer({
    onIdle,
    timeout: TIMEOUT_SEC * 1000,
    startOnMount: active,
    startManually: !active,
  });

  return children;
};

export default InactivityCheck;
