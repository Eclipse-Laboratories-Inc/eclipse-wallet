import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import get from 'lodash/get';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';
import { ROUTES_MAP as TRANSACTIONS_ROUTES_MAP } from '../Transactions/routes';
import { cache, CACHE_TYPES } from '../../utils/cache';
import {
  hiddenValue,
  showAmount,
  getLabelValue,
  showPercentage,
  showValue,
} from '../../utils/amount';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import CardButtonTransaction from '../../component-library/CardButton/CardButtonTransaction';
import GlobalChart from '../../component-library/Global/GlobalChart';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSendReceive from '../../component-library/Global/GlobalSendReceive';
import GlobalText from '../../component-library/Global/GlobalText';
import WalletBalanceCard from '../../component-library/Global/GlobalBalance';

const styles = StyleSheet.create({
  container: {
    padding: theme.gutters.paddingMD,
  },
  cardBox: {
    paddingVertical: theme.gutters.paddingSM,
    paddingHorizontal: theme.gutters.paddingSM,
    borderRadius: theme.borderRadius.borderRadiusMD,
    backgroundColor: theme.colors.cards,
  },
});

const TokenDetailPage = ({ params }) => {
  const navigate = useNavigation();
  const onDetail = id =>
    navigate(TRANSACTIONS_ROUTES_MAP.TRANSACTIONS_DETAIL, { id });

  const [loaded, setloaded] = useState(false);

  const [token, setToken] = useState({});
  const [transactions, setTransactions] = useState([]);
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
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.TRANSACTIONS,
          () => activeWallet.getRecentTransactions(),
        ),
      ]).then(([balance, recentTransactions]) => {
        const t = (balance.items || []).find(i => i.address === params.tokenId);
        setToken(t || {});
        setTransactions(recentTransactions || []);
        setloaded(true);
      });
    }
  }, [activeWallet, params]);

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };

  const goToSend = () =>
    navigate(ROUTES_MAP.TOKEN_SEND, { tokenId: params.tokenId });

  const goToReceive = () =>
    navigate(ROUTES_MAP.TOKEN_RECEIVE, { tokenId: params.tokenId });

  return (
    loaded && (
      <GlobalLayoutForTabScreen>
        <GlobalBackTitle
          onBack={goToBack}
          inlineTitle={token.name}
          inlineAddress={params.tokenId}
        />

        <WalletBalanceCard
          total={
            !hiddenBalance
              ? `${showValue(token.uiAmount)} ${token.symbol}`
              : `${hiddenValue} ${token.symbol}`
          }
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
            <GlobalSendReceive goToSend={goToSend} goToReceive={goToReceive} />
          }
        />

        <GlobalPadding size="lg" />

        <View style={styles.cardBox}>
          <GlobalCollapse title="Chart Data Range" narrowTitle isOpen={false}>
            <GlobalPadding />
            {/* <GlobalChart /> */}
            <GlobalText type="body2">[CHART GOES HERE]</GlobalText>
            <GlobalPadding />
          </GlobalCollapse>
        </View>

        <GlobalPadding size="lg" />

        <GlobalCollapse
          title="Recent Activity"
          viewAllAction={() => {}}
          hideCollapse
          isOpen>
          {transactions.map(transaction => {
            console.log(transaction);
            return (
              <CardButtonTransaction
                key={transaction.signature}
                transaction="sent"
                address={
                  transaction.destination ? transaction.destination : '----'
                }
                amount={transaction.amount ? transaction.amount : '+1 SOL'}
                percentage="+0000%"
                onPress={() => onDetail(transaction.signature)}
              />
            );
          })}
        </GlobalCollapse>
      </GlobalLayoutForTabScreen>
    )
  );
};

export default withParams(TokenDetailPage);
