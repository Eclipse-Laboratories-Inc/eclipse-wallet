import { useIdleTimer } from 'react-idle-timer';
const TIMEOUT_SEC = 60;

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
