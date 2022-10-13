import React from 'react';
import { Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import theme from './theme';

const window = Dimensions.get('window');

const GlobalSkeleton = ({ type }) => {
  switch (type) {
    case 'TokenList':
      return <TokenList />;
    case 'TokenListSend':
      return <TokenListSend />;
    case 'NftList':
      return <NftList />;
    case 'NftListScreen':
      return <NftListScreen />;
    case 'ActivityList':
      return <ActivityList />;
    case 'TokenDetail':
      return <TokenDetail />;
    case 'NftDetail':
      return <NftDetail />;
    case 'TransactionDetail':
      return <TransactionDetail />;
    case 'TransactionSimulation':
      return <TransactionSimulation />;
    case 'Swap':
      return <Swap />;
    case 'Generic':
      return <Generic />;
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

const TokenListSend = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 200">
    <Rect x="0" y="23" rx="3" ry="3" width="100" height="14" />
    <Rect x="0" y="54" rx="3" ry="3" width="100" height="14" />
    <Rect x="0" y="70" rx="3" ry="3" width="100" height="14" />
    <Rect x="0" y="86" rx="3" ry="3" width="100" height="14" />
    <Rect x="0" y="102" rx="3" ry="3" width="100" height="14" />
    <Rect x="0" y="118" rx="3" ry="3" width="100" height="14" />
    <Rect x="0" y="134" rx="3" ry="3" width="100" height="14" />
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

const NftListScreen = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 200">
    <Rect x="0" y="32" rx="5" ry="5" width="48" height="48" />
    <Rect x="52" y="32" rx="5" ry="5" width="48" height="48" />
    <Rect x="0" y="86" rx="5" ry="5" width="48" height="48" />
    <Rect x="52" y="86" rx="5" ry="5" width="48" height="48" />
    <Rect x="0" y="141" rx="5" ry="5" width="48" height="48" />
    <Rect x="52" y="141" rx="5" ry="5" width="48" height="48" />
  </ContentLoader>
);

const ActivityList = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 200">
    <Rect x="0" y="0" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="25" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="50" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="75" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="100" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="125" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="150" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="175" rx="3" ry="3" width="100" height="23" />
  </ContentLoader>
);

const TokenDetail = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 68">
    <Rect x="25" y="16" rx="3" ry="3" width="50" height="20" />
    <Rect x="0" y="44" rx="3" ry="3" width="49" height="14" />
    <Rect x="50" y="44" rx="3" ry="3" width="49" height="14" />
    {/* chart skeleton viewBox="0 0 100 95"*/}
    {/* <Rect x="0" y="63" rx="3" ry="3" width="100" height="20" /> */}
  </ContentLoader>
);

const NftDetail = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 200">
    <Rect x="25" y="18" rx="3" ry="3" width="50" height="10" />
    <Rect x="20" y="34" rx="6" ry="6" width="60" height="60" />
    <Rect x="1" y="140" rx="3" ry="3" width="98" height="16" />
    <Rect x="1" y="160" rx="3" ry="3" width="98" height="10" />
    <Rect x="1" y="180" rx="3" ry="3" width="48" height="14" />
    <Rect x="51" y="180" rx="3" ry="3" width="48" height="14" />
  </ContentLoader>
);

const TransactionDetail = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 200">
    <Rect x="20" y="105" rx="1" ry="1" width="61" height="12" />
    <Rect x="5" y="85" rx="1" ry="1" width="90" height="10" />
    <Circle cx="50" cy="27" r="16" />
    <Rect x="20" y="120" rx="1" ry="1" width="61" height="12" />
    <Rect x="5" y="59" rx="1" ry="1" width="90" height="10" />
    <Rect x="5" y="72" rx="1" ry="1" width="90" height="10" />
  </ContentLoader>
);

const TransactionSimulation = () => (
  <ContentLoader
    speed={8}
    width="100%"
    height={370}
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}>
    <Rect x="0" y="5" rx="5" ry="5" width={window.width - 35} height="70" />
    <Rect x="0" y="95" rx="5" ry="5" width={window.width - 35} height="70" />
  </ContentLoader>
);

const Swap = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 100">
    <Rect x="0" y="0" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="25" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="50" rx="3" ry="3" width="100" height="23" />
    <Rect x="0" y="75" rx="3" ry="3" width="100" height="23" />
  </ContentLoader>
);

const Generic = () => (
  <ContentLoader
    foregroundColor={theme.colors.cards}
    backgroundColor={theme.colors.bgLight}
    viewBox="0 0 100 200">
    <Rect x="0" y="0" width="100" height="200" />
  </ContentLoader>
);

export default GlobalSkeleton;
