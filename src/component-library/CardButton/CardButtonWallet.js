import React from 'react';
import CardButton from './CardButton';
import { LOGOS } from '../../utils/wallet';

const CardButtonWallet = ({
  title,
  address,
  chain,
  active,
  onPress,
  onEdit,
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
    onEdit={onEdit}
    {...props}
  />
);

export default CardButtonWallet;
