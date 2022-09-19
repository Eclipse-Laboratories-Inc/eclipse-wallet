import React from 'react';
import ContentLoader from 'react-content-loader';
import theme from '../../component-library/Global/theme';

const GlobalSkeleton = ({ type }) => {
  switch (type) {
    case 'TokenList':
      return <TokenList />;
    case 'NftList':
      return <NftList />;
    case 'NftListScreen':
      return <NftListScreen />;
    case 'ActivityList':
      return <ActivityList />;
    case 'TokenDetail':
      return <TokenDetail />;
    case 'TransactionDetail':
      return <TransactionDetail />;
    case 'Swap':
      return <Swap />;
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

const NftListScreen = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 200">
    <rect x="0" y="32" rx="5" ry="5" width="48" height="48" />
    <rect x="52" y="32" rx="5" ry="5" width="48" height="48" />
    <rect x="0" y={43 * 2} rx="5" ry="5" width="48" height="48" />
    <rect x="52" y={43 * 2} rx="5" ry="5" width="48" height="48" />
    <rect x="0" y={47 * 3} rx="5" ry="5" width="48" height="48" />
    <rect x="52" y={47 * 3} rx="5" ry="5" width="48" height="48" />
  </ContentLoader>
);

const ActivityList = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 200">
    <rect x="0" y="0" rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25} rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25 * 2} rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25 * 3} rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25 * 4} rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25 * 5} rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25 * 6} rx="3" ry="3" width="100" height="23" />
    <rect x="0" y={25 * 7} rx="3" ry="3" width="100" height="23" />
  </ContentLoader>
);

const TokenDetail = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 95">
    <rect x="25" y="16" rx="3" ry="3" width="50" height="20" />
    <rect x="0" y="44" rx="3" ry="3" width="49" height="14" />
    <rect x="50" y="44" rx="3" ry="3" width="49" height="14" />
    <rect x="0" y="63" rx="3" ry="3" width="100" height="20" />
  </ContentLoader>
);

const TransactionDetail = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 143">
    <rect x="20" y="105" rx="1" ry="1" width="61" height="12" />
    <rect x="5" y="85" rx="1" ry="1" width="90" height="10" />
    <circle cx="50" cy="27" r="16" />
    <rect x="20" y="120" rx="1" ry="1" width="61" height="12" />
    <rect x="5" y="59" rx="1" ry="1" width="90" height="10" />
    <rect x="5" y="72" rx="1" ry="1" width="90" height="10" />
  </ContentLoader>
);

const Swap = () => (
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

export default GlobalSkeleton;
