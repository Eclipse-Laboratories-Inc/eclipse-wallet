import NftsCollectionPage from './NftsCollectionPage';
import NftsCollectionDetailPage from './NftsCollectionDetailPage';
import NftsDetailPage from './NftsDetailPage';
import NftsBuyDetailPage from './NftsBuyDetailPage';
import NftsBuyingPage from './NftsBuyingPage';
import NftsBiddingPage from './NftsBiddingPage';

import NftsListPage from './NftsListPage';
import NftsSendPage from './NftsSendPage';
import NftsListingPage from './NftsListingPage';

export const ROUTES_MAP = {
  NFTS_LIST: 'NFTS_LIST',
  NFTS_COLLECTION: 'NFTS_COLLECTION',
  NFTS_COLLECTION_DETAIL: 'NFTS_COLLECTION_DETAIL',
  NFTS_DETAIL: 'NFTS_DETAIL',
  NFTS_BUY_DETAIL: 'NFTS_BUY_DETAIL',
  NFTS_BUYING: 'NFTS_BUYING',
  NFTS_BIDDING: 'NFTS_BIDDING',
  NFTS_SEND: 'NFTS_SEND',
  NFTS_LISTING: 'NFTS_LISTING',
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
    key: ROUTES_MAP.NFTS_COLLECTION_DETAIL,
    name: 'nftsCollectionDetail',
    path: 'hyperspace/:id',
    route: '/wallet/nfts/hyperspace/:id',
    Component: NftsCollectionDetailPage,
    default: false,
  },
  {
    key: ROUTES_MAP.NFTS_DETAIL,
    name: 'nftsDetail',
    path: ':id',
    route: '/wallet/nfts/:id/',
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
    key: ROUTES_MAP.NFTS_LISTING,
    name: 'nftsListing',
    path: ':id/listing/:type',
    route: '/wallet/nfts/:id/listing/:type',
    Component: NftsListingPage,
    default: false,
  },
  {
    key: ROUTES_MAP.NFTS_BUY_DETAIL,
    name: 'nftsBuyDetail',
    path: 'hyperspace/:id/:nftId',
    route: '/wallet/nfts/hyperspace/:id/:nftId',
    Component: NftsBuyDetailPage,
    default: false,
  },
  {
    key: ROUTES_MAP.NFTS_BUYING,
    name: 'nftsBuying',
    path: 'hyperspace/:id/:nftId/buy',
    route: '/wallet/nfts/hyperspace/:id/:nftId/buy',
    Component: NftsBuyingPage,
    default: false,
  },
  {
    key: ROUTES_MAP.NFTS_BIDDING,
    name: 'nftsBidding',
    path: 'hyperspace/:id/:nftId/offer/:type',
    route: '/wallet/nfts/hyperspace/:id/:nftId/offer/:type',
    Component: NftsBiddingPage,
    default: false,
  },
];

export default routes;
