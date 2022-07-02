import React from 'react';
import AvatarImage from '../../component-library/Image/AvatarImage';
import TextParagraph from '../../component-library/Text/TextParagraph';
import { getDefaultChain, LOGOS } from '../../utils/wallet';
import BasicCard from '../../component-library/Card/BasicCard';
import SelectableCard from '../../component-library/Card/SelectableCard';

const WalletCard = ({ wallet, onClick }) => (
  <BasicCard
    headerAction={<TextParagraph>$0.00</TextParagraph>}
    headerIcon={<AvatarImage url={LOGOS[getDefaultChain()]} size={48} />}
    headerTitle="SOLANA"
    headerSubtitle="100"
  />
);

export const SelectableWalletCard = ({ wallet, selected, onSelect }) => (
  <SelectableCard
    selected={selected}
    onSelect={onSelect}
    headerAction={<TextParagraph>$0.00</TextParagraph>}
    headerIcon={<AvatarImage url={LOGOS[getDefaultChain()]} size={48} />}
    headerTitle="SOLANA"
    headerSubtitle="100"
  />
);

export default WalletCard;
