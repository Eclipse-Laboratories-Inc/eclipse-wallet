import React from 'react';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';

const HelpSupportPage = ({ t }) => {
  const navigate = useNavigation();

  const onBack = () => navigate(ROUTES_SETTINGS_MAP.SETTINGS_OPTIONS);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title={t(`settings.help_support`)} />
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(HelpSupportPage);
