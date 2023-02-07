import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getSwitches } from '4m-wallet-adapter';
import { get, isNil } from 'lodash';

import { AppContext } from '../../AppProvider';
import TokenList from '../../features/TokenList/TokenList';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from '../../pages/Token/routes';
import { getListedTokens, getNonListedTokens } from '../../utils/wallet';
import { CACHE_TYPES, invalidate } from '../../utils/cache';
import {
  hiddenValue,
  getLabelValue,
  showAmount,
  showPercentage,
} from '../../utils/amount';
import { withTranslation } from '../../hooks/useTranslations';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSendReceive from '../../component-library/Global/GlobalSendReceive';
import WalletBalanceCard from '../../component-library/Global/GlobalBalance';
import Header from '../../component-library/Layout/Header';
import MyNfts from './components/MyNfts';
import PendingTxs from './components/PendingTxs';
import PendingBridgeTxs from './components/PendingBridgeTxs';

const WalletOverviewPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeBlockchainAccount, networkId, activeTokens, hiddenBalance },
    { toggleHideBalance },
  ] = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState({});
  const [tokenList, setTokenList] = useState([]);
  const [nonListedTokenList, setNonListedTokenList] = useState([]);
  const [switches, setSwitches] = useState(null);

  useEffect(() => {
    getSwitches().then(allSwitches =>
      setSwitches(allSwitches[networkId].sections.overview),
    );
  }, [networkId]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const tokensAddresses = Object.keys(activeTokens);
      const balance = await activeBlockchainAccount.getBalance(tokensAddresses);
      setTotalBalance(balance);
      setTokenList(getListedTokens(balance));
      setNonListedTokenList(getNonListedTokens(balance, []));
    } catch (e) {
      console.log(e); // TODO handle error
    } finally {
      setLoading(false);
    }
  }, [activeBlockchainAccount, activeTokens]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    invalidate(CACHE_TYPES.BALANCE);
    invalidate(CACHE_TYPES.NFTS);
    await load();
  };

  const goToSend = () => {
    navigate(TOKEN_ROUTES_MAP.TOKEN_SELECT, { action: 'send' });
  };

  const goToReceive = () => navigate(TOKEN_ROUTES_MAP.TOKEN_RECEIVE);

  const goToTokenDetail = ({ type, address }) => {
    if (type !== 'native') {
      navigate(TOKEN_ROUTES_MAP.TOKEN_DETAIL, { tokenId: address });
    }
  };

  const total = useMemo(() => {
    if (isNil(totalBalance?.usdTotal)) {
      return null;
    }
    if (hiddenBalance) {
      return `$ ${hiddenValue}`;
    }
    return showAmount(totalBalance.usdTotal);
  }, [totalBalance, hiddenBalance]);

  const percent = useMemo(
    () => get(totalBalance, 'last24HoursChange.perc', 0),
    [totalBalance],
  );

  return (
    <GlobalLayout onRefresh={onRefresh} refreshing={loading}>
      <GlobalLayout.Header>
        <Header isHome />
        <WalletBalanceCard
          loading={loading}
          total={total}
          {...{ [`${getLabelValue(percent)}Total`]: showPercentage(percent) }}
          showBalance={!hiddenBalance}
          onToggleShow={toggleHideBalance}
          onRefresh={onRefresh}
          actions={
            <GlobalSendReceive
              goToSend={goToSend}
              goToReceive={goToReceive}
              canSend={switches?.features?.send}
              canReceive={switches?.features?.receive}
            />
          }
        />
        <GlobalPadding />
        <PendingTxs />
        <PendingBridgeTxs />

        <GlobalCollapse title={t('wallet.my_tokens')} isOpen>
          <TokenList
            loading={loading}
            tokens={tokenList}
            onDetail={goToTokenDetail}
            hiddenBalance={hiddenBalance}
          />
        </GlobalCollapse>
        {loading || nonListedTokenList?.length ? (
          <GlobalCollapse title={t('wallet.non_listed_tokens')} isOpen>
            <TokenList
              loading={loading}
              tokens={nonListedTokenList}
              hiddenBalance={hiddenBalance}
            />
          </GlobalCollapse>
        ) : null}
        {switches?.features.nfts && (
          <>
            <GlobalPadding />
            <MyNfts />
          </>
        )}
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(WalletOverviewPage);
