import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useKeenSliderNative } from 'keen-slider/react-native';
import GlobalButton from './GlobalButton';
import IconExpandMore from '../../assets/images/IconExpandMore.png';
import IconExpandLess from '../../assets/images/IconExpandLess.png';
import theme from './theme';

const styles = StyleSheet.create({
  sliderContainer: {
    paddingBottom: theme.gutters.paddingNormal,
    overflow: 'hidden',
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
  collapseButton: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: 10,
    backgroundColor: 'transparent',
  },
});

const GlobalSlider = ({
  items,
  slides,
  renderItem,
  minHeight,
  maxHeight,
  dots = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(minHeight);
  const [isExpanded, setIsExpanded] = useState(false);
  const slider = useKeenSliderNative({
    slides: { number: slides, perView: 1, spacing: 20 },
  });

  const toggleCollapse = t => {
    setCurrentHeight(isExpanded ? minHeight : maxHeight);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.sliderContainer}>
      <View style={{ height: currentHeight }} {...slider.containerProps}>
        {items?.map((item, index) => (
          <View key={index} {...slider.slidesProps[index]}>
            {renderItem(item, isExpanded)}
          </View>
        ))}
      </View>
      <GlobalButton
        type="icon"
        transparent
        icon={isExpanded ? IconExpandLess : IconExpandMore}
        onPress={toggleCollapse}
        size="medium"
        style={styles.collapseButton}
      />
      {dots && items.length > 1 && (
        <View style={styles.dotsContainer}>
          {items?.map((item, idx) => (
            <TouchableOpacity
              onPress={() => {
                setCurrentSlide(idx);
                slider.moveToIdx(idx);
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
