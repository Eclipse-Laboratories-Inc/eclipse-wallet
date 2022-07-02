import React from 'react';
import Box from '../../component-library/Box/Box';
import ClickableBasicCard from '../../component-library/Card/ClickableBasicCard';
import AvatarImage from '../../component-library/Image/AvatarImage';
import TextParagraph from '../../component-library/Text/TextParagraph';

const TokenList = ({ tokens, onDetail }) => (
  <Box>
    {tokens.map(t => (
      <ClickableBasicCard
        key={t.address}
        headerAction={<TextParagraph>$0.00</TextParagraph>}
        headerIcon={<AvatarImage url={t.logo} size={48} />}
        headerTitle={t.name}
        headerSubtitle={`${t.decimals} ${t.symbol}`}
        onClick={() => onDetail(t)}
      />
    ))}
  </Box>
);

export default TokenList;
