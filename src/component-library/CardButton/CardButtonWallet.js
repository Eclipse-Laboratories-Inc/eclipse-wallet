import React from 'react';

import { getMediaRemoteUrl } from '../../utils/media';
import { LOGOS, getShortAddress } from '../../utils/wallet';

import CardButton from './CardButton';

const CardButtonWallet = ({
  title,
  address,
  chain,
  image,
  imageSize,
  selected,
  active,
  onPress,
  onSecondaryPress,
  onTertiaryPress,
  buttonStyle,
  touchableStyles,
  ...props
}) => (
  <CardButton
    key={address}
    title={title}
    description={`${getShortAddress(address)}`}
    image={getMediaRemoteUrl(image || LOGOS[chain])}
    imageSize={imageSize ? imageSize : 'xl'}
    mask="lg"
    active={active}
    selected={selected}
    onPress={onPress}
    onSecondaryPress={onSecondaryPress}
    onTertiaryPress={onTertiaryPress}
    buttonStyle={buttonStyle}
    touchableStyles={touchableStyles}
    {...props}
  />
);

export default CardButtonWallet;
