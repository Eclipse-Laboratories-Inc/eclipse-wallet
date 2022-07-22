import React from 'react';
import CardButton from './CardButton';
import AvatarImage from '../Image/AvatarImage';
import { LOGOS } from '../../utils/wallet';

const CardButtonWallet = ({ name, address, chain, onPress, active }) => (
  <CardButton
    key={address}
    onPress={onPress}
    icon={<AvatarImage url={LOGOS[chain]} size={48} />}
    title={name}
    description={address}
    active={active}
  />
);

export default CardButtonWallet;
