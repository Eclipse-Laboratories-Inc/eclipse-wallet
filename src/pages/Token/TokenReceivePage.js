import React, { useState, useContext, useEffect } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { withTranslation } from '../../hooks/useTranslations';

const TokenReceivePage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setloaded] = useState(false);
  const [token, setToken] = useState({});

  const [{ activeWallet }] = useContext(AppContext);

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
      ]).then(([balance]) => {
        const tokenSelected = (balance.items || []).find(
          i => i.address === params.tokenId,
        );
        setToken(tokenSelected || {});
        setloaded(true);
      });
    }
  }, [activeWallet, params]);

  const goToBack = () => {
    navigate(ROUTES_MAP.WALLET);
  };

  return (
    loaded && (
      <GlobalLayoutForTabScreen>
        <GlobalBackTitle
          onBack={goToBack}
          inlineTitle={t('token.receive.title')}
          inlineAddress={params.tokenId}
        />
      </GlobalLayoutForTabScreen>
    )
  );
};

export default withParams(withTranslation()(TokenReceivePage));
