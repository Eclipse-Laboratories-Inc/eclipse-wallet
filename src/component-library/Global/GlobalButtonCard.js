import React from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalButton from './GlobalButton';
import GlobalText from './GlobalText';
import theme from './theme';

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
  icon: {
    marginRight: theme.gutters.paddingSM,
  },
  main: {
    justifyContent: 'center',
  },
  description: {
    opacity: 0.9,
  },
  cardContent: {
    flexDirection: 'row',
  },
});

const GlobalButtonCard = ({
  icon,
  title,
  description,
  children,
  active,
  actions,
  onPress,
  touchableStyles,
}) => (
  <GlobalButton
    type="card"
    color={active ? 'active' : null}
    title={!children ? title : null}
    onPress={onPress}
    style={[styles.buttonCard, title && description && styles.buttonCardLarge]}
    touchableStyles={touchableStyles}>
    <View style={styles.cardContent}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <View style={styles.main}>
        {title && <GlobalText type="body2">{title}</GlobalText>}
        {description && (
          <GlobalText type="caption" style={styles.description}>
            {description}
          </GlobalText>
        )}
      </View>
    </View>
    {actions && <View style={styles.cardActions}>{actions}</View>}
    {children && <View>{children}</View>}
  </GlobalButton>
);
export default GlobalButtonCard;
