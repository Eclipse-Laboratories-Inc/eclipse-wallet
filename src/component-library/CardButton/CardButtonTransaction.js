import React from 'react';
import { StyleSheet } from 'react-native';

import theme from '../Global/theme';
import CardButton from './CardButton';
import GlobalText from '../Global/GlobalText';

import { getTransactionImage, getShortAddress } from '../../utils/wallet';

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: theme.borderRadius.borderRadiusPill,
  },
});

const CardButtonTransaction = ({
  transaction,
  address,
  amount,
  percentage,
  title,
  description,
  active,
  complete,
  actionIcon,
  onPress,
  touchableStyles,
}) => {
  const getTransactionTitle = () => {
    const object = transaction;
    switch (object) {
      case 'sent':
        return 'Sent';
      case 'received':
        return 'Received';
      case 'swap':
        return 'Swap';
      case 'interaction':
        return 'Interaction';
      case 'paid':
        return 'Paid';
      default:
        return 'Sent';
    }
  };

  return (
    <CardButton
      image={getTransactionImage(transaction)}
      title={title || getTransactionTitle(transaction)}
      description={description || `To: ${getShortAddress(address)}`}
      active={active}
      complete={complete}
      actionIcon={actionIcon}
      imageStyle={styles.imageStyle}
      actions={[
        <GlobalText key={'amount-action'} type="body2" color="positive">
          {amount}
        </GlobalText>,
        <GlobalText key={'perc-action'} type="caption" color="secondary">
          {percentage}
        </GlobalText>,
      ].filter(Boolean)}
      onPress={onPress}
    />
  );
};
export default CardButtonTransaction;
