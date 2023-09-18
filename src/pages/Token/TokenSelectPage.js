import React, { useState, useContext, useMemo, useEffect } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from './routes';
import { hiddenValue, showAmount } from '../../utils/amount';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';
import GlobalBackgroundImage from '../../component-library/Global/GlobalBackgroundImage';

const MAX_PAG = 20;

const TokenSelectPage = ({ params, t }) => {
  useAnalyticsEventTracker(SECTIONS_MAP.SEND_SELECT_TOKEN);
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);

  const [tokens, setTokens] = useState({});
  const [{ activeBlockchainAccount, hiddenBalance, activeTokens }] =
    useContext(AppContext);

  const [searchToken, setSearchToken] = useState('');
  const [drawedList, setDrawedList] = useState([]);

  const getFilterItems = (items, search) =>
    search.length >= 3
      ? items.filter(
          token =>
            (token.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (token.symbol || '').toLowerCase().includes(search.toLowerCase()),
        )
      : items;

  const filteredTokens = useMemo(
    () => getFilterItems(tokens, searchToken),
    [tokens, searchToken],
  );

  useEffect(() => {
    if (filteredTokens.length === 1) {
      onSelect(filteredTokens[0]);
    } else if (filteredTokens.length > MAX_PAG) {
      setDrawedList(filteredTokens.slice(0, MAX_PAG));
    } else {
      setDrawedList(filteredTokens);
    }
  }, [filteredTokens]);

  const tokensAddresses = useMemo(
    () => Object.keys(activeTokens),
    [activeTokens],
  );

  useEffect(() => {
    if (activeBlockchainAccount) {
      activeBlockchainAccount.getBalance(tokensAddresses).then(balance => {
        setTokens(balance.items || []);
        setLoaded(true);
      });
    }
  }, [activeBlockchainAccount, params, tokensAddresses]);

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };

  const onSelect = token => {
    if (params.action === 'send') {
      navigate(TOKEN_ROUTES_MAP.TOKEN_SEND, { tokenId: token.address });
    } else if (params.action === 'sendTo') {
      navigate(TOKEN_ROUTES_MAP.TOKEN_SEND_TO, {
        tokenId: token.address,
        toAddress: params.toAddress,
      });
    } else if (params.action === 'receive') {
      navigate(TOKEN_ROUTES_MAP.TOKEN_RECEIVE, { tokenId: token.address });
    } else {
      navigate(TOKEN_ROUTES_MAP.TOKEN_DETAIL, { tokenId: token.address });
    }
  };

  const goToAddToken = () => {
    navigate(TOKEN_ROUTES_MAP.TOKEN_ADD, {
      action: params.action,
      walletAddress: activeBlockchainAccount.getReceiveAddress(),
    });
  };

  return loaded ? (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={goToBack}
          secondaryTitle={t(`token.action.${params.action || 'select'}`)}
        />
        <GlobalInput
          forSearch
          placeholder={t('actions.search_placeholder')}
          value={searchToken}
          setValue={setSearchToken}
        />

        <GlobalPadding />
        {drawedList && drawedList.length > 0 && (
          <GlobalCollapse title={t('wallet.select_token')} isOpen hideCollapse>
            {drawedList.map(token => (
              <CardButton
                key={token.mint || token.address}
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
        )}
      </GlobalLayout.Header>
    </GlobalLayout>
  ) : (
    <GlobalBackgroundImage>
      <GlobalSkeleton type="TokenListSend" />
    </GlobalBackgroundImage>
  );
};

export default withParams(withTranslation()(TokenSelectPage));
