import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import theme, { globalStyles } from './theme';
import GlobalText from './GlobalText';
import GlobalCollapse from './GlobalCollapse';
import GlobalImage from './GlobalImage';
import GlobalButton from './GlobalButton';
import GlobalPadding from './GlobalPadding';
import IconExpandMore from '../../assets/images/IconExpandMore.png';
import IconExpandLess from '../../assets/images/IconExpandLess.png';
import IconHyperspace from '../../assets/images/IconHyperspace.jpeg';

const { width: windowWidth } = Dimensions.get('window');
import AppIcon from '../../assets/images/AppIcon.png';

const styles = StyleSheet.create({
  image: {
    marginRight: theme.gutters.paddingSM,
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
  containerDots: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: -50,
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: theme.colors.accentPrimary,
    marginHorizontal: -10,
  },
  inactiveDot: {
    backgroundColor: '#6e7d86',
    width: 5,
    height: 5,
    marginHorizontal: -10,
  },
});

const GlobalSlider = ({
  title,
  titleTop,
  titleTopDetail,
  titleTopPrice,
  number,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(294);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const [sliderItems] = useState([
    {
      title: 'Item 1',
      text: 'Text 1',
    },
    {
      title: 'Item 2',
      text: 'Text 2',
    },
    {
      title: 'Item 3',
      text: 'Text 3',
    },
  ]);

  const sliderRef = React.useRef(null);
  const sliderWidth = windowWidth;

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: theme.colors.bgPrimary,
          borderRadius: theme.borderRadius.borderRadiusMD,
          height: sliderHeight,
          padding: theme.gutters.paddingSM,
        }}>
        <View style={globalStyles.inlineFlexButtons}>
          <GlobalText type="body2">New collections</GlobalText>
          <GlobalImage
            circle
            source={IconHyperspace}
            size="xs"
            style={globalStyles.centeredSmall}
          />
        </View>
        <GlobalPadding size="sm" />
        {Array(2).fill(
          <View style={styles.itemContainer}>
            <GlobalImage source={AppIcon} size="xxl" style={styles.image} />
            <View>
              <GlobalText type="body2">Collection Name</GlobalText>
              <GlobalText type="caption">Collection Size Items</GlobalText>
              <GlobalText type="caption">Floor: Floor_Price</GlobalText>
              <GlobalText type="caption">1D Volume: Volume_1D</GlobalText>
            </View>
          </View>,
        )}
        {isCollapseOpen &&
          Array(4).fill(
            <View style={styles.itemContainer}>
              <GlobalImage source={AppIcon} size="xxl" style={styles.image} />
              <View>
                <GlobalText type="body2">Collection Name</GlobalText>
                <GlobalText type="caption">Collection Size Items</GlobalText>
                <GlobalText type="caption">Floor: Floor_Price</GlobalText>
                <GlobalText type="caption">1D Volume: Volume_1D</GlobalText>
              </View>
            </View>,
          )}
        <GlobalButton
          type="icon"
          transparent
          icon={isCollapseOpen ? IconExpandLess : IconExpandMore}
          onPress={toggleCollapse}
          size="medium"
          style={styles.collapseButton}
        />
      </View>
    );
  };

  const firstItemRef = useRef(null);
  const lastItemRef = useRef(null);

  const onRef = useCallback(
    (ref, i) => {
      if (ref) {
        if (i === 0) {
          firstItemRef.current = ref;
        }
        if (i === sliderItems.length - 1) {
          lastItemRef.current = ref;
        }
      }
    },
    [sliderItems, firstItemRef, lastItemRef],
  );

  const toggleCollapse = t => {
    setSliderHeight(isCollapseOpen ? 294 : 740);
    setIsCollapseOpen(!isCollapseOpen);
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 50 }}>
      <View>
        <Carousel
          pagingEnabled
          layout={'default'}
          ref={onRef}
          data={sliderItems}
          sliderWidth={sliderWidth - 24}
          itemWidth={sliderWidth - 24}
          renderItem={renderItem}
          onSnapToItem={index => setActiveIndex(index)}
        />
        <Pagination
          dotsLength={sliderItems.length}
          activeDotIndex={activeIndex}
          containerStyle={styles.containerDots}
          dotStyle={styles.dot}
          inactiveDotStyle={styles.inactiveDot}
          inactiveDotScale={1}
        />
      </View>
    </SafeAreaView>
  );
};
export default GlobalSlider;
