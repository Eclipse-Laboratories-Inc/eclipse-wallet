import React from 'react';
import { Image as RNImage, StyleSheet } from 'react-native';

const Image = ({ src, alt }) => <RNImage source={src} style={styles.image} />;

const styles = StyleSheet.create({
  image: { width: '100%', resizeMode: 'contain' },
});

export default Image;
