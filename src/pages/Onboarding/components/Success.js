import React from 'react';

import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';

import Logo from '../components/Logo';

const Success = ({ goToWallet, goToAdapter, t }) => (
  <>
    <GlobalLayout.Header>
      <GlobalPadding size="md" />
    </GlobalLayout.Header>

    <GlobalLayout.Inner>
      <GlobalPadding size="md" />

      <Logo />

      <GlobalPadding size="xl" />

      <GlobalText type="headline2" center>
        {t('wallet.create.success_message')}
      </GlobalText>

      <GlobalText type="body1" center>
        {t('wallet.create.success_message_body')}
      </GlobalText>
    </GlobalLayout.Inner>

    <GlobalLayout.Footer>
      {goToWallet && (
        <GlobalButton
          type="primary"
          wide
          title={t('wallet.create.go_to_my_wallet')}
          onPress={goToWallet}
        />
      )}

      {goToAdapter && (
        <GlobalButton
          type="primary"
          wide
          title={t('actions.continue')}
          onPress={goToAdapter}
        />
      )}
    </GlobalLayout.Footer>
  </>
);

export default Success;
