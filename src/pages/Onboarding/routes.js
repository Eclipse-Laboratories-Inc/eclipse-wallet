import CreateWallet from './CreateWallet';
import DerivedAccounts from './DerivedAccounts';
import RecoverWallet from './RecoverWallet';
import SelectOptions from './SelectOptions';

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
    Component: SelectOptions,
    default: true,
  },
  {
    key: ROUTES_MAP.ONBOARDING_CREATE,
    name: 'onboardingCreate',
    path: 'create/:chainCode',
    route: '/onboarding/create/:chainCode',
    Component: CreateWallet,
  },
  {
    key: ROUTES_MAP.ONBOARDING_RECOVER,
    name: 'onboardingRecover',
    path: 'recover/:chainCode',
    route: '/onboarding/recover/:chainCode',
    Component: RecoverWallet,
  },
  {
    key: ROUTES_MAP.ONBOARDING_DERIVED,
    name: 'onboardingDerived',
    path: 'derived',
    route: '/onboarding/derived',
    Component: DerivedAccounts,
  },
];

export default routes;
