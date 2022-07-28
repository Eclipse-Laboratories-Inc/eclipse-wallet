import React from 'react';
import { StyleSheet } from 'react-native';

import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';

import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButtonTransaction from '../../component-library/CardButton/CardButtonTransaction';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';

const styles = StyleSheet.create({
  titleStyle: {
    lineHeight: theme.gutters.padding3XL,
  },
});

const TransactionsListPage = () => {
  const navigate = useNavigation();
  const onDetail = id => navigate(ROUTES_MAP.TRANSACTIONS_DETAIL, { id });

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle title="Your Transactions" />

        <GlobalCollapse
          title="Recent Activity"
          titleStyle={styles.titleStyle}
          hideCollapse
          isOpen>
          <CardButtonTransaction
            transaction="sent"
            address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
            amount="+1 SOL"
            percentage="+0000%"
            onPress={() => onDetail(1)}
          />

          <CardButtonTransaction
            transaction="received"
            address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
            amount="+2 SOL"
            percentage="+0000%"
            onPress={() => onDetail(1)}
          />

          <CardButtonTransaction
            transaction="swap"
            address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
            amount="+3 SOL"
            percentage="+0000%"
            onPress={() => onDetail(1)}
          />

          <CardButtonTransaction
            transaction="interaction"
            address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
            amount="+4 SOL"
            percentage="+0000%"
            onPress={() => onDetail(1)}
          />

          <CardButtonTransaction
            transaction="paid"
            address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
            amount="+5 SOL"
            percentage="+0000%"
            onPress={() => onDetail(1)}
          />
        </GlobalCollapse>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default TransactionsListPage;
