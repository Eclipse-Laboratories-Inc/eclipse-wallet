import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getSwitches } from 'eclipse-wallet-adapter';
import { get, isNil } from 'lodash';

import { AppContext } from '../../AppProvider';
import TokenList from '../../features/TokenList/TokenList';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from '../../pages/Token/routes';
import { ROUTES_MAP as WALLET_ROUTES_MAP } from './routes';
import {
  mergeImportedTokens,
  getListedTokens,
  getNonListedTokens,
} from '../../utils/wallet';
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
import ImportTokenModal from './components/ImportTokenModal';

const WalletOverviewPage = ({ cfgs, t }) => {
  const navigate = useNavigation();
  const [
    { activeBlockchainAccount, networkId, activeTokens, hiddenBalance },
    { toggleHideBalance, importTokens },
  ] = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState({});
  const [tokenList, setTokenList] = useState([]);
  const [nonListedTokenList, setNonListedTokenList] = useState([]);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [error, setError] = useState(null);
  const [switches, setSwitches] = useState(null);
  const allowsImported = switches?.features.import_tokens;

  useEffect(() => {
    const loadSwitches = async () => {
      try {
        const allSwitches = await getSwitches();
        setSwitches(allSwitches[networkId].sections.overview);
      } catch (e) {
        console.log(e);
        setError(e);
      }
    };

    loadSwitches();
  }, [networkId]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tokensAddresses = Object.keys(activeTokens);
      const balance = await activeBlockchainAccount.getBalance(tokensAddresses);
      setTotalBalance(balance);
      setTokenList(
        allowsImported
          ? mergeImportedTokens(balance.items, activeTokens)
          : getListedTokens(balance),
      );
      allowsImported &&
        setAvailableTokens(await activeBlockchainAccount.getAvailableTokens());
      setNonListedTokenList(getNonListedTokens(balance, []));
    } catch (e) {
      console.log(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [activeBlockchainAccount, activeTokens, allowsImported]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    invalidate(CACHE_TYPES.BALANCE);
    invalidate(CACHE_TYPES.NFTS);
    await load();
  }, [load]);

  const goToSend = () => {
    navigate(TOKEN_ROUTES_MAP.TOKEN_SELECT, { action: 'send' });
  };

  const goToReceive = () => navigate(TOKEN_ROUTES_MAP.TOKEN_RECEIVE);

  const goToTokenDetail = ({ address }) => {
    navigate(TOKEN_ROUTES_MAP.TOKEN_DETAIL, { tokenId: address });
  };

  const onImport = async token => {
    await importTokens(networkId, [{ imported: true, ...token }]);
    onRefresh();
  };

  const total = useMemo(
    () =>
      hiddenBalance ? `$ ${hiddenValue}` : showAmount(totalBalance.usdTotal),
    [totalBalance, hiddenBalance],
  );

  const percent = useMemo(
    () => get(totalBalance, 'last24HoursChange.perc', 0),
    [totalBalance],
  );

  const alert = useMemo(() => {
    if (error) {
      return {
        text: t('wallet.load_error'),
        type: 'error',
        onPress: onRefresh,
      };
    }
    if (isNil(totalBalance?.usdTotal)) {
      return {
        text: t('wallet.prices_issue'),
        type: 'warning',
        onPress: onRefresh,
      };
    }
    return null;
  }, [error, totalBalance, onRefresh, t]);

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
          alert={alert}
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

        {!error && (
          <GlobalCollapse title={t('wallet.my_tokens')} isOpen>
            <TokenList
              loading={loading}
              tokens={tokenList}
              onDetail={goToTokenDetail}
              hiddenBalance={hiddenBalance}
            />
          </GlobalCollapse>
        )}
        {!error && (loading || nonListedTokenList?.length) ? (
          <GlobalCollapse title={t('wallet.non_listed_tokens')} isOpen>
            <TokenList
              loading={loading}
              tokens={nonListedTokenList}
              hiddenBalance={hiddenBalance}
            />
          </GlobalCollapse>
        ) : null}
        {allowsImported && (
          <ImportTokenModal tokens={availableTokens} onChange={onImport} />
        )}
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
