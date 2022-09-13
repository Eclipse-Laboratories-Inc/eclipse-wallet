import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { globalStyles } from '../../component-library/Global/theme';
import GlobalButton from '../Global/GlobalButton';
import GlobalPadding from '../Global/GlobalPadding';
import { View } from 'react-native';
import { withTranslation } from '../../hooks/useTranslations';

const SimpleDialog = ({ title, onClose, isOpen, action, text, t }) => (
  <Dialog
    fullWidth
    open={isOpen}
    onClose={onClose}
    maxWidth="xs"
    PaperProps={{
      style: { background: 'rgba(22,28,45, 0.9)' },
    }}>
    <DialogContent>
      <View>{title}</View>
      <View>
        {text}
        <GlobalPadding size="xl" />
      </View>
      <View>
        <GlobalButton
          type="primary"
          flex
          title={t('actions.follow_us')}
          onPress={action}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
        <GlobalPadding size="sm" />
        <GlobalButton
          type="secondary"
          flex
          title={t('actions.continue')}
          onPress={onClose}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      </View>
    </DialogContent>
  </Dialog>
);

export default withTranslation()(SimpleDialog);
