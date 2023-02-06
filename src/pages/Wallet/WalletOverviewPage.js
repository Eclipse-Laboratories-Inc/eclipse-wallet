import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getSwitches } from '4m-wallet-adapter';
import get from 'lodash/get';

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

const WalletOverviewPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeBlockchainAccount, networkId, activeTokens, hiddenBalance },
    { toggleHideBalance },
  ] = useContext(AppContext);
  const [reload, setReload] = useState(false);
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const tokensAddresses = Object.keys(activeTokens);
        const balance = await activeBlockchainAccount.getBalance(
          tokensAddresses,
        );
        setTotalBalance(balance);
        setTokenList(getListedTokens(balance));
        setNonListedTokenList(getNonListedTokens(balance, []));
      } catch (e) {
        console.log(e); // TODO handle error
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeBlockchainAccount, networkId, reload, activeTokens]);

  const onRefresh = () => {
    invalidate(CACHE_TYPES.BALANCE);
    invalidate(CACHE_TYPES.NFTS);
    setReload(!reload);
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
          total={
            !hiddenBalance
              ? showAmount(totalBalance.usdTotal)
              : `$ ${hiddenValue}`
          }
          {...{ [`${getLabelValue(percent)}Total`]: showPercentage(percent) }}
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
        <GlobalPadding />
        <PendingTxs />
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
