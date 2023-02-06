import React, { useState, useContext, useEffect, useMemo } from 'react';
import { getSwitches } from '4m-wallet-adapter';
import get from 'lodash/get';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import {
  hiddenValue,
  showAmount,
  getLabelValue,
  showPercentage,
  showValue,
} from '../../utils/amount';

import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import TransactionsListComponent from '../Transactions/TransactionsListComponent';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSendReceive from '../../component-library/Global/GlobalSendReceive';
import WalletBalanceCard from '../../component-library/Global/GlobalBalance';

const TokenDetailPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setloaded] = useState(false);
  const [token, setToken] = useState({});
  const [
    { activeBlockchainAccount, hiddenBalance, activeTokens },
    { toggleHideBalance },
  ] = useContext(AppContext);

  const [switches, setSwitches] = useState(null);

  useEffect(() => {
    getSwitches().then(allSwitches =>
      setSwitches(
        allSwitches[activeBlockchainAccount.network.id].sections.token_detail,
      ),
    );
  });

  const tokensAddresses = useMemo(
    () => Object.keys(activeTokens),
    [activeTokens],
  );

  useEffect(() => {
    if (activeBlockchainAccount) {
      activeBlockchainAccount.getBalance(tokensAddresses).then(balance => {
        const tk = (balance.items || []).find(
          i => i.address === params.tokenId,
        );
        setToken(tk || {});
        setloaded(true);
      });
    }
  }, [activeBlockchainAccount, params, tokensAddresses]);

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };

  const goToSend = () =>
    navigate(ROUTES_MAP.TOKEN_SEND, { tokenId: params.tokenId });

  const goToReceive = () => navigate(ROUTES_MAP.TOKEN_RECEIVE);

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={goToBack}
          inlineTitle={token.name}
          inlineAddress={params.tokenId}
        />

        <WalletBalanceCard
          loading={!loaded}
          total={
            !hiddenBalance
              ? `${showValue(token.uiAmount, 6)} ${token.symbol}`
              : `${hiddenValue} ${token.symbol}`
          }
          totalType="headline2"
          {...{
            [`${getLabelValue(
              get(token, 'last24HoursChange.perc', 0),
            )}Total`]: `${
              !hiddenBalance ? showAmount(token.usdBalance) : `$ ${hiddenValue}`
            } ${showPercentage(get(token, 'last24HoursChange.perc', 0))}`,
          }}
          showBalance={!hiddenBalance}
          onToggleShow={toggleHideBalance}
          messages={[]}
          actions={
            <GlobalSendReceive
              goToSend={goToSend}
              goToReceive={goToReceive}
              canSend={switches?.features?.send}
              canReceive={switches?.features?.receive}
            />
          }
        />
        <GlobalPadding size="lg" />
        <TransactionsListComponent t={t} />
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(TokenDetailPage));
