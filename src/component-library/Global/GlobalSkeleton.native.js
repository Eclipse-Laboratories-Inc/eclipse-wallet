import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import theme from './theme';

const window = Dimensions.get('window');

const GlobalSkeleton = ({ type }) => {
  switch (type) {
    case 'TokenList':
      return <TokenList />;
    case 'NftList':
      return <NftList />;
  }
};

const TokenList = () => (
  <ContentLoader
    speed={8}
    width="100%"
    height={370}
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}>
    <Rect x="0" y="5" rx="5" ry="5" width={window.width - 35} height="70" />
    <Rect x="0" y="95" rx="5" ry="5" width={window.width - 35} height="70" />
    <Rect x="0" y="185" rx="5" ry="5" width={window.width - 35} height="70" />
    <Rect x="0" y="275" rx="5" ry="5" width={window.width - 35} height="70" />
  </ContentLoader>
);

const NftList = () => (
  <ContentLoader
    speed={8}
    width="100%"
    height={200}
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}>
    <Rect x="0" y="0" rx="5" ry="5" width="150" height="150" />
    <Rect x="170" y="0" rx="5" ry="5" width="150" height="150" />
  </ContentLoader>
);

export default GlobalSkeleton;
