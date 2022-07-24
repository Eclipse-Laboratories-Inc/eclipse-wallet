import TokenDetailPage from './TokenDetailPage';
import TokenReceivePage from './TokenReceivePage';
import TokenSelectPage from './TokenSelectPage';
import TokenSendPage from './TokenSendPage';

export const ROUTES_MAP = {
  TOKEN_DETAIL: 'TOKEN_DETAIL',
  TOKEN_SELECT: 'TOKEN_SELECT',
  TOKEN_SEND: 'TOKEN_SEND',
  TOKEN_RECEIVE: 'TOKEN_RECEIVE',
};

const routes = [
  {
    key: ROUTES_MAP.TOKEN_DETAIL,
    name: 'tokenDetail',
    path: ':tokenId',
    route: '/token/:tokenId',
    Component: TokenDetailPage,
  },
  {
    key: ROUTES_MAP.TOKEN_SELECT,
    name: 'tokenSelect',
    path: 'select/:action',
    route: '/token/select/:action',
    Component: TokenSelectPage,
    default: true,
  },
  {
    key: ROUTES_MAP.TOKEN_SEND,
    name: 'tokenSend',
    path: 'send/:tokenId',
    route: '/token/send/:tokenId',
    Component: TokenSendPage,
  },
  {
    key: ROUTES_MAP.TOKEN_RECEIVE,
    name: 'tokenReceive',
    path: 'receive/:tokenId',
    route: '/token/receive/:tokenId',
    Component: TokenReceivePage,
  },
];

export default routes;
