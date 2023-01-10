import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import theme from '../Global/theme';
import CardButton from './CardButton';
import GlobalText from '../Global/GlobalText';

import { getTransactionImage, getShortAddress } from '../../utils/wallet';

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: theme.borderRadius.borderRadiusPill,
  },
  chip: {
    paddingHorizontal: theme.gutters.paddingXXS,
    marginLeft: theme.gutters.paddingXXS,
    height: theme.gutters.paddingSM - 1,
    borderRadius: theme.borderRadius.borderRadiusXS,
  },
  description: {
    opacity: 0.9,
  },
  arrow: {
    paddingHorizontal: theme.gutters.paddingXS - 2,
  },
});

const CardButtonPendingTx = ({
  transaction,
  address,
  tokenNames,
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
  tokenImg1,
  tokenImg2,
  ...props
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
      case 'inProgress':
        return 'Sending...';
      case 'swapping':
        return 'Swapping...';
      case 'success':
        return 'Finished';
      default:
        return 'Sent';
    }
  };

  const getChipColor = type => {
    switch (type) {
      case 'ETH':
        return 'rgb(145, 165, 240)';
      case 'BSC':
        return 'rgb(245, 206, 84)';
      case 'BEP20':
        return 'rgb(245, 206, 84)';
      case 'BEP2':
        return 'rgb(245, 206, 84)';
      case 'TRX':
        return 'rgb(255, 102, 113)';
      case 'MAINNET':
        return 'rgb(87, 222, 214)';
      default:
        return 'rgb(158, 176, 197)';
    }
  };

  const getTokenNames = tokens => {
    return tokens.map((token, i) => {
      if (!token.network) {
        token.network = 'MAINNET';
      }
      return (
        <>
          <GlobalText
            type="caption"
            numberOfLines={1}
            color="secondary"
            style={styles.description}>
            {token.symbol.toUpperCase()}
          </GlobalText>
          <View
            style={[
              styles.chip,
              { backgroundColor: getChipColor(token.network) },
            ]}>
            <GlobalText type="overline" color="primary" bold>
              {token.network}
            </GlobalText>
          </View>
          {i === 0 && <Text style={styles.arrow}>→</Text>}
        </>
      );
    });
  };

  return (
    <CardButton
      image={getTransactionImage(transaction)}
      tokenImg1={tokenImg1}
      tokenImg2={tokenImg2}
      imageSize="normal"
      title={title || getTransactionTitle(transaction)}
      description={
        address
          ? `${transaction === 'sent' ? 'To:' : 'From:'} ${getShortAddress(
              address,
            )}`
          : tokenNames
          ? getTokenNames(tokenNames)
          : null
      }
      active={active}
      complete={complete}
      actionIcon={actionIcon}
      imageStyle={styles.imageStyle}
      actions={actions}
      onPress={onPress}
      {...props}
    />
  );
};
export default CardButtonPendingTx;
