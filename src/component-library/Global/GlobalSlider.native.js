import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import GlobalButton from './GlobalButton';
import IconExpandMore from '../../assets/images/IconExpandMore.png';
import IconExpandLess from '../../assets/images/IconExpandLess.png';

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
  collapseButton: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: 4,
    backgroundColor: 'transparent',
  },
});

const GlobalSlider = ({ items, renderItem }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const toggleCollapse = t => {
    setIsExpanded(!isExpanded);
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 50 }}>
      <View>
        <Carousel
          pagingEnabled
          layout={'default'}
          ref={onRef}
          data={items}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
          renderItem={() => renderItem(items[activeIndex], isExpanded)}
          onSnapToItem={index => setActiveIndex(index)}
        />
        <GlobalButton
          type="icon"
          transparent
          icon={isExpanded ? IconExpandLess : IconExpandMore}
          onPress={toggleCollapse}
          size="medium"
          style={styles.collapseButton}
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
