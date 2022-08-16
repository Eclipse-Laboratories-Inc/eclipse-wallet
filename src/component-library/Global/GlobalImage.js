import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import ImageMaskLGCards from '../../assets/images/ImageMaskLGCards.png';
import ImageMaskLGAccentPrimary from '../../assets/images/ImageMaskLGAccentPrimary.png';
import ImageMaskXLCards from '../../assets/images/ImageMaskXLCards.png';
import ImageMaskXXLCards from '../../assets/images/ImageMaskXXLCards.png';

const styles = StyleSheet.create({
  sizeXXS: {
    width: 16,
    height: 16,
  },
  sizeXS: {
    width: 24,
    height: 24,
  },
  sizeSM: {
    width: 32,
    height: 32,
  },
  sizeNormal: {
    width: 40,
    height: 40,
  },
  sizeMD: {
    width: 48,
    height: 48,
  },
  sizeXL: {
    width: 70,
    height: 70,
  },
  sizeXXL: {
    width: 100,
    height: 100,
  },
  size3XL: {
    width: 120,
    height: 120,
  },
  size4XL: {
    width: 196,
    height: 196,
  },
  size5XL: {
    width: 234,
    height: 234,
  },
  block: {
    width: '100%',
    height: '100%',
  },
  square: {
    width: '100%',
    aspectRatio: 1,
  },
  circle: {
    borderRadius: 250,
  },
  squircle: {
    borderRadius: 20,
  },
  imageMask: {
    position: 'absolute',
    marginTop: -1,
    marginLeft: -1,
  },
  imageMaskLG: {
    width: 72,
    height: 72,
  },
  imageMaskXL: {
    width: 196,
    height: 196,
  },
  imageMaskXXL: {
    width: 264,
    height: 264,
  },
});

const GlobalImage = ({
  name,
  source,
  url,
  size,
  mask,
  maskColor,
  square,
  circle,
  squircle,
  resizeMode,
  style,
  ...props
}) => {
  const imageStyles = {
    ...(size === 'xxs' && styles.sizeXXS),
    ...(size === 'xs' && styles.sizeXS),
    ...(size === 'sm' && styles.sizeSM),
    ...(size === 'normal' && styles.sizeNormal),
    ...(size === 'md' && styles.sizeMD),
    ...(size === 'xl' && styles.sizeXL),
    ...(size === 'xxl' && styles.sizeXXL),
    ...(size === '3xl' && styles.size3XL),
    ...(size === '4xl' && styles.size4XL),
    ...(size === '5xl' && styles.size5XL),
    ...(size === 'block' && styles.block),
    ...(circle && styles.circle),
    ...(squircle && styles.squircle),
    ...(square && styles.square),
  };

  return (
    <>
      <Image
        // source={name ? getImage(name) : source}
        source={url ? { uri: url } : source}
        resizeMode={resizeMode || 'contain'}
        style={[imageStyles, style]}
        {...props}
      />

      {mask && (
        <View style={styles.imageMask}>
          {mask === 'lg' && (
            <>
              {maskColor !== 'accentPrimary' && (
                <GlobalImage
                  source={ImageMaskLGCards}
                  style={styles.imageMaskLG}
                />
              )}
              {maskColor === 'accentPrimary' && (
                <GlobalImage
                  source={ImageMaskLGAccentPrimary}
                  style={styles.imageMaskLG}
                />
              )}
            </>
          )}

          {mask === 'xl' && (
            <GlobalImage source={ImageMaskXLCards} style={styles.imageMaskXL} />
          )}

          {mask === 'xxl' && (
            <GlobalImage
              source={ImageMaskXXLCards}
              style={styles.imageMaskXXL}
            />
          )}
        </View>
      )}
    </>
  );
};

export default GlobalImage;
