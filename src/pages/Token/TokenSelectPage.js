import React, { useState, useContext, useEffect } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from './routes';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { hiddenValue, showAmount } from '../../utils/amount';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import CardButton from '../../component-library/CardButton/CardButton';

const TokenSelectPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setloaded] = useState(false);

  const [tokens, setTokens] = useState({});
  const [{ activeWallet, hiddenBalance }] = useContext(AppContext);

  const [searchToken, setSearchToken] = useState('');

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
      navigate(TOKEN_ROUTES_MAP.TOKEN_SEND, { tokenId: token.address });
    } else if (params.action === 'receive') {
      navigate(TOKEN_ROUTES_MAP.TOKEN_RECEIVE, { tokenId: token.address });
    } else {
      navigate(TOKEN_ROUTES_MAP.TOKEN_DETAIL, { tokenId: token.address });
    }
  };

  const goToAddToken = token => {
    navigate(TOKEN_ROUTES_MAP.TOKEN_ADD, {
      action: params.action,
      walletAddress: activeWallet.getReceiveAddress(),
    });
  };

  return (
    loaded && (
      <GlobalLayout fullscreen>
        <GlobalLayout.Header>
          <GlobalBackTitle
            onBack={goToBack}
            secondaryTitle={t(`token.action.${params.action || 'select'}`)}
          />

          <GlobalInput
            forSearch
            placeholder="Search..."
            value={searchToken}
            setValue={setSearchToken}
          />

          <GlobalPadding />

          <GlobalCollapse
            title="Select Token"
            isOpen
            actionTitle="Add New Token"
            viewAllAction={goToAddToken}
            hideCollapse>
            {tokens.map(token => (
              <CardButton
                key={token.mint}
                onPress={() => onSelect(token)}
                icon={<GlobalImage url={token.logo} size="md" circle />}
                title={token.name}
                actions={[
                  <GlobalText key={'amount-action'} type="body2">
                    {hiddenBalance ? hiddenValue : showAmount(token.usdBalance)}
                  </GlobalText>,
                ]}
              />
            ))}
          </GlobalCollapse>
        </GlobalLayout.Header>
      </GlobalLayout>
    )
  );
};

export default withParams(withTranslation()(TokenSelectPage));
