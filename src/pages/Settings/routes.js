import SettingsOptionsPage from './SettingsOptionsPage';
import ChangeNetworkPage from './ChangeNetworkPage';
import SelectAccountPage from './SelectAccountPage';
import EditAccountPage from './EditAccountPage';
import ChangeLanguagePage from './ChangeLanguagePage';

export const ROUTES_MAP = {
  SETTINGS_OPTIONS: 'SETTINGS_OPTIONS',
  SETTINGS_CHANGENETWORK: 'SETTINGS_CHANGENETWORK',
  SETTINGS_CHANGELANGUAGE: 'SETTINGS_CHANGELANGUAGE',
  SETTINGS_SELECTACCOUNT: 'SETTINGS_SELECTACCOUNT',
  SETTINGS_EDITACCOUNT: 'SETTINGS_EDITACCOUNT',
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
    key: ROUTES_MAP.SETTINGS_CHANGELANGUAGE,
    name: 'settingsChangeLanguage',
    path: 'language/change',
    route: '/wallet/settings/language/change',
    Component: ChangeLanguagePage,
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
  {
    key: ROUTES_MAP.SETTINGS_EDITACCOUNT,
    name: 'settingsEditAccount',
    path: 'accounts/:address',
    route: '/wallet/settings/accounts/:address',
    Component: EditAccountPage,
    default: false,
  },
];

export default routes;
