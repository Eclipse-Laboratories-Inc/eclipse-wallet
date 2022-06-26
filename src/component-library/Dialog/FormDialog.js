import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const FormDialog = ({
  title,
  onClose,
  onSubmit,
  isOpen,
  text,
  labelCancel,
  labelSubmit,
  children,
  isDisabledSubmit,
}) => (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{text}</DialogContentText>
      {children}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>{labelCancel}</Button>
      <Button onClick={onSubmit} disabled={isDisabledSubmit}>
        {labelSubmit}
      </Button>
    </DialogActions>
  </Dialog>
);

export default FormDialog;
