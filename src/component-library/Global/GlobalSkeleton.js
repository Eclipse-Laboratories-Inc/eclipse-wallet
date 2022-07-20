import React from 'react';
import { StyleSheet } from 'react-native';
import ContentLoader from 'react-content-loader';
import theme from '../../component-library/Global/theme';

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
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 100">
    <rect x="0" y="0" rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25} rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25 * 2} rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25 * 3} rx="3" ry="3" width="100" height="23" />
  </ContentLoader>
);

const NftList = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 100">
    <rect x="0" y="0" rx="5" ry="5" width="48" height="48" />
    <rect x="52" y="0" rx="5" ry="5" width="48" height="48" />
  </ContentLoader>
);

export default GlobalSkeleton;
