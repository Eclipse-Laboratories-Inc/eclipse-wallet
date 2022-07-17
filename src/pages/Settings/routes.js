import SettingsOptionsPage from './SettingsOptionsPage';
import ChangeNetworkPage from './ChangeNetworkPage';
import SelectAccountPage from './SelectAccountPage';
export const ROUTES_MAP = {
  SETTINGS_OPTIONS: 'SETTINGS_OPTIONS',
  SETTINGS_CHANGENETWORK: 'SETTINGS_CHANGENETWORK',
  SETTINGS_SELECTACCOUNT: 'SETTINGS_SELECTACCOUNT',
};

const routes = [
  {
    key: ROUTES_MAP.SETTINGS_OPTIONS,
    name: 'settingsOptions',
    path: '',
    route: '/wallet/settings',
    Component: SettingsOptionsPage,
    default: true,
  },
  {
    key: ROUTES_MAP.SETTINGS_CHANGENETWORK,
    name: 'settingsChangeNetwork',
    path: 'networks/change',
    route: '/wallet/settings/networks/change',
    Component: ChangeNetworkPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_SELECTACCOUNT,
    name: 'settingsSelectAccount',
    path: 'accounts',
    route: '/wallet/settings/accounts',
    Component: SelectAccountPage,
    default: false,
  },
];

export default routes;
