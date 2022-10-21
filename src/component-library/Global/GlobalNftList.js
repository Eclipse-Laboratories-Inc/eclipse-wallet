import React from 'react';

import { withTranslation } from '../../hooks/useTranslations';
import GlobalNft from './GlobalNft';
import GlobalText from './GlobalText';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import Grid from '../../component-library/Grid/Grid';
import { getNftListedInfo } from '../../utils/nfts';

const GlobalNftList = ({ nonFungibleTokens, listedInfo, onClick, t }) => {
  if (nonFungibleTokens === null) return <GlobalSkeleton type="NftList" />;
  if (nonFungibleTokens.length === 0) return <Empty t={t} />;
  return (
    <List
      nonFungibleTokens={nonFungibleTokens}
      listedInfo={listedInfo}
      onClick={onClick}
    />
  );
};

const List = ({ nonFungibleTokens, listedInfo, onClick }) => (
  <Grid
    spacing={1}
    columns={2}
    items={nonFungibleTokens.map(nft => (
      <GlobalNft
        nft={listedInfo ? getNftListedInfo(nft, listedInfo) : nft}
        onClick={onClick}
      />
    ))}
  />
);

const Empty = ({ t }) => (
  <GlobalText type="body1" color="primary" numberOfLines={1} center="true">
    {t(`nft.no_nft_found`)}
  </GlobalText>
);

export default withTranslation()(GlobalNftList);
