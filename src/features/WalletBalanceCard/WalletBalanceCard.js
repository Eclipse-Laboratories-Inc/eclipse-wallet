import React from 'react';

import Box from '../../component-library/Box/Box';
import TextParagraph from '../../component-library/Text/TextParagraph';
import TextTitle from '../../component-library/Text/TextTitle';
import { showAmount } from '../../utils/amount';

const WalletBalanceCard = ({ balance, messages, actions }) => (
  <Box>
    <TextTitle>{showAmount(balance.usdTotal)}</TextTitle>
    <TextParagraph>11111</TextParagraph>
    {actions}
  </Box>
);

export default WalletBalanceCard;
