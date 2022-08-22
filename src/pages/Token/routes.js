import TokenDetailPage from './TokenDetailPage';
import TokenSelectPage from './TokenSelectPage';
import TokenAddPage from './TokenAddPage';
import TokenSendPage from './TokenSendPage';
import TokenReceivePage from './TokenReceivePage';

export const ROUTES_MAP = {
  TOKEN_DETAIL: 'TOKEN_DETAIL',
  TOKEN_SELECT: 'TOKEN_SELECT',
  TOKEN_SELECT_TO: 'TOKEN_SELECT_TO',
  TOKEN_ADD: 'TOKEN_ADD',
  TOKEN_SEND: 'TOKEN_SEND',
  TOKEN_SEND_TO: 'TOKEN_SEND_TO',
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
    key: ROUTES_MAP.TOKEN_SELECT_TO,
    name: 'tokenSelectTo',
    path: 'select/:action/:toAddress',
    route: '/token/select/:action/:toAddress',
    Component: TokenSelectPage,
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
    key: ROUTES_MAP.TOKEN_SEND_TO,
    name: 'tokenSendTo',
    path: 'send/:tokenId/:toAddress',
    route: '/token/send/:tokenId/:toAddress',
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
