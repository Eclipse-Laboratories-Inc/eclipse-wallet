import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getSwitches } from '4m-wallet-adapter';
import get from 'lodash/get';

import { AppContext } from '../../AppProvider';
import TokenList from '../../features/TokenList/TokenList';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from '../../pages/Token/routes';
import { getListedTokens, getNonListedTokens } from '../../utils/wallet';
import { cache, CACHE_TYPES, invalidate } from '../../utils/cache';
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
  const [loading, setLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState({});
  const [tokenList, setTokenList] = useState(null);
  const [nonListedTokenList, setNonListedTokenList] = useState(null);
  const [switches, setSwitches] = useState(null);

  useEffect(() => {
    getSwitches().then(allSwitches =>
      setSwitches(allSwitches[networkId].sections.overview),
    );
  }, [networkId]);

  const tokensAddresses = useMemo(
    () => Object.keys(activeTokens),
    [activeTokens],
  );

  useEffect(() => {
    setLoading(true);

    Promise.resolve(
      cache(
        `${networkId}-${activeBlockchainAccount.getReceiveAddress()}`,
        CACHE_TYPES.BALANCE,
        () => activeBlockchainAccount.getBalance(tokensAddresses),
      ),
    ).then(async balance => {
      setTotalBalance(balance);
      setTokenList(getListedTokens(balance));
      setNonListedTokenList(getNonListedTokens(balance, []));
      setLoading(false);
    });
  }, [activeBlockchainAccount, networkId, reload, tokensAddresses]);

  const onRefresh = () => {
    invalidate(CACHE_TYPES.BALANCE);
    invalidate(CACHE_TYPES.NFTS);
    setTotalBalance({});
    setTokenList(null);
    setReload(!reload);
  };

  const goToSend = () =>
    navigate(TOKEN_ROUTES_MAP.TOKEN_SELECT, {
      action: 'send',
    });

  const goToReceive = () => navigate(TOKEN_ROUTES_MAP.TOKEN_RECEIVE);

  const goToTokenDetail = tok => {
    if (tok.type !== 'native') {
      navigate(TOKEN_ROUTES_MAP.TOKEN_DETAIL, { tokenId: tok.address });
    }
  };

  return (
    <GlobalLayout onRefresh={onRefresh} refreshing={loading}>
      <GlobalLayout.Header>
        <Header />
        {totalBalance && (
          <WalletBalanceCard
            total={
              !hiddenBalance
                ? showAmount(totalBalance.usdTotal)
                : `$ ${hiddenValue}`
            }
            {...{
              [`${getLabelValue(
                get(totalBalance, 'last24HoursChange.perc', 0),
              )}Total`]: showPercentage(
                get(totalBalance, 'last24HoursChange.perc', 0),
              ),
            }}
            messages={[]}
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
        )}
        <GlobalPadding />

        <PendingTxs />

        <GlobalCollapse title={t('wallet.my_tokens')} isOpen>
          <TokenList
            tokens={tokenList}
            onDetail={goToTokenDetail}
            hiddenBalance={hiddenBalance}
          />
        </GlobalCollapse>

        {nonListedTokenList?.length ? (
          <GlobalCollapse title={t('wallet.non_listed_tokens')} isOpen>
            <TokenList
              tokens={nonListedTokenList}
              hiddenBalance={hiddenBalance}
            />
          </GlobalCollapse>
        ) : null}

        {switches?.features.nfts && (
          <>
            <GlobalPadding />
            <MyNfts whenLoading={setLoading} />
          </>
        )}
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(WalletOverviewPage);
