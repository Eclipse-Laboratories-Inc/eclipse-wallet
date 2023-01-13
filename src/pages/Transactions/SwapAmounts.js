import React from 'react';
import { TOKEN_DECIMALS } from './constants';
import GlobalText from '../../component-library/Global/GlobalText';

const SwapAmounts = ({
  inAmount,
  outAmount,
  inToken,
  outToken,
  blockchain,
}) => {
  return (
    <>
      {blockchain === 'SOLANA' ? (
        <>
          <GlobalText type="headline3" center>
            {inAmount &&
              `-${
                inAmount /
                (inToken === 'SOL' || !inToken
                  ? TOKEN_DECIMALS.SOLANA
                  : TOKEN_DECIMALS.COINS)
              } ${inToken || 'SOL'} `}
          </GlobalText>
          <GlobalText type="headline3" center>
            {outAmount &&
              `+${
                outAmount /
                (outToken === 'SOL' || !outToken
                  ? TOKEN_DECIMALS.SOLANA
                  : TOKEN_DECIMALS.COINS)
              } ${outToken || 'SOL'} `}
          </GlobalText>
        </>
      ) : (
        <>
          <GlobalText type="headline3" center>
            {inAmount && `-${inAmount} ${inToken} `}
          </GlobalText>
          <GlobalText type="headline3" center>
            {outAmount && `+${outAmount} ${outToken} `}
          </GlobalText>
        </>
      )}
    </>
  );
};

export default SwapAmounts;
