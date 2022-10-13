import React from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalText from '../../../component-library/Global/GlobalText';

import Blowfish from '../../../assets/images/Blowfish.png';
import { withTranslation } from '../../../hooks/useTranslations';
import theme from '../../../component-library/Global/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginRight: theme.gutters.paddingXXS,
  },
});

const VerifiedByBlowfish = ({ t }) => (
  <View style={styles.container}>
    <GlobalText color="primary" type="caption" style={styles.text}>
      {t('adapter.detail.transaction.verified_by')}
    </GlobalText>
    <GlobalImage source={Blowfish} size="xl" />
  </View>
);

export default withTranslation()(VerifiedByBlowfish);
