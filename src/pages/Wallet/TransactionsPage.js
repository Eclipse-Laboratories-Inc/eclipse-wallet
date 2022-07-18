import React from 'react';
import { StyleSheet } from 'react-native';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalText from '../../component-library/Global/GlobalText';

import { getShortAddress } from '../../utils/wallet';

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
      <GlobalButtonCard
        transaction="sent"
        description={`To: ${getShortAddress(
          'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
        )}`}
        actions={[
          <GlobalText key={'amount-action'} type="body2" color="positive">
            +1 SOL
          </GlobalText>,
          <GlobalText key={'perc-action'} type="caption" color="secondary">
            +0000%
          </GlobalText>,
        ].filter(Boolean)}
        onPress={() => {}}
      />

      <GlobalButtonCard
        transaction="received"
        description={`To: ${getShortAddress(
          'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
        )}`}
        actions={[
          <GlobalText key={'amount-action'} type="body2" color="positive">
            +1 SOL
          </GlobalText>,
          <GlobalText key={'perc-action'} type="caption" color="secondary">
            +0000%
          </GlobalText>,
        ].filter(Boolean)}
        onPress={() => {}}
      />

      <GlobalButtonCard
        transaction="swap"
        description={`To: ${getShortAddress(
          'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
        )}`}
        actions={[
          <GlobalText key={'amount-action'} type="body2" color="positive">
            +1 SOL
          </GlobalText>,
          <GlobalText key={'perc-action'} type="caption" color="secondary">
            +0000%
          </GlobalText>,
        ].filter(Boolean)}
        onPress={() => {}}
      />

      <GlobalButtonCard
        transaction="interaction"
        description={`To: ${getShortAddress(
          'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
        )}`}
        actions={[
          <GlobalText key={'amount-action'} type="body2" color="positive">
            +1 SOL
          </GlobalText>,
          <GlobalText key={'perc-action'} type="caption" color="secondary">
            +0000%
          </GlobalText>,
        ].filter(Boolean)}
        onPress={() => {}}
      />

      <GlobalButtonCard
        transaction="paid"
        description={`To: ${getShortAddress(
          'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
        )}`}
        actions={[
          <GlobalText key={'amount-action'} type="body2" color="positive">
            +1 SOL
          </GlobalText>,
          <GlobalText key={'perc-action'} type="caption" color="secondary">
            +0000%
          </GlobalText>,
        ].filter(Boolean)}
        onPress={() => {}}
      />
    </GlobalCollapse>
  </GlobalLayoutForTabScreen>
);

export default TransactionsPage;
