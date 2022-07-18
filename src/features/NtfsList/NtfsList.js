import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../../component-library/Global/theme';
import GlobalImage from '../../component-library/Global/GlobalImage';

import Grid from '../../component-library/Grid/Grid';
import { getMediaRemoteUrl } from '../../utils/media';

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusXL,
    overflow: 'hidden',
  },
});

const NtfsList = ({ ntfs }) => (
  <Grid
    spacing={1}
    columns={2}
    items={ntfs.map(ntf => {
      console.log(getMediaRemoteUrl(ntf.image));
      return (
        <View style={styles.image}>
          <GlobalImage
            key={ntf.url}
            source={getMediaRemoteUrl(ntf.image).url}
            size="block"
          />
        </View>
      );
    })}
  />
);

export default NtfsList;
