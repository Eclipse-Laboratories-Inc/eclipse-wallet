import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useKeenSliderNative } from 'keen-slider/react-native';
import theme from './theme';

const styles = StyleSheet.create({
  sliderContainer: {
    paddingBottom: theme.gutters.paddingNormal,
  },
  dotsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.gutters.paddingSM,
    flexDirection: 'row',
  },
  inactiveDot: {
    border: 'none',
    width: 10,
    height: 10,
    backgroundColor: '#6e7d86',
    borderRadius: '50%',
    marginLeft: 5,
    marginRight: 5,
    cursor: 'pointer',
  },
  activeDot: {
    border: 'none',
    width: 10,
    height: 10,
    backgroundColor: theme.colors.accentPrimary,
    borderRadius: '50%',
    marginLeft: 5,
    marginRight: 5,
    cursor: 'pointer',
  },
});

const GlobalSlider = ({
  items,
  slides,
  renderItem,
  sliderHeight,
  dots = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider = useKeenSliderNative({ slides });

  return (
    <View style={styles.sliderContainer}>
      <View style={{ height: sliderHeight }} {...slider.containerProps}>
        {items?.map((item, index) => (
          <View key={index} {...slider.slidesProps[index]}>
            {renderItem(item)}
          </View>
        ))}
      </View>
      {dots && (
        <View style={styles.dotsContainer}>
          {items?.map(idx => (
            <TouchableOpacity
              onPress={() => {
                slider.moveToSlideRelative(idx);
              }}
              style={
                currentSlide === idx ? styles.activeDot : styles.inactiveDot
              }
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default GlobalSlider;
