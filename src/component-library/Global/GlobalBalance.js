import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

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
    marginBottom: theme.gutters.paddingLG,
    fontFamily: theme.fonts.dmSansRegular,
    fontSize: theme.fontSize.fontSizeXS,
    color: theme.colors.labelSecondary,
    fontWeight: 'normal',
    textTransform: 'none',
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
      </View>
      <GlobalButton
        type="text"
        wide
        textStyle={styles.infoLink}
        title={t(`wallet.create.derivable_info_icon`)}
        onPress={toggleDialog}
      />
      <SimpleDialog
        title={
          <GlobalText center type="headline3" numberOfLines={1}>
            {t(`wallet.create.derivable_info`)}
          </GlobalText>
        }
        onClose={toggleDialog}
        isOpen={showDialog}
        text={
          <GlobalText center type="subtitle1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam.
          </GlobalText>
        }
      />

      {actions}
    </View>
  );
};

export default withTranslation()(WalletBalanceCard);
