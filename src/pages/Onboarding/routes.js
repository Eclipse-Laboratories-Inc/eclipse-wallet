import CreateWallet from './CreateWallet';
import RecoverWallet from './RecoverWallet';
import SelectOptions from './SelectOptions';

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
    Component: SelectOptions,
    default: true,
  },
  {
    key: ROUTES_MAP.ONBOARDING_CREATE,
    name: 'onboardingCreate',
    path: 'create',
    route: '/onboarding/create',
    Component: CreateWallet,
  },
  {
    key: ROUTES_MAP.ONBOARDING_RECOVER,
    name: 'onboardingRecover',
    path: 'recover',
    route: '/onboarding/recover',
    Component: RecoverWallet,
  },
];

export default routes;
