import React from 'react';
import { StyleSheet } from 'react-native';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalTransaction from '../../component-library/Global/GlobalTransaction';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalText from '../../component-library/Global/GlobalText';

const styles = StyleSheet.create({
  titleStyle: {
    lineHeight: theme.gutters.padding3XL,
  },
});

const TransactionsPage = () => (
  <GlobalLayoutForTabScreen>
    <GlobalText type="headline2" center>
      Your Transactions
    </GlobalText>

    <GlobalCollapse
      title="Recent Activity"
      titleStyle={styles.titleStyle}
      hideCollapse
      isOpen>
      <GlobalTransaction
        transaction="sent"
        address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
        amount="+1 SOL"
        percentage="+0000%"
        onPress={() => {}}
      />

      <GlobalTransaction
        transaction="received"
        address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
        amount="+2 SOL"
        percentage="+0000%"
        onPress={() => {}}
      />

      <GlobalTransaction
        transaction="swap"
        address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
        amount="+3 SOL"
        percentage="+0000%"
        onPress={() => {}}
      />

      <GlobalTransaction
        transaction="interaction"
        address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
        amount="+4 SOL"
        percentage="+0000%"
        onPress={() => {}}
      />

      <GlobalTransaction
        transaction="paid"
        address="AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S"
        amount="+5 SOL"
        percentage="+0000%"
        onPress={() => {}}
      />
    </GlobalCollapse>
  </GlobalLayoutForTabScreen>
);

export default TransactionsPage;
