import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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

import theme from '../../component-library/Global/theme';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import TransactionsListComponent from '../Transactions/TransactionsListComponent';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSendReceive from '../../component-library/Global/GlobalSendReceive';
import GlobalText from '../../component-library/Global/GlobalText';
import WalletBalanceCard from '../../component-library/Global/GlobalBalance';

const styles = StyleSheet.create({
  cardBox: {
    paddingVertical: theme.gutters.paddingSM,
    paddingHorizontal: theme.gutters.paddingSM,
    borderRadius: theme.borderRadius.borderRadiusMD,
    backgroundColor: theme.colors.cards,
  },
});

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
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.TRANSACTIONS,
          () => activeWallet.getRecentTransactions(),
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

          <View style={styles.cardBox}>
            <GlobalCollapse title="Chart Data Range" narrowTitle isOpen={false}>
              <GlobalPadding />
              {/* <GlobalChart /> */}
              <GlobalText type="body2">[CHART GOES HERE]</GlobalText>
              <GlobalPadding />
            </GlobalCollapse>
          </View>

          <GlobalPadding size="lg" />

          <TransactionsListComponent t={t} />
        </GlobalLayout.Header>
      )}
      {!loaded && <GlobalSkeleton type="TokenDetail" />}
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(TokenDetailPage));
