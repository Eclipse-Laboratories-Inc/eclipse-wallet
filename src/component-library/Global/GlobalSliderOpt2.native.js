import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import theme from './theme';

const { width: windowWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
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

const GlobalSlider = ({ items, renderItem, sliderHeight }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderWidth = windowWidth - 24;
  const firstItemRef = useRef(null);
  const lastItemRef = useRef(null);

  const onRef = useCallback(
    (ref, i) => {
      if (ref) {
        if (i === 0) {
          firstItemRef.current = ref;
        }
        if (i === items.length - 1) {
          lastItemRef.current = ref;
        }
      }
    },
    [items, firstItemRef, lastItemRef],
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 50 }}>
      <View>
        <Carousel
          pagingEnabled
          layout={'default'}
          ref={onRef}
          data={items}
          // sliderHeight={sliderHeight}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
          renderItem={renderItem}
          onSnapToItem={index => setActiveIndex(index)}
        />
        <Pagination
          dotsLength={items.length}
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
