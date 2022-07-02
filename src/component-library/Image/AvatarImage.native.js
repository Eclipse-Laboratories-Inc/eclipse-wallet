import React from 'react';
import { Avatar } from 'react-native-paper';

const AvatarImage = ({ src, url, size }) => (
  <Avatar.Image size={size} source={url ? { uri: url } : src} />
);

export default AvatarImage;
