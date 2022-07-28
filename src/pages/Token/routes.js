import TokenDetailPage from './TokenDetailPage';
import TokenSelectPage from './TokenSelectPage';
import TokenAddPage from './TokenAddPage';
import TokenSendPage from './TokenSendPage';
import TokenReceivePage from './TokenReceivePage';

export const ROUTES_MAP = {
  TOKEN_DETAIL: 'TOKEN_DETAIL',
  TOKEN_SELECT: 'TOKEN_SELECT',
  TOKEN_ADD: 'TOKEN_ADD',
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
    key: ROUTES_MAP.TOKEN_ADD,
    name: 'tokenAdd',
    path: 'add/:walletAddress/:action',
    route: '/token/add/:walletAddress/:action',
    Component: TokenAddPage,
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
    path: 'receive',
    route: '/token/receive',
    Component: TokenReceivePage,
  },
];

export default routes;
