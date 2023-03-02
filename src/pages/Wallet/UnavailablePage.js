import React from 'react';
import { withTranslation } from '../../hooks/useTranslations';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import Header from '../../component-library/Layout/Header';

const UnavailablePage = ({ t }) => {
  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <Header />
        <GlobalBackTitle title={t('wallet.not_available_title')} />

        <GlobalPadding />
        <GlobalText type={'body1'} center>
          {t('wallet.not_available_msg')}
        </GlobalText>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(UnavailablePage);
