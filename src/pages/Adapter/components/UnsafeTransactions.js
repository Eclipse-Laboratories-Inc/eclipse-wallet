import React from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalText from '../../../component-library/Global/GlobalText';
import theme, { globalStyles } from '../../../component-library/Global/theme';

import { ActiveWalletCard } from './ActiveWalletCard';
import VerifiedByBlowfish from './VerifiedByBlowfish';
import { withTranslation } from '../../../hooks/useTranslations';

import RedAppIcon from '../../../assets/images/RedAppIcon.png';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: theme.gutters.paddingMD,
    paddingHorizontal: theme.gutters.paddingXL,
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: '#FF1B1B33',
    borderRadius: theme.borderRadius.borderRadiusMD,
  },
});

const UnsafeTransactions = ({ t, onApprove, onReject }) => (
  <GlobalLayout fullscreen>
    <GlobalLayout.Header>
      <ActiveWalletCard />
      <GlobalBackTitle title={t('adapter.detail.transaction.title')} nospace />
    </GlobalLayout.Header>
    <GlobalLayout.Inner>
      <View style={styles.container}>
        <GlobalImage source={RedAppIcon} size="xxl" circle />
        <GlobalPadding size="sm" />
        <GlobalText type="headline2" color="negative" center>
          {t('adapter.detail.transaction.unsafe')}
        </GlobalText>
        <GlobalText center>
          {t('adapter.detail.transaction.caution')}
        </GlobalText>
        <GlobalPadding size="sm" />
        <VerifiedByBlowfish />
        <GlobalButton type="text" onPress={onApprove}>
          <GlobalText color="negative" type="caption" nospace>
            {t('adapter.detail.transaction.proceed_anyway')}
          </GlobalText>
        </GlobalButton>
      </View>
    </GlobalLayout.Inner>
    <GlobalLayout.Footer>
      <View style={globalStyles.inlineFlexButtons}>
        <GlobalButton
          type="secondary"
          flex
          title={t('actions.cancel')}
          onPress={onReject}
          style={globalStyles.button}
          touchableStyles={globalStyles.buttonTouchable}
        />
      </View>
    </GlobalLayout.Footer>
  </GlobalLayout>
);

export default withTranslation()(UnsafeTransactions);
