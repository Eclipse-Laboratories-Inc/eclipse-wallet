import React from 'react';
import { View } from 'react-native';

import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalAlert from '../../../component-library/Global/GlobalAlert';
import { globalStyles } from '../../../component-library/Global/theme';

import { ActiveWalletCard } from './ActiveWalletCard';
import { DAppCard } from './DAppCard';
import VerifiedByBlowfish from './VerifiedByBlowfish';
import { withTranslation } from '../../../hooks/useTranslations';

const FailedTransactions = ({
  t,
  origin,
  name,
  icon,
  error,
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
      <GlobalAlert type="error" text={error.humanReadableError} />
      <GlobalPadding size="2xl" />
      <VerifiedByBlowfish />
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

export default withTranslation()(FailedTransactions);
