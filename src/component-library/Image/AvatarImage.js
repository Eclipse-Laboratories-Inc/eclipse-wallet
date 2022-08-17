import React from 'react';
import Avatar from '@mui/material/Avatar';

const AvatarImage = ({ src, url, size }) => (
  <Avatar
    alt="Remy Sharp"
    src={url || src}
    sx={{ width: size, height: size }}
  />
);

export default AvatarImage;
