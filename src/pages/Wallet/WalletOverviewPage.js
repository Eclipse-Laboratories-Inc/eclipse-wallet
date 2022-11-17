import React, { useContext, useEffect, useState } from 'react';
import get from 'lodash/get';

import { AppContext } from '../../AppProvider';
import TokenList from '../../features/TokenList/TokenList';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from '../../pages/Token/routes';
import { ROUTES_MAP as WALLET_ROUTES_MAP } from '../../pages/Wallet/routes';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from '../../pages/Nfts/routes';
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
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import WalletBalanceCard from '../../component-library/Global/GlobalBalance';
import Header from '../../component-library/Layout/Header';
// import IconNotifications from '../../assets/images/IconNotifications.png';
// import IconNotificationsAdd from '../../assets/images/IconNotificationsAdd.png';
import { isMoreThanOne } from '../../utils/nfts';
// import IconNotifications from '../../assets/images/IconNotifications.png';
// import IconNotificationsAdd from '../../assets/images/IconNotificationsAdd.png';

const WalletOverviewPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeWallet, config, selectedEndpoints, hiddenBalance },
    { toggleHideBalance },
  ] = useContext(AppContext);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState({});
  const [tokenList, setTokenList] = useState(null);
  const [nftsList, setNftsList] = useState(null);
  const [nonListedTokenList, setNonListedTokenList] = useState(null);
  const [listedInfo, setListedInfo] = useState([]);

  //const [hasNotifications, setHasNotifications] = useState(false);
  useEffect(() => {
    if (activeWallet) {
      setLoading(true);
      Promise.resolve(
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
      ).then(async balance => {
        setTotalBalance(balance);
        setTokenList(getListedTokens(balance));
        setNonListedTokenList(getNonListedTokens(balance, []));
        setLoading(false);
      });
      Promise.resolve(
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.NFTS,
          () => activeWallet.getAllNftsGrouped(),
        ),
      ).then(async nfts => {
        setNftsList(nfts);
        setLoading(false);
        const listed = await activeWallet.getListedNfts();
        setListedInfo(listed);
      });
    }
  }, [activeWallet, selectedEndpoints, reload]);

  const onRefresh = () => {
    invalidate(CACHE_TYPES.BALANCE);
    invalidate(CACHE_TYPES.NFTS);
    setTotalBalance({});
    setTokenList(null);
    setNftsList(null);
    setReload(!reload);
  };

  const goToSend = () =>
    navigate(TOKEN_ROUTES_MAP.TOKEN_SELECT, {
      action: 'send',
    });

  const goToReceive = () => navigate(TOKEN_ROUTES_MAP.TOKEN_RECEIVE);

  const goToTokenDetail = tok =>
    navigate(TOKEN_ROUTES_MAP.TOKEN_DETAIL, {
      tokenId: tok.address,
    });

  // const goToNotifications = () => setHasNotifications(!hasNotifications);
  const handleNftsClick = nft => {
    if (isMoreThanOne(nft)) {
      navigate(NFTS_ROUTES_MAP.NFTS_COLLECTION, { id: nft.collection });
    } else {
      navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, {
        id: nft.mint || nft.items[0].mint,
      });
    }
  };
  const goToNFTs = tok =>
    navigate(WALLET_ROUTES_MAP.WALLET_NFTS, { tokenId: tok.address });

  return (
    activeWallet && (
      <GlobalLayout onRefresh={onRefresh} refreshing={loading}>
        <GlobalLayout.Header>
          <Header activeWallet={activeWallet} config={config} t={t} />
          {totalBalance && (
            <WalletBalanceCard
              total={
                !hiddenBalance
                  ? showAmount(totalBalance.usdTotal)
                  : `$ ${hiddenValue}`
              }
              {...{
                [`${getLabelValue(
                  get(totalBalance, 'last24HoursChage.perc', 0),
                )}Total`]: showPercentage(
                  get(totalBalance, 'last24HoursChage.perc', 0),
                ),
              }}
              messages={[]}
              showBalance={!hiddenBalance}
              onToggleShow={toggleHideBalance}
              actions={
                <GlobalSendReceive
                  goToSend={goToSend}
                  goToReceive={goToReceive}
                />
              }
            />
          )}
          <GlobalPadding />

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

          <GlobalPadding />

          <GlobalCollapse
            title={t('wallet.my_nfts')}
            viewAllAction={goToNFTs}
            isOpen>
            <GlobalNftList
              nonFungibleTokens={nftsList}
              listedInfo={listedInfo}
              onClick={handleNftsClick}
              t={t}
            />
          </GlobalCollapse>
        </GlobalLayout.Header>
      </GlobalLayout>
    )
  );
};

export default withTranslation()(WalletOverviewPage);
