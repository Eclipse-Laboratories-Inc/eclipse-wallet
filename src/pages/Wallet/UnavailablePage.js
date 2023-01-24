import React, { useContext } from 'react';
import { AppContext } from '../../AppProvider';
import { withTranslation } from '../../hooks/useTranslations';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import Header from '../../component-library/Layout/Header';

const UnavailablePage = ({ t }) => {
  const [{ activeWallet, config }] = useContext(AppContext);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <Header activeWallet={activeWallet} config={config} t={t} />
        <GlobalBackTitle title="Not available" />

        <GlobalPadding />
        <GlobalText type={'body1'} center>
          Not available
        </GlobalText>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(UnavailablePage);
