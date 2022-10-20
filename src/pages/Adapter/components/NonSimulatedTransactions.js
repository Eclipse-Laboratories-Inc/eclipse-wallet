import React from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalAlert from '../../../component-library/Global/GlobalAlert';
import { globalStyles } from '../../../component-library/Global/theme';

import { ActiveWalletCard } from './ActiveWalletCard';
import { DAppCard } from './DAppCard';
import { withTranslation } from '../../../hooks/useTranslations';

import Blowfish from '../../../assets/images/Blowfish.png';

const styles = StyleSheet.create({
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const NonSimulatedTransactions = ({
  t,
  origin,
  name,
  icon,
  onRetry,
  onReject,
  onApprove,
}) => (
  <GlobalLayout fullscreen>
    <GlobalLayout.Header>
      <ActiveWalletCard />
      <GlobalBackTitle title={t('adapter.detail.transaction.title')} nospace />
    </GlobalLayout.Header>
    <GlobalLayout.Inner>
      <DAppCard name={name} icon={icon} origin={origin} />
      <GlobalPadding size="xl" />
      <GlobalAlert
        text={t('adapter.detail.transaction.warning')}
        type="warning"
      />
      <GlobalPadding size="2xl" />
      <View style={styles.retry}>
        <GlobalButton type="text" onPress={onRetry}>
          <GlobalText color="negative" type="caption">
            {t('adapter.detail.transaction.retry')}
          </GlobalText>
        </GlobalButton>
        <GlobalImage source={Blowfish} size="xl" />
      </View>
    </GlobalLayout.Inner>
    <GlobalLayout.Footer>
      <View style={globalStyles.inlineFlexButtons}>
        <GlobalButton
          type="secondary"
          flex
          title={t('actions.cancel')}
          onPress={onReject}
          style={[globalStyles.button, globalStyles.buttonLeft]}
          touchableStyles={globalStyles.buttonTouchable}
        />
        <GlobalButton
          type="primary"
          flex
          title={t('actions.confirm_anyway')}
          onPress={() => onApprove()}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      </View>
    </GlobalLayout.Footer>
  </GlobalLayout>
);

export default withTranslation()(NonSimulatedTransactions);
