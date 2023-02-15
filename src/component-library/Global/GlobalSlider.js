import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import GlobalButton from './GlobalButton';
import IconExpandMore from '../../assets/images/IconExpandMore.png';
import IconExpandLess from '../../assets/images/IconExpandLess.png';
import theme from './theme';

const styles = StyleSheet.create({
  sliderContainer: {
    paddingBottom: theme.gutters.paddingNormal,
    overflow: 'hidden',
    position: 'relative',
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
    bottom: 2,
    backgroundColor: 'transparent',
  },
});

const GlobalSlider = ({
  items,
  slides,
  renderItem,
  minHeight,
  maxHeight,
  isExpanded,
  setIsExpanded,
  dots = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(minHeight);
  const [sliderRef, slider] = useKeenSlider({
    slides: { number: slides, initial: 0, spacing: 20 },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  const toggleCollapse = t => {
    setCurrentHeight(isExpanded ? minHeight : maxHeight);
    setIsExpanded(!isExpanded);
  };
  return (
    <View style={styles.sliderContainer}>
      <div
        ref={sliderRef}
        className="keen-slider"
        style={{ height: currentHeight }}>
        {items?.map((item, index) => (
          <div key={index} className="keen-slider__slide">
            {renderItem({ item })}
          </div>
        ))}
      </div>
      {items[0].value.length > 2 && (
        <GlobalButton
          type="icon"
          transparent
          icon={isExpanded ? IconExpandLess : IconExpandMore}
          onPress={toggleCollapse}
          size="medium"
          style={styles.collapseButton}
        />
      )}
      {dots && items.length > 1 && (
        <View style={styles.dotsContainer}>
          {items?.map((item, idx) => (
            <TouchableOpacity
              key={`dots-button-${idx}`}
              onPress={() => {
                slider.current?.moveToIdx(idx);
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
