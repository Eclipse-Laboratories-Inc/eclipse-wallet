import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from './theme';
import GlobalButton from './GlobalButton';
import GlobalImage from './GlobalImage';
import GlobalText from './GlobalText';

import IconChevronRight from '../../assets/images/IconChevronRight.png';
import IconTransactionSent from '../../assets/images/IconTransactionSent.png';
import IconTransactionReceived from '../../assets/images/IconTransactionReceived.png';
import IconTransactionSwap from '../../assets/images/IconTransactionSwap.png';
import IconTransactionInteraction from '../../assets/images/IconTransactionInteraction.png';
import IconTransactionPaid from '../../assets/images/IconTransactionPaid.png';
import IconInteractionRed from '../../assets/images/IconInteractionRed.png';
import IconTransactionUnknown from '../../assets/images/IconTransactionUnknown.png';

const styles = StyleSheet.create({
  buttonCard: {
    width: '100%',
    marginBottom: theme.gutters.paddingNormal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonCardLarge: {
    minHeight: 80,
  },
  buttonCardXL: {
    minHeight: 94,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  spaceRight: {
    marginRight: theme.gutters.paddingSM,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    opacity: 0.9,
  },
  cardActions: {
    alignItems: 'flex-end',
  },
});

const GlobalButtonCard = ({
  type,
  transaction,
  icon,
  image,
  title,
  description,
  children,
  active,
  complete,
  goToButton,
  actions,
  onPress,
  touchableStyles,
}) => {
  const buttonStyle = {
    ...styles.buttonCard,
    ...((title || transaction) && description && styles.buttonCardLarge),
    ...(type === 'wallet' ? styles.buttonCardXL : {}),
  };

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

  const getTransactionImage = () => {
    const object = transaction;
    switch (object) {
      case 'sent':
        return IconTransactionSent;
      case 'received':
        return IconTransactionReceived;
      case 'swap':
        return IconTransactionSwap;
      case 'interaction':
        return IconTransactionInteraction;
      case 'paid':
        return IconTransactionPaid;
      case 'unknown':
        return IconTransactionUnknown;
      default:
        return IconTransactionSent;
    }
  };

  return (
    <GlobalButton
      type="card"
      color={active ? 'active' : null}
      title={!children ? title : null}
      onPress={onPress}
      style={buttonStyle}
      touchableStyles={touchableStyles}>
      <View style={styles.cardContent}>
        {icon && <View style={styles.spaceRight}>{icon}</View>}

        {image && type === 'wallet' && (
          <GlobalImage source={image} size="xl" style={styles.spaceRight} />
        )}

        {transaction && (
          <GlobalImage
            source={getTransactionImage(transaction)}
            style={styles.spaceRight}
          />
        )}

        <View style={styles.main}>
          {(title || transaction) && (
            <GlobalText type="body2" numberOfLines={1}>
              {!!title && title}
              {!title && transaction && getTransactionTitle(transaction)}
            </GlobalText>
          )}

          {description && (
            <GlobalText
              type="caption"
              numberOfLines={1}
              style={styles.description}>
              {description}
            </GlobalText>
          )}
        </View>
      </View>

      {goToButton && <GlobalImage source={IconChevronRight} size="sm" />}

      {actions && <View style={styles.cardActions}>{actions}</View>}

      {complete && <GlobalImage source={IconInteractionRed} size="sm" />}

      {children && <View>{children}</View>}
    </GlobalButton>
  );
};
export default GlobalButtonCard;
