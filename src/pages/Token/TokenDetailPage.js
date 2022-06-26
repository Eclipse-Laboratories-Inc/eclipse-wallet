import React, {useContext} from 'react';
import {AppContext} from '../../AppProvider';
import TextTitle from '../../component-library/Text/TextTitle';
import {useNavigation, withParams} from '../../routes/hooks';
import BackButtonPage from '../../component-library/Layout/BackButtonPage';
import {ROUTES_MAP} from '../../routes/app-routes';

const TokenDetailPage = ({params}) => {
  const navigate = useNavigation();
  const [] = useContext(AppContext);
  return (
    <BackButtonPage onBack={() => navigate(ROUTES_MAP.WALLET)}>
      <TextTitle>Token Detail {params.tokenId}</TextTitle>
    </BackButtonPage>
  );
};

export default withParams(TokenDetailPage);
