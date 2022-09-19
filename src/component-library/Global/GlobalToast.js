import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert
        icon={false}
        onClose={handleClose}
        severity="success"
        sx={{ width: '100%', bgcolor: '#202536' }}>
        <GlobalText type="body1">{message}</GlobalText>
      </Alert>
    </Snackbar>
  );
};

export default GlobalToast;
