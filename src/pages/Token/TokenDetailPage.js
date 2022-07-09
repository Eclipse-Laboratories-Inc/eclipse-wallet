import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';

import GlobalText from '../../component-library/Global/GlobalText';

import BackButtonPage from '../../component-library/Layout/BackButtonPage';

const TokenDetailPage = ({ params }) => {
  const navigate = useNavigation();
  const [] = useContext(AppContext);
  return (
    <BackButtonPage onBack={() => navigate(ROUTES_MAP.WALLET)}>
      <GlobalText type="headline2" center>
        Token Detail
      </GlobalText>
      <GlobalText type="body1" center>
        {params.tokenId}
      </GlobalText>
    </BackButtonPage>
  );
};

export default withParams(TokenDetailPage);
