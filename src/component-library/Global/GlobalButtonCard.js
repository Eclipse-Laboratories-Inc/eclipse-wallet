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
  icon,
  image,
  imageSize,
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
    ...(title && description && styles.buttonCardLarge),
    ...(type === 'wallet' ? styles.buttonCardXL : {}),
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

        {image && (
          <GlobalImage
            source={image}
            size={imageSize}
            style={styles.spaceRight}
          />
        )}

        <View style={styles.main}>
          {title && (
            <GlobalText type="body2" numberOfLines={1}>
              {title}
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

      {actions && <View style={styles.cardActions}>{actions}</View>}

      {complete && <GlobalImage source={IconInteractionRed} size="sm" />}

      {goToButton && <GlobalImage source={IconChevronRight} size="sm" />}

      {children && <View>{children}</View>}
    </GlobalButton>
  );
};
export default GlobalButtonCard;
