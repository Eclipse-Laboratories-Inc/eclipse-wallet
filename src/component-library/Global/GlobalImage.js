import React from 'react';
import { Image as RNImage } from 'react-native';
// import { getImage } from './images';

const GlobalImage = ({ name, source, resizeMode, ...props }) => (
  <RNImage
    // source={name ? getImage(name) : source}
    source={source}
    resizeMode={resizeMode || 'contain'}
    {...props}
  />
);

export default GlobalImage;
