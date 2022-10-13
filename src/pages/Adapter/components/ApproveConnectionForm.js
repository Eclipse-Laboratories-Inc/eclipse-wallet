import React from 'react';
import { View } from 'react-native';

import { globalStyles } from '../../../component-library/Global/theme';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalText from '../../../component-library/Global/GlobalText';

import { ActiveWalletCard } from './ActiveWalletCard';
import { DAppCard } from './DAppCard';
import { withTranslation } from '../../../hooks/useTranslations';

const ApproveConnectionForm = ({
  t,
  origin,
  name,
  icon,
  onApprove,
  onReject,
}) => (
  <GlobalLayout fullscreen>
    <GlobalLayout.Header>
      <ActiveWalletCard />
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
    </GlobalLayout.Inner>
    <GlobalLayout.Footer>
      <View style={globalStyles.inlineFlexButtons}>
        <GlobalButton
          type="secondary"
          flex
          title={t('actions.deny')}
          onPress={() => onReject()}
          style={[globalStyles.button, globalStyles.buttonLeft]}
          touchableStyles={globalStyles.buttonTouchable}
        />
        <GlobalButton
          type="primary"
          flex
          title={t('actions.connect')}
          onPress={() => onApprove()}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      </View>
    </GlobalLayout.Footer>
  </GlobalLayout>
);

export default withTranslation()(ApproveConnectionForm);
