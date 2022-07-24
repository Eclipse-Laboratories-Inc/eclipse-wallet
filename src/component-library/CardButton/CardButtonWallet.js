import React from 'react';

import { LOGOS } from '../../utils/wallet';
import CardButton from './CardButton';

const CardButtonWallet = ({
  title,
  address,
  chain,
  selected,
  active,
  onPress,
  onSecondaryPress,
  ...props
}) => (
  <CardButton
    key={address}
    title={title}
    description={address}
    image={LOGOS[chain]}
    imageSize="xl"
    mask="lg"
    active={active}
    selected={selected}
    onPress={onPress}
    onSecondaryPress={onSecondaryPress}
    {...props}
  />
);

export default CardButtonWallet;
