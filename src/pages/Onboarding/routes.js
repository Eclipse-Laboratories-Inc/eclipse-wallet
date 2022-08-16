import CreateWalletPage from './CreateWalletPage';
import DerivedAccountsPage from './DerivedAccountsPage';
import RecoverWalletPage from './RecoverWalletPage';
import SelectOptionsPage from './SelectOptionsPage';

export const ROUTES_MAP = {
  ONBOARDING_HOME: 'ONBOARDING_HOME',
  ONBOARDING_CREATE: 'ONBOARDING_CREATE',
  ONBOARDING_RECOVER: 'ONBOARDING_RECOVER',
  ONBOARDING_DERIVED: 'ONBOARDING_DERIVED',
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
    path: 'create/:chainCode',
    route: '/onboarding/create/:chainCode',
    Component: CreateWalletPage,
  },
  {
    key: ROUTES_MAP.ONBOARDING_RECOVER,
    name: 'onboardingRecover',
    path: 'recover/:chainCode',
    route: '/onboarding/recover/:chainCode',
    Component: RecoverWalletPage,
  },
  {
    key: ROUTES_MAP.ONBOARDING_DERIVED,
    name: 'onboardingDerived',
    path: 'derived',
    route: '/onboarding/derived',
    Component: DerivedAccountsPage,
  },
];

export default routes;
