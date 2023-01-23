import React from 'react';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import Header from '../../component-library/Layout/Header';

const UnavailablePage = () => {
  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <Header />
        <GlobalBackTitle title="Not available" />

        <GlobalPadding />
        <GlobalText type={'body1'} center>
          Not available
        </GlobalText>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default UnavailablePage;
