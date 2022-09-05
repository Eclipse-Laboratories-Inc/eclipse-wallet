import React from 'react';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalText from '../../../component-library/Global/GlobalText';

import { withTranslation } from '../../../hooks/useTranslations';

const KeepOpenBanner = ({ t }) => (
  <GlobalLayout fullscreen>
    <GlobalLayout.Header>
      <GlobalText color="primary">
        {t('adapter.detail.banner.message')}
      </GlobalText>
    </GlobalLayout.Header>
  </GlobalLayout>
);

export default withTranslation()(KeepOpenBanner);
