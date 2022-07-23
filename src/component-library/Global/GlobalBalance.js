import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from './theme';
import GlobalButton from './GlobalButton';
import GlobalImage from './GlobalImage';
import GlobalText from './GlobalText';

import IconVisibilityHidden from '../../assets/images/IconVisibilityHidden.png';
import IconVisibilityShow from '../../assets/images/IconVisibilityShow.png';
import IconBalanceUp from '../../assets/images/IconBalancetUp.png';
import IconBalanceDown from '../../assets/images/IconBalanceDown.png';

const styles = StyleSheet.create({
  container: {},
  bigTotal: {
    marginRight: -52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inline: {
    marginTop: theme.gutters.paddingXXS,
    marginBottom: theme.gutters.paddingXL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconUpDown: {
    marginLeft: theme.gutters.paddingXXS,
    width: 18,
    height: 18,
  },
  upDownTotals: {
    marginTop: 2,
    marginRight: theme.gutters.paddingXXS,
    lineHeight: theme.fontSize.fontSizeNormal,
  },
});

const WalletBalanceCard = ({
  total,
  neutralTotal,
  negativeTotal,
  positiveTotal,
  messages,
  actions,
  showBalance,
  onToggleShow,
}) => (
  <View style={styles.container}>
    <View style={styles.bigTotal}>
      <GlobalText type="headline1" center nospace>
        {total}

        <GlobalButton
          type="icon"
          transparent
          icon={showBalance ? IconVisibilityShow : IconVisibilityHidden}
          onPress={onToggleShow}
        />
      </GlobalText>
    </View>

    <View style={styles.inline}>
      {neutralTotal && (
        <GlobalText type="body2" style={styles.upDownTotals}>
          {neutralTotal}
        </GlobalText>
      )}

      {negativeTotal && (
        <>
          <GlobalImage source={IconBalanceDown} style={styles.iconUpDown} />
          <GlobalText type="body2" color="negative" style={styles.upDownTotals}>
            {negativeTotal}
          </GlobalText>
        </>
      )}

      {positiveTotal && (
        <>
          <GlobalImage source={IconBalanceUp} style={styles.iconUpDown} />
          <GlobalText type="body2" color="positive" style={styles.upDownTotals}>
            {positiveTotal}
          </GlobalText>
        </>
      )}
    </View>

    {actions}
  </View>
);

export default WalletBalanceCard;
