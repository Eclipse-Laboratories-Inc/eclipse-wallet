import React from 'react';

import { useNavigation } from '../../../routes/hooks';
import { withTranslation } from '../../../hooks/useTranslations';
import { ROUTES_MAP } from '../../Onboarding/routes';

import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';

const AdapterSelect = ({ t }) => {
  const navigate = useNavigation();
  const chainCode = 'SOLANA';

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalBackTitle title={t('adapter.select.title')} />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wide
          title={t('wallet.create_wallet')}
          onPress={() => navigate(ROUTES_MAP.ONBOARDING_CREATE, { chainCode })}
        />

        <GlobalPadding size="md" />

        <GlobalButton
          type="secondary"
          wide
          title={t('wallet.recover_wallet')}
          onPress={() => navigate(ROUTES_MAP.ONBOARDING_RECOVER, { chainCode })}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(AdapterSelect);
