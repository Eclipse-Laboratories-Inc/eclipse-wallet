import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';

import { getShortAddress } from '../../utils/wallet';

import theme from './theme';
import GlobalButton from './GlobalButton';
import GlobalText from './GlobalText';

import IconArrowBack from '../../assets/images/IconArrowBack.png';

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.gutters.paddingLG,
  },
  nospace: {
    marginBottom: 0,
  },
  buttonSize: {
    width: 52,
    height: 52,
  },
  buttonSizeSmall: {
    width: theme.gutters.paddingXXS,
    height: theme.gutters.paddingXXS,
  },
  vertical: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  secondaryTitle,
  tertiaryTitle,
  inlineTitle,
  inlineAddress,
  nospace,
  children,
}) => (
  <SafeAreaView edges={['top']}>
    <View style={[styles.container, nospace && styles.nospace]}>
      {onBack && (
        <GlobalButton
          type="icon"
          transparent
          icon={IconArrowBack}
          onPress={onBack}
        />
      )}
      {!onBack && <View style={styles.buttonSizeSmall} />}

      {(title || secondaryTitle || tertiaryTitle) && (
        <View style={styles.vertical}>
          {title && (
            <GlobalText type={'headline2'} center nospace>
              {title}
            </GlobalText>
          )}

          {secondaryTitle && (
            <GlobalText type={'subtitle2'} center nospace>
              {secondaryTitle}
            </GlobalText>
          )}
          {tertiaryTitle && (
            <GlobalText type={'body1'} center nospace>
              {tertiaryTitle}
            </GlobalText>
          )}
        </View>
      )}

      {(inlineTitle || inlineAddress) && (
        <View style={styles.centerInline}>
          {inlineTitle && (
            <GlobalText type="body2" style={styles.inlineTitle}>
              {inlineTitle}
            </GlobalText>
          )}

          {inlineAddress && (
            <GlobalText
              type="body1"
              color="tertiary"
              style={styles.inlineAddress}>
              ({getShortAddress(inlineAddress)})
            </GlobalText>
          )}

          {children}
        </View>
      )}

      {children}

      {onBack && <View style={styles.buttonSize} />}
      {!onBack && <View style={styles.buttonSizeSmall} />}
    </View>
  </SafeAreaView>
);
export default GlobalBackTitle;
