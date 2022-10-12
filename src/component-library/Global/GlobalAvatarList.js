import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';
import GlobalSkeleton from './GlobalSkeleton';
import theme from './theme';
import Grid from '../Grid/Grid';

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusXL,
    overflow: 'hidden',
  },
  touchable: {
    width: '100%',
    flexGrow: 1,
  },
  block: {
    width: '100%',
    height: '100%',
  },
});

const GlobalAvatarList = ({ onClick }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <GlobalSkeleton type="NftList" />}
      <Grid
        spacing={1}
        columns={2}
        items={[...Array(25).keys()].map(index => {
          const id = String(index).padStart(2, '0');
          return (
            <TouchableOpacity
              onPress={() => onClick(id)}
              style={styles.touchable}>
              <View key={id} style={styles.image}>
                <Image
                  source={`http://static.salmonwallet.io/avatar/${id}.png`}
                  resizeMode="contain"
                  style={styles.block}
                  onLoad={() => {
                    setLoaded(true);
                  }}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      />
    </>
  );
};

export default withTranslation()(GlobalAvatarList);
