import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import theme from '../../../component-library/Global/theme';

const styles = StyleSheet.create({
  image: {
    marginRight: theme.gutters.paddingSM,
    aspectRatio: 1,
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusXL,
    overflow: 'hidden',
    zIndex: 1,
  },
  itemContainer: {
    marginBottom: theme.gutters.paddingSM,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapseButton: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: -20,
    backgroundColor: theme.colors.bgPrimary,
  },
});

const NftCollectionItem = ({ item }) => {
  const openCollection = async project_id => {
    const url = `https://hyperspace.xyz/collection//${project_id}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
    }
  };
  console.log(item);
  return (
    <TouchableOpacity onPress={() => openCollection(item.project_id)}>
      <View style={styles.itemContainer}>
        <GlobalImage
          source={item.project.img_url}
          size="xxl"
          style={styles.image}
        />
        <View>
          <GlobalText type="body2">{item.project.display_name}</GlobalText>
          <GlobalText type="caption">{item.project.supply} Items</GlobalText>
          <GlobalText type="caption">Floor: {item.floor_price}</GlobalText>
          <GlobalText type="caption">
            1D Volume: {item.volume_1day} SOL
          </GlobalText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NftCollectionItem;
