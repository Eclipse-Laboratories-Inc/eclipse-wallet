import React from 'react';

import GlobalNft from './GlobalNft';

import Grid from '../../component-library/Grid/Grid';

const GlobalNftList = ({ nonFungibleTokens }) => (
  <Grid
    spacing={1}
    columns={2}
    items={nonFungibleTokens.map(nft => (
      <GlobalNft nft={nft} />
    ))}
  />
);
export default GlobalNftList;
