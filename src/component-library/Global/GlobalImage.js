import React from 'react';
import { StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
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
});

const GlobalImage = ({ name, source, size, resizeMode, style, ...props }) => {
  const imageStyles = {
    ...(size === 'sm' ? styles.sizeSM : {}),
    ...(size === 'md' ? styles.sizeMD : {}),
    ...(size === 'xl' ? styles.sizeXL : {}),
  };

  return (
    <Image
      // source={name ? getImage(name) : source}
      source={source}
      resizeMode={resizeMode || 'contain'}
      style={[styles.sizeNormal, imageStyles, style]}
      {...props}
    />
  );
};

export default GlobalImage;
