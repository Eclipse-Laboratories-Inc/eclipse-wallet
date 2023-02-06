import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import CardButtonTransaction from '../../component-library/CardButton/CardButtonTransaction';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import theme from '../../component-library/Global/theme';
import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

const styles = StyleSheet.create({
  titleStyle: {
    lineHeight: theme.gutters.padding3XL,
  },
});

const TransactionsListComponent = ({ t }) => {
  const pageSize = 8;

  const navigate = useNavigation();
  const onDetail = id => navigate(ROUTES_MAP.TRANSACTIONS_DETAIL, { id });
  const onViewAll = () => navigate(ROUTES_MAP.TRANSACTIONS_LIST);

  const [{ activeBlockchainAccount }] = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoaded(false);
        const { data } = await activeBlockchainAccount.getRecentTransactions({
          pageSize,
        });
        setTransactions(data);
      } finally {
        setLoaded(true);
      }
    };

    load();
  }, [activeBlockchainAccount]);

  return (
    <GlobalCollapse
      title={t('transactions.recent_activity')}
      viewAllAction={onViewAll}
      titleStyle={styles.titleStyle}
      hideCollapse
      isOpen>
      {!loaded && <GlobalSkeleton type="ActivityList" />}
      {loaded &&
        transactions.map((transaction, i) => (
          <CardButtonTransaction
            key={`transaction-${i}`}
            transaction={transaction}
            onPress={() => onDetail(transaction.id)}
          />
        ))}
    </GlobalCollapse>
  );
};

export default TransactionsListComponent;
