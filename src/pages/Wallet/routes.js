import WalletOvewiew from './WalletOverviewPage';
import NtfsPage from './NtfsPage';
import SettingsPage from '../Settings/SettingsPage';
export const ROUTES_MAP = {
  WALLET_OVERVIEW: 'WALLET_OVERVIEW',
  WALLET_NTFS: 'WALLET_NTFS',
  WALLET_SETTINGS: 'WALLET_SETTINGS',
};

const routes = [
  {
    key: ROUTES_MAP.WALLET_OVERVIEW,
    name: 'walletOverview',
    path: '',
    route: '/wallet',
    Component: WalletOvewiew,
    default: true,
  },
  {
    key: ROUTES_MAP.WALLET_NTFS,
    name: 'walletNtfs',
    path: 'ntfs',
    route: '/wallet/ntfs',
    Component: NtfsPage,
    default: false,
  },
  {
    key: ROUTES_MAP.WALLET_SETTINGS,
    name: 'walletSettings',
    path: 'settings',
    route: '/wallet/settings',
    Component: SettingsPage,
    default: false,
  },
];

export default routes;
