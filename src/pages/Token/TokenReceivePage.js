import React, { useState, useContext, useEffect } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { withTranslation } from '../../hooks/useTranslations';
import QRImage from '../../features/QRImage';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import { getShortAddress } from '../../utils/wallet';
import clipboard from '../../utils/clipboard';

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

  const onCopy = () => clipboard.copy(token.address);

  return (
    loaded && (
      <GlobalLayoutForTabScreen>
        <GlobalBackTitle
          onBack={goToBack}
          inlineTitle={t('token.receive.title')}
        />
        <QRImage address={token.address} />
        <GlobalText type="body1" center>
          {token.name} ({getShortAddress(token.address)})
        </GlobalText>
        <GlobalButton
          type="primary"
          wide
          title={t('general.copy')}
          onPress={onCopy}
        />
        <GlobalButton
          type="primary"
          wide
          title={t('general.close')}
          onPress={goToBack}
        />
      </GlobalLayoutForTabScreen>
    )
  );
};

export default withParams(withTranslation()(TokenReceivePage));
