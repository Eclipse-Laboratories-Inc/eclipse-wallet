import React from 'react';
import { StyleSheet, View } from 'react-native';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalText from '../../../component-library/Global/GlobalText';

import theme from '../../../component-library/Global/theme';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  icon: {
    marginRight: theme.gutters.paddingSM,
    marginBottom: theme.gutters.paddingSM,
  },
});

export const DAppCard = ({ name, icon, origin }) => (
  <>
    <View style={styles.row}>
      <GlobalImage source={icon} size="md" style={styles.icon} />
      <GlobalText color="secondary">{name}</GlobalText>
    </View>
    <GlobalText color="warning" center>
      {origin}
    </GlobalText>
  </>
);
