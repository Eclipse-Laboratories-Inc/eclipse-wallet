import React from 'react';
import { StyleSheet, View } from 'react-native';

import { getShortAddress } from '../../utils/wallet';

import theme from './theme';
import GlobalButton from './GlobalButton';
import GlobalText from './GlobalText';

import IconArrowBack from '../../assets/images/IconArrowBack.png';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.gutters.paddingLG,
  },
  buttonSize: {
    width: 52,
  },
  centerInline: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineTitle: {
    textAlign: 'right',
    marginRight: theme.gutters.paddingXXS,
    lineHeight: theme.fontSize.fontSizeNormal + 2,
  },
  inlineAddress: {
    lineHeight: theme.fontSize.fontSizeNormal + 4,
  },
});

const GlobalBackTitle = ({
  onBack,
  title,
  smallTitle,
  inlineTitle,
  inlineAddress,
  children,
}) => (
  <View style={styles.container}>
    {onBack && (
      <GlobalButton
        type="icon"
        transparent
        icon={IconArrowBack}
        onPress={onBack}
      />
    )}

    <View style={styles.centerInline}>
      {title && (
        <GlobalText type={smallTitle ? 'subtitle2' : 'headline2'} nospace>
          {title}
        </GlobalText>
      )}

      {inlineTitle && (
        <GlobalText type="body2" style={styles.inlineTitle}>
          {inlineTitle}
        </GlobalText>
      )}

      {inlineAddress && (
        <GlobalText type="body1" color="tertiary" style={styles.inlineAddress}>
          ({getShortAddress(inlineAddress)})
        </GlobalText>
      )}

      {children}
    </View>

    {onBack && <View style={styles.buttonSize} />}
  </View>
);
export default GlobalBackTitle;
