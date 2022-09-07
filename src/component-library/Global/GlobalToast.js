import Snackbar from '@mui/material/Snackbar';
import GlobalText from './GlobalText';

const GlobalToast = ({ message, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    />
  );
};

export default GlobalToast;
