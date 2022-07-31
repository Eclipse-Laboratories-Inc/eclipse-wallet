import SettingsOptionsPage from './SettingsOptionsPage';
import AccountSelectPage from './AccountSelectPage';
import AccountEditPage from './AccountEditPage';
import AddressBookPage from './AddressBookPage';
import AddressBookAddPage from './AddressBookAddPage';
import AddressBookEditPage from './AddressBookEditPage';
import ChangeNetworkPage from './ChangeNetworkPage';
import ChangeLanguagePage from './ChangeLanguagePage';

export const ROUTES_MAP = {
  SETTINGS_OPTIONS: 'SETTINGS_OPTIONS',
  SETTINGS_ACCOUNT_SELECT: 'SETTINGS_ACCOUNT_SELECT',
  SETTINGS_ACCOUNT_EDIT: 'SETTINGS_ACCOUNT_EDIT',
  SETTINGS_ADDRESSBOOK: 'SETTINGS_ADDRESSBOOK',
  SETTINGS_ADDRESSBOOK_ADD: 'SETTINGS_ADDRESSBOOK_ADD',
  SETTINGS_ADDRESSBOOK_EDIT: 'SETTINGS_ADDRESSBOOK_EDIT',
  SETTINGS_CHANGENETWORK: 'SETTINGS_CHANGENETWORK',
  SETTINGS_CHANGELANGUAGE: 'SETTINGS_CHANGELANGUAGE',
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
    key: ROUTES_MAP.SETTINGS_ADDRESSBOOK,
    name: 'settingsAddressBook',
    path: 'addressbook',
    route: '/wallet/settings/addressbook',
    Component: AddressBookPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ADDRESSBOOK_ADD,
    name: 'settingsAddAddressBook',
    path: 'addressbook/new',
    route: '/wallet/settings/addressbook/new',
    Component: AddressBookAddPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ADDRESSBOOK_EDIT,
    name: 'settingsEditAddressBook',
    path: 'addressbook/:address',
    route: '/wallet/settings/addressbook/:address',
    Component: AddressBookEditPage,
    default: false,
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
    key: ROUTES_MAP.SETTINGS_ACCOUNT_SELECT,
    name: 'settingsSelectAccount',
    path: 'accounts',
    route: '/wallet/settings/accounts',
    Component: AccountSelectPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ACCOUNT_EDIT,
    name: 'settingsEditAccount',
    path: 'accounts/:address',
    route: '/wallet/settings/accounts/:address',
    Component: AccountEditPage,
    default: false,
  },
];

export default routes;
