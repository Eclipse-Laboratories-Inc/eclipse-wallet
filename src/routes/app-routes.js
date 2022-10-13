import OnboardingSection from '../pages/Onboarding';
import WalletPage from '../pages/Wallet/WalletPage';
import WelcomePage from '../pages/Welcome/WelcomePage';
import AdapterPage from '../pages/Adapter/AdapterPage';
import TokenSection from '../pages/Token';
import { getRoutesWithParent } from './utils';

export const ROUTES_MAP = {
  WELCOME: 'WELCOME',
  ONBOARDING: 'ONBOARDING',
  WALLET: 'WALLET',
  TOKEN: 'TOKEN',
  ADAPTER: 'ADAPTER',
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
    Component: OnboardingSection,
  },
  {
    key: ROUTES_MAP.TOKEN,
    name: 'token',
    path: 'token/*',
    route: '/token',
    Component: TokenSection,
  },
  {
    key: ROUTES_MAP.ADAPTER,
    name: 'adapter',
    path: 'adapter',
    route: '/adapter',
    Component: AdapterPage,
  },
];

export const globalRoutes = [
  ...routes,
  ...getRoutesWithParent(
    require('../pages/Onboarding/routes').default,
    ROUTES_MAP.ONBOARDING,
  ),
  ...getRoutesWithParent(
    require('../pages/Token/routes').default,
    ROUTES_MAP.TOKEN,
  ),
  ...require('../pages/Wallet/routes').default,
  ...require('../pages/Transactions/routes').default,
];

export default routes;
