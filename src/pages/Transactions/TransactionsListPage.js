import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

import { cache, CACHE_TYPES, invalidate } from '../../utils/cache';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalButton from '../../component-library/Global/GlobalButton';
import CardButtonTransaction from '../../component-library/CardButton/CardButtonTransaction';
import Header from '../../component-library/Layout/Header';
import theme from '../../component-library/Global/theme';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { SECTIONS_MAP } from '../../utils/tracking';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

const styles = StyleSheet.create({
  titleStyle: {
    marginTop: theme.gutters.paddingNormal,
    marginLeft: theme.gutters.paddingSM,
    marginRight: theme.gutters.paddingSM,
  },
  dateStyle: {
    lineHeight: theme.gutters.padding3XL,
  },
  dateStyleFirst: {
    marginBottom: theme.gutters.paddingSM,
  },
  emptyStyle: {
    marginTop: 10,
  },
});

const TransactionsListPage = ({ t }) => {
  const pageSize = 8;

  const navigate = useNavigation();
  const onDetail = id => navigate(ROUTES_MAP.TRANSACTIONS_DETAIL, { id });

  const [{ activeBlockchainAccount }] = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);
  const [paging, setPaging] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useAnalyticsEventTracker(SECTIONS_MAP.TRANSACTIONS_LIST);

  useEffect(() => {
    activeBlockchainAccount
      .getRecentTransactions({ pageSize })
      .then(({ data, meta }) => {
        setTransactions(data);
        setPaging(meta);
      })
      .finally(() => setLoaded(true));
  }, [activeBlockchainAccount]);

  const onLoadMore = useCallback(() => {
    setLoading(true);

    const cacheKey = `${
      activeBlockchainAccount.network.id
    }-${activeBlockchainAccount.getReceiveAddress()}`;
    activeBlockchainAccount.base
      .getRecentTransactions({ ...paging, pageSize })
      .then(({ data, meta }) => {
        invalidate(CACHE_TYPES.TRANSACTIONS);
        cache(cacheKey, CACHE_TYPES.TRANSACTIONS, () => ({
          data: transactions.concat(data),
          meta,
        }));
        setPaging(meta);
        setTransactions(transactions.concat(data));
      })
      .finally(() => setLoading(false));
  }, [activeBlockchainAccount, transactions, paging]);

  const showDate = (recTrans, i) => {
    let lastTransDate;
    i === 0
      ? (lastTransDate = null)
      : (lastTransDate = moment
          .unix(recTrans[i - 1].timestamp)
          .format('MMM D, YYYY'));
    const thisTransDate = moment
      .unix(recTrans[i].timestamp)
      .format('MMM D, YYYY');
    const yesterday = moment().subtract(1, 'days').format('MMM D, YYYY');
    const today = moment().format('MMM D, YYYY');
    if (thisTransDate !== lastTransDate) {
      return thisTransDate === today
        ? t('transactions.today')
        : thisTransDate === yesterday
        ? t('transactions.yesterday')
        : thisTransDate;
    } else {
      return null;
    }
  };

  return (
    <>
      <View style={styles.titleStyle}>
        <Header />
        <GlobalBackTitle title={t('transactions.your_transactions')} />
      </View>
      <GlobalLayout>
        <GlobalLayout.Header>
          <View>
            {!loaded && <GlobalSkeleton type="ActivityList" />}
            {loaded &&
              transactions.length > 0 &&
              transactions.map((transaction, i) => (
                <View key={`transaction-${i}`}>
                  <GlobalText
                    type="body2"
                    color="secondary"
                    style={i === 0 ? styles.dateStyleFirst : styles.dateStyle}>
                    {showDate(transactions, i)}
                  </GlobalText>
                  <CardButtonTransaction
                    transaction={transaction}
                    onPress={() => onDetail(transaction.id)}
                  />
                </View>
              ))}
            {loaded && transactions.length === 0 && (
              <GlobalText
                type="body2"
                color="primary"
                numberOfLines={1}
                center="true"
                style={styles.emptyStyle}>
                {t('transactions.empty')}
              </GlobalText>
            )}
            {loaded && loading && <GlobalSkeleton type="ActivityList" />}
            {loaded && !loading && !isEmpty(paging) && (
              <GlobalButton
                type="text"
                title="Load more"
                onPress={onLoadMore}
              />
            )}
          </View>
        </GlobalLayout.Header>
      </GlobalLayout>
    </>
  );
};

export default withTranslation()(TransactionsListPage);
