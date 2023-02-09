import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { getSwitches } from '4m-wallet-adapter';
import { get } from 'lodash';

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

import TransactionsListComponent from '../Transactions/TransactionsListComponent';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSendReceive from '../../component-library/Global/GlobalSendReceive';
import WalletBalanceCard from '../../component-library/Global/GlobalBalance';

const TokenDetailPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loading, setloading] = useState(true);
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

  const load = useCallback(async () => {
    try {
      setloading(true);
      const balance = await activeBlockchainAccount.getBalance(tokensAddresses);
      setToken(balance?.items?.find(i => i.address === params.tokenId) || {});
    } finally {
      setloading(false);
    }
  }, [activeBlockchainAccount, params.tokenId, tokensAddresses]);

  useEffect(() => {
    load();
  }, [load]);

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };

  const goToSend = () =>
    navigate(ROUTES_MAP.TOKEN_SEND, { tokenId: params.tokenId });

  const goToReceive = () => navigate(ROUTES_MAP.TOKEN_RECEIVE);

  const total = useMemo(
    () =>
      hiddenBalance
        ? `${hiddenValue} ${token.symbol}`
        : `${showValue(token.uiAmount, 6)} ${token.symbol}`,
    [token, hiddenBalance],
  );

  const percent = useMemo(
    () => get(token, 'last24HoursChange.perc', 0),
    [token],
  );

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={goToBack}
          inlineTitle={token.name}
          inlineAddress={params.tokenId}
        />

        <WalletBalanceCard
          loading={loading}
          total={total}
          totalType="headline2"
          {...{
            [`${getLabelValue(percent)}Total`]: token.usdBalance
              ? `${
                  !hiddenBalance
                    ? showAmount(token.usdBalance)
                    : `$ ${hiddenValue}`
                } ${showPercentage(percent)}`
              : undefined,
          }}
          showBalance={!hiddenBalance}
          onToggleShow={toggleHideBalance}
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
