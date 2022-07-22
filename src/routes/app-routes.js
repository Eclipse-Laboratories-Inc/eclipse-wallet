import OnboardingPage from '../pages/Onboarding/OnboardingPage';
import WalletPage from '../pages/Wallet/WalletPage';
import WelcomePage from '../pages/Welcome/WelcomePage';
import TokenDetailPage from '../pages/Token/TokenDetailPage';

const getRoutesWithParent = (routes, parent) =>
  routes.map(r => ({ ...r, parent }));
export const ROUTES_MAP = {
  WELCOME: 'WELCOME',
  ONBOARDING: 'ONBOARDING',
  WALLET: 'WALLET',
  TOKEN_DETAIL: 'TOKEN_DETAIL',
};

const routes = [
  {
    key: ROUTES_MAP.WALLET,
    name: 'wallet',
    path: 'wallet/*',
    route: '/wallet',
    Component: WalletPage,
  },
  {
    key: ROUTES_MAP.WELCOME,
    name: 'welcome',
    path: 'welcome',
    route: '/welcome',
    Component: WelcomePage,
    default: true,
  },
  {
    key: ROUTES_MAP.ONBOARDING,
    name: 'onboarding',
    path: 'onboarding/*',
    route: '/onboarding',
    Component: OnboardingPage,
  },
  {
    key: ROUTES_MAP.TOKEN_DETAIL,
    name: 'tokenDetail',
    path: 'token/:tokenId',
    route: '/token/:tokenId',
    Component: TokenDetailPage,
  },
];

export const globalRoutes = [
  ...routes,
  ...getRoutesWithParent(
    require('../pages/Onboarding/routes').default,
    ROUTES_MAP.ONBOARDING,
  ),
  ...require('../pages/Wallet/routes').default,
  ...require('../pages/Settings/routes').default,
  ...require('../pages/Transactions/routes').default,
];

export default routes;
