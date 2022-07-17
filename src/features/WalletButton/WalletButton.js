import React from 'react';
import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import AvatarImage from '../../component-library/Image/AvatarImage';
import { LOGOS } from '../../utils/wallet';

const WalletButton = ({ name, address, chain, onClick, active }) => (
  <GlobalButtonCard
    key={address}
    onPress={onClick}
    icon={<AvatarImage url={LOGOS[chain]} size={48} />}
    title={name}
    description={address}
    active={active}
  />
);

export default WalletButton;
