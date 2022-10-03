import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, CardContent, FormControlLabel, Switch } from '@mui/material';
import { getWalletName, getShortAddress } from '../../../utils/wallet';
import { withTranslation } from '../../../hooks/useTranslations';

import { ButtonText } from '../../../component-library/Button/Button';
import theme, { globalStyles } from '../../../component-library/Global/theme';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalText from '../../../component-library/Global/GlobalText';

import IconSwap from '../../../assets/images/IconSwapAccent1.png';
import IconWarning from '../../../assets/images/IconTransactionResultWarning.png';
import { DAppCard } from './DAppCard';

const styles = StyleSheet.create({
  connectIcon: {
    alignSelf: 'center',
    display: 'block',
  },
  warningIcon: {
    marginRight: theme.gutters.margin,
  },
  inlineFlex: {
    flexDirection: 'row',
  },
  card: {
    paddingBottom: theme.gutters.paddingXXS,
  },
  agreeButton: {
    alignSelf: 'end',
  },
});

const ApproveConnectionForm = ({
  t,
  wallet,
  origin,
  name,
  icon,
  config,
  onApprove,
}) => {
  const [autoApprove, setAutoApprove] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalText color="primary">
          {getWalletName(wallet.getReceiveAddress(), config)}
        </GlobalText>
        <GlobalText type="caption">
          {getShortAddress(wallet.publicKey.toBase58())}
        </GlobalText>
      </GlobalLayout.Header>
      <GlobalLayout.Inner>
        <GlobalText type="headline2" center>
          {t('adapter.detail.connection.title')}
        </GlobalText>
        <GlobalPadding size="xl" />
        <DAppCard name={name} icon={icon} origin={origin} />
        <GlobalPadding size="xl" />
        <GlobalText type="subtitle" color="warning" center>
          {t('adapter.detail.connection.advice')}
        </GlobalText>
        <GlobalPadding size="md" />
        <GlobalText type="subtitle" color="warning" center>
          {t('adapter.detail.connection.advice2')}
        </GlobalText>
        <GlobalPadding size="md" />
        {/* disabling auto approve for secutiry reasons 
        <View style={globalStyles.inlineFlexAround}>
          <FormControlLabel
            control={
              <Switch
                checked={autoApprove}
                onChange={() => setAutoApprove(!autoApprove)}
                color="primary"
                size="small"
              />
            }
            label={t('adapter.detail.connection.auto_approve')}
          />
        </View>
        */}
        {!dismissed && autoApprove && (
          <Card>
            <CardContent style={styles.card}>
              <View style={styles.inlineFlex}>
                <GlobalImage
                  source={IconWarning}
                  size="xs"
                  style={styles.warningIcon}
                />
                <GlobalText type="body1" color="warning">
                  {t('adapter.detail.connection.disclaimer')}
                </GlobalText>
              </View>
              <GlobalText type="caption">
                {t('adapter.detail.connection.warning')}
              </GlobalText>
              <View>
                <ButtonText
                  style={styles.agreeButton}
                  text={t('adapter.detail.connection.agree')}
                  onClick={() => setDismissed(true)}
                />
              </View>
            </CardContent>
          </Card>
        )}
      </GlobalLayout.Inner>
      <GlobalLayout.Footer>
        <View style={globalStyles.inlineFlexButtons}>
          <GlobalButton
            type="secondary"
            flex
            title={t('actions.deny')}
            onPress={window?.close}
            style={[globalStyles.button, globalStyles.buttonLeft]}
            touchableStyles={globalStyles.buttonTouchable}
          />
          <GlobalButton
            type="primary"
            flex
            title={t('actions.connect')}
            onPress={() => onApprove(autoApprove)}
            disabled={!dismissed && autoApprove}
            style={[globalStyles.button, globalStyles.buttonRight]}
            touchableStyles={globalStyles.buttonTouchable}
          />
        </View>
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(ApproveConnectionForm);
