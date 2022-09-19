import React, { useState, useContext, useEffect } from 'react';
import get from 'lodash/get';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
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
  const [{ activeWallet, hiddenBalance }, { toggleHideBalance }] =
    useContext(AppContext);

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
      ]).then(([balance]) => {
        const tk = (balance.items || []).find(
          i => i.address === params.tokenId,
        );
        setToken(tk || {});
        setloaded(true);
      });
    }
  }, [activeWallet, params]);

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };

  const goToSend = () =>
    navigate(ROUTES_MAP.TOKEN_SEND, { tokenId: params.tokenId });

  const goToReceive = () => navigate(ROUTES_MAP.TOKEN_RECEIVE);

  return (
    <GlobalLayout fullscreen>
      {!loaded && <GlobalSkeleton type="TokenDetail" />}
      {loaded && (
        <GlobalLayout.Header>
          <GlobalBackTitle
            onBack={goToBack}
            inlineTitle={token.name}
            inlineAddress={params.tokenId}
          />

          <WalletBalanceCard
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
                !hiddenBalance
                  ? showAmount(token.usdBalance)
                  : `$ ${hiddenValue}`
              } ${showPercentage(get(token, 'last24HoursChange.perc', 0))}`,
            }}
            showBalance={!hiddenBalance}
            onToggleShow={toggleHideBalance}
            messages={[]}
            actions={
              <GlobalSendReceive
                goToSend={goToSend}
                goToReceive={goToReceive}
              />
            }
          />

          <GlobalPadding size="lg" />
        </GlobalLayout.Header>
      )}
      <TransactionsListComponent t={t} />
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(TokenDetailPage));
