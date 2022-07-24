import React, { useState, useContext, useEffect } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalText from '../../component-library/Global/GlobalText';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { hiddenValue, showAmount } from '../../utils/amount';
import CardButton from '../../component-library/CardButton/CardButton';
import AvatarImage from '../../component-library/Image/AvatarImage';
import { withTranslation } from '../../hooks/useTranslations';

const TokenSelectPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setloaded] = useState(false);

  const [tokens, setTokens] = useState({});
  const [{ activeWallet, hiddenBalance }] = useContext(AppContext);

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
      ]).then(([balance]) => {
        setTokens(balance.items || []);
        setloaded(true);
      });
    }
  }, [activeWallet, params]);

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };
  const onSelect = token => {
    if (params.action === 'send') {
      navigate(ROUTES_MAP.TOKEN_SEND, { tokenId: token.address });
    } else if (params.action === 'receive') {
      navigate(ROUTES_MAP.TOKEN_RECEIVE, { tokenId: token.address });
    } else {
      navigate(ROUTES_MAP.TOKEN_DETAIL, { tokenId: token.address });
    }
  };

  return (
    loaded && (
      <GlobalLayoutForTabScreen>
        <GlobalBackTitle
          onBack={goToBack}
          inlineTitle={t(`token.action.${params.action || 'select'}`)}
          inlineAddress={params.tokenId}
        />

        <GlobalCollapse
          title="Tokens"
          viewAllAction={() => {}}
          hideCollapse
          isOpen>
          {tokens.map(token => (
            <CardButton
              key={token.mint}
              onPress={() => onSelect(token)}
              icon={<AvatarImage url={token.logo} size={48} />}
              title={token.name}
              actions={[
                <GlobalText key={'amount-action'} type="body2">
                  {hiddenBalance ? hiddenValue : showAmount(token.usdBalance)}
                </GlobalText>,
              ]}
            />
          ))}
        </GlobalCollapse>
      </GlobalLayoutForTabScreen>
    )
  );
};

export default withParams(withTranslation()(TokenSelectPage));
