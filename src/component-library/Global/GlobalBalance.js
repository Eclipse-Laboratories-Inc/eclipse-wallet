import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';
import theme from './theme';
import GlobalButton from './GlobalButton';
import GlobalImage from './GlobalImage';
import GlobalText from './GlobalText';
import SimpleDialog from '../Dialog/SimpleDialog';

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
    marginLeft: theme.gutters.paddingSM,
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
  infoLink: {
    marginLeft: theme.gutters.paddingXXS,
    fontFamily: theme.fonts.dmSansRegular,
    fontSize: theme.fontSize.fontSizeXS,
    lineHeight: theme.fontSize.fontSizeNormal,
    color: theme.colors.labelSecondary,
    fontWeight: 'normal',
    textTransform: 'none',
    marginTop: 2,
  },
});

const WalletBalanceCard = ({
  total,
  totalType = 'headline1',
  neutralTotal,
  negativeTotal,
  positiveTotal,
  messages,
  actions,
  showBalance,
  onToggleShow,
  t,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const toggleDialog = () => {
    setShowDialog(!showDialog);
  };
  return (
    <View style={styles.container}>
      <View style={styles.bigTotal}>
        <GlobalText type={totalType} center nospace>
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
            <GlobalText
              type="body2"
              color="negative"
              style={styles.upDownTotals}>
              {negativeTotal}
            </GlobalText>
          </>
        )}

        {positiveTotal && (
          <>
            <GlobalImage source={IconBalanceUp} style={styles.iconUpDown} />
            <GlobalText
              type="body2"
              color="positive"
              style={styles.upDownTotals}>
              {positiveTotal}
            </GlobalText>
          </>
        )}
        <TouchableOpacity onPress={toggleDialog}>
          <GlobalText type="body2" style={styles.infoLink}>
            {t(`wallet.create.info_icon`)}
          </GlobalText>
        </TouchableOpacity>
      </View>
      <SimpleDialog
        onClose={toggleDialog}
        isOpen={showDialog}
        text={
          <GlobalText center type="body1">
            {t(`token.balance.percentage_info`)}
          </GlobalText>
        }
      />

      {actions}
    </View>
  );
};

export default withTranslation()(WalletBalanceCard);
