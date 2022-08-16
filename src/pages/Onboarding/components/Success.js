import React from 'react';
import { StyleSheet } from 'react-native';

import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalImage from '../../../component-library/Global/GlobalImage';

import IconTransactionInteractionGreen from '../../../assets/images/IconTransactionInteractionGreen.png';

const styles = StyleSheet.create({
  bigIcon: {
    width: 120,
    height: 120,
  },
});

const Success = ({ goToWallet, goToDerived, t }) => (
  <>
    <GlobalLayout.Header>
      <GlobalPadding size="md" />
    </GlobalLayout.Header>

    <GlobalLayout.Inner>
      <GlobalPadding size="md" />

      <GlobalImage
        source={IconTransactionInteractionGreen}
        style={styles.bigIcon}
      />

      <GlobalPadding size="xl" />

      <GlobalText type="headline2" center>
        {t('wallet.create.success_message')}
      </GlobalText>

      <GlobalText type="body1" center>
        {t('wallet.create.success_message_body')}
      </GlobalText>
    </GlobalLayout.Inner>

    <GlobalLayout.Footer>
      <GlobalButton
        type="primary"
        wide
        title={t('wallet.create.go_to_my_wallet')}
        onPress={goToWallet}
      />

      <GlobalPadding size="md" />

      <GlobalButton
        type="secondary"
        wide
        title="Select Derivable"
        onPress={goToDerived}
      />
    </GlobalLayout.Footer>
  </>
);

export default Success;
