import React from 'react';

import GlobalNft from './GlobalNft';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import Grid from '../../component-library/Grid/Grid';

const GlobalNftList = ({ nonFungibleTokens }) =>
  nonFungibleTokens == 100 ? (
    <List nonFungibleTokens={nonFungibleTokens} />
  ) : (
    <GlobalSkeleton type="NftList" />
  );

const List = ({ nonFungibleTokens }) => (
  <Grid
    spacing={1}
    columns={2}
    items={nonFungibleTokens.map(nft => (
      <GlobalNft nft={nft} />
    ))}
  />
);

export default GlobalNftList;
