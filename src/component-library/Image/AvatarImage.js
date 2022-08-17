import React from 'react';
import Avatar from '@mui/material/Avatar';

const AvatarImage = ({ src, url }) => <Avatar alt="" src={url || src} />;

export default AvatarImage;
