import React from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalImage from '../../../component-library/Global/GlobalImage';

import Blowfish from '../../../assets/images/Blowfish.png';
import { withTranslation } from '../../../hooks/useTranslations';
import theme from '../../../component-library/Global/theme';

import GlobalAlert from '../../../component-library/Global/GlobalAlert';
import GlobalAlertText from '../../../component-library/Global/GlobalAlertText';
import GlobalText from '../../../component-library/Global/GlobalText';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    marginRight: theme.gutters.paddingXXS,
  },
  image: {
    height: 24,
  },
});

const VerifiedByBlowfish = ({ t, type }) =>
  type && type === 'success' ? (
    <GlobalAlert type={type}>
      <View style={styles.container}>
        <GlobalAlertText
          type={type}
          text={t('adapter.detail.transaction.verified_by')}
        />
        <GlobalImage source={Blowfish} size="xl" style={styles.image} />
      </View>
    </GlobalAlert>
  ) : (
    <View style={styles.container}>
      <GlobalText color="primary" type="caption" style={styles.text}>
        {t('adapter.detail.transaction.verified_by')}
      </GlobalText>
      <GlobalImage source={Blowfish} size="xxl" style={styles.image} />
    </View>
  );

export default withTranslation()(VerifiedByBlowfish);
