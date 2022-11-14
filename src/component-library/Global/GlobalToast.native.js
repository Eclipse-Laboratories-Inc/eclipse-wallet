import Snackbar from 'react-native-snackbar';

const GlobalToast = ({ message, open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  if (open) {
    Snackbar.show({
      text: message,
      duration: 1500,
      action: {
        text: 'Close',
        textColor: 'green',
        onPress: () => {
          handleClose();
        },
      },
    });

    handleClose();
  }
};

export default GlobalToast;
