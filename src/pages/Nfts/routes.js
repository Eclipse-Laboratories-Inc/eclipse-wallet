import NftsCollectionPage from './NftsCollectionPage';
import NftsDetailPage from './NftsDetailPage';
import NftsListPage from './NftsListPage';
import NftsSendPage from './NftsSendPage';
import NftsSellPage from './NftsSellPage';

export const ROUTES_MAP = {
  NFTS_LIST: 'NFTS_LIST',
  NFTS_COLLECTION: 'NFTS_COLLECTION',
  NFTS_DETAIL: 'NFTS_DETAIL',
  NFTS_SEND: 'NFTS_SEND',
  NFTS_SELL: 'NFTS_SELL',
};

const routes = [
  {
    key: ROUTES_MAP.NFTS_LIST,
    name: 'nftsList',
    path: '',
    route: '/wallet/nfts',
    Component: NftsListPage,
    default: true,
  },
  {
    key: ROUTES_MAP.NFTS_COLLECTION,
    name: 'nftsCollection',
    path: 'collection/:id',
    route: '/wallet/nfts/collection/:id',
    Component: NftsCollectionPage,
    default: false,
  },
  {
    key: ROUTES_MAP.NFTS_DETAIL,
    name: 'nftsDetail',
    path: ':id',
    route: '/wallet/nfts/:id',
    Component: NftsDetailPage,
    default: false,
  },
  {
    key: ROUTES_MAP.NFTS_SEND,
    name: 'nftsSend',
    path: ':id/send',
    route: '/wallet/nfts/:id/send',
    Component: NftsSendPage,
    default: false,
  },
  {
    key: ROUTES_MAP.NFTS_SELL,
    name: 'nftsSell',
    path: ':id/sell',
    route: '/wallet/nfts/:id/sell',
    Component: NftsSellPage,
    default: false,
  },
];

export default routes;
