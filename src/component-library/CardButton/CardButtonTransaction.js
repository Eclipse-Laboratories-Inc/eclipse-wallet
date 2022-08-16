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
  // amount,
  percentage,
  title,
  description,
  active,
  complete,
  actionIcon,
  actions,
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
      case 'unknown':
        return 'Unknown';
      default:
        return 'Sent';
    }
  };

  return (
    <CardButton
      image={getTransactionImage(transaction)}
      imageSize="normal"
      title={title || getTransactionTitle(transaction)}
      description={address && `To: ${getShortAddress(address)}`}
      active={active}
      complete={complete}
      actionIcon={actionIcon}
      imageStyle={styles.imageStyle}
      actions={actions}
      onPress={onPress}
    />
  );
};
export default CardButtonTransaction;
