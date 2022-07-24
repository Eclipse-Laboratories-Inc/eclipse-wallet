import React from 'react';
import CardButton from './CardButton';
import { LOGOS } from '../../utils/wallet';

const CardButtonWallet = ({
  title,
  address,
  chain,
  active,
  onPress,
  onSecondaryPress,
  ...props
}) => (
  <CardButton
    type="large"
    key={address}
    title={title}
    description={address}
    image={LOGOS[chain]}
    imageSize="xl"
    mask="lg"
    active={active}
    onPress={onPress}
    onSecondaryPress={onSecondaryPress}
    {...props}
  />
);

export default CardButtonWallet;
