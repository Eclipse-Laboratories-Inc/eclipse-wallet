import CreateWalletPage from './CreateWalletPage';
import RecoverWalletPage from './RecoverWalletPage';
import SelectOptionsPage from './SelectOptionsPage';

export const ROUTES_MAP = {
  ONBOARDING_HOME: 'ONBOARDING_HOME',
  ONBOARDING_CREATE: 'ONBOARDING_CREATE',
  ONBOARDING_RECOVER: 'ONBOARDING_RECOVER',
};

const routes = [
  {
    key: ROUTES_MAP.ONBOARDING_HOME,
    name: 'onboardingHome',
    path: '',
    route: '/onboarding',
    Component: SelectOptionsPage,
    default: true,
  },
  {
    key: ROUTES_MAP.ONBOARDING_CREATE,
    name: 'onboardingCreate',
    path: 'create',
    route: '/onboarding/create',
    Component: CreateWalletPage,
  },
  {
    key: ROUTES_MAP.ONBOARDING_RECOVER,
    name: 'onboardingRecover',
    path: 'recover',
    route: '/onboarding/recover',
    Component: RecoverWalletPage,
  },
];

export default routes;
