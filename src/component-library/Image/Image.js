import React from 'react';

const Image = ({ src, alt }) => (
  <img src={src} alt={alt} style={styles.image} />
);

const styles = {
  image: { width: '100%' },
};

export default Image;
