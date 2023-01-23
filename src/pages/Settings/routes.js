import SettingsOptionsPage from './SettingsOptionsPage';

import AccountSelectPage from './AccountSelectPage';
import AccountEditPage from './AccountEditPage';
import AccountEditProfilePage from './AccountEditProfilePage';
import AccountEditNamePage from './AccountEditNamePage';
import AccountEditNotificationsPage from './AccountEditNotificationsPage';
import AccountEditSeedPhrasePage from './AccountEditSeedPhrasePage';

import AddressBookPage from './AddressBookPage';
import AddressBookAddPage from './AddressBookAddPage';
import AddressBookEditPage from './AddressBookEditPage';

import ChangeNetworkPage from './ChangeNetworkPage';
import ChangePathIndexPage from './ChangePathIndexPage';
import ChangeExplorerPage from './ChangeExplorerPage';
import ChangeLanguagePage from './ChangeLanguagePage';
import SecurityPage from './SecurityPage';
import NotificationsPage from './NotificationsPage';
import TrustedAppsPage from './TrustedAppsPage';
import HelpSupportPage from './HelpSupportPage';
import AccountEditProfileNftsPage from './AccountEditProfileNftsPage';
import AccountEditProfileNftsDetailPage from './AccountEditProfileNftsDetailPage';
import AccountEditProfileAvatarsPage from './AccountEditProfileAvatarsPage';
import AccountEditPrivateKeyPage from './AccountEditPrivateKeyPage';

export const ROUTES_MAP = {
  SETTINGS_OPTIONS: 'SETTINGS_OPTIONS',
  SETTINGS_ACCOUNT_SELECT: 'SETTINGS_ACCOUNT_SELECT',
  SETTINGS_ACCOUNT_EDIT: 'SETTINGS_ACCOUNT_EDIT',
  SETTINGS_ACCOUNT_EDIT_PROFILE: 'SETTINGS_ACCOUNT_EDIT_PROFILE',
  SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS: 'SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS',
  SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS_DETAIL:
    'SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS_DETAIL',
  SETTINGS_ACCOUNT_EDIT_PROFILE_AVATARS:
    'SETTINGS_ACCOUNT_EDIT_PROFILE_AVATARS',
  SETTINGS_ACCOUNT_EDIT_NAME: 'SETTINGS_ACCOUNT_EDIT_NAME',
  SETTINGS_ACCOUNT_EDIT_ADDRESS: 'SETTINGS_ACCOUNT_EDIT_ADDRESS',
  SETTINGS_ACCOUNT_EDIT_NOTIFICATIONS: 'SETTINGS_ACCOUNT_EDIT_NOTIFICATIONS',
  SETTINGS_ACCOUNT_EDIT_SEEDPHRASE: 'SETTINGS_ACCOUNT_EDIT_SEEDPHRASE',
  SETTINGS_ACCOUNT_EDIT_PRIVATEKEY: 'SETTINGS_ACCOUNT_EDIT_PRIVATEKEY',
  SETTINGS_ADDRESSBOOK: 'SETTINGS_ADDRESSBOOK',
  SETTINGS_ADDRESSBOOK_ADD: 'SETTINGS_ADDRESSBOOK_ADD',
  SETTINGS_ADDRESSBOOK_EDIT: 'SETTINGS_ADDRESSBOOK_EDIT',
  SETTINGS_CHANGELANGUAGE: 'SETTINGS_CHANGELANGUAGE',
  SETTINGS_CHANGENETWORK: 'SETTINGS_CHANGENETWORK',
  SETTINGS_CHANGEPATHINDEX: 'SETTINGS_CHANGEPATHINDEX',
  SETTINGS_CHANGEEXPLORER: 'SETTINGS_CHANGEEXPLORER',
  SETTINGS_NOTIFICATIONS: 'SETTINGS_NOTIFICATIONS',
  SETTINGS_SECURITY: 'SETTINGS_SECURITY',
  SETTINGS_TRUSTEDAPPS: 'SETTINGS_TRUSTEDAPPS',
  SETTINGS_HELPSUPPORT: 'SETTINGS_HELPSUPPORT',
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
    path: 'accounts/:id',
    route: '/wallet/settings/accounts/:id',
    Component: AccountEditPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE,
    name: 'settingsEditAccountProfile',
    path: 'accounts/:id/profile',
    route: '/wallet/settings/accounts/:id/profile',
    Component: AccountEditProfilePage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS,
    name: 'settingsEditAccountProfileNfts',
    path: 'accounts/:id/profile/nfts',
    route: '/wallet/settings/accounts/:id/profile/nfts',
    Component: AccountEditProfileNftsPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS_DETAIL,
    name: 'settingsEditAccountProfileNftsDetail',
    path: 'accounts/:id/profile/nfts/:mint',
    route: '/wallet/settings/accounts/:id/profile/nfts/:mint',
    Component: AccountEditProfileNftsDetailPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE_AVATARS,
    name: 'settingsEditAccountProfileAvatars',
    path: 'accounts/:id/profile/avatars',
    route: '/wallet/settings/accounts/:id/profile/avatars',
    Component: AccountEditProfileAvatarsPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ACCOUNT_EDIT_NAME,
    name: 'settingsEditAccountName',
    path: 'accounts/:id/name',
    route: '/wallet/settings/accounts/:id/name',
    Component: AccountEditNamePage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ACCOUNT_EDIT_SEEDPHRASE,
    name: 'settingsEditAccountSeedPhrase',
    path: 'accounts/:id/seedphrase',
    route: '/wallet/settings/accounts/:id/seedphrase',
    Component: AccountEditSeedPhrasePage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_ACCOUNT_EDIT_PRIVATEKEY,
    name: 'settingsEditAccountPrivateKey',
    path: 'accounts/:id/privatekey',
    route: '/wallet/settings/accounts/:id/privatekey',
    Component: AccountEditPrivateKeyPage,
    default: false,
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
    key: ROUTES_MAP.SETTINGS_CHANGELANGUAGE,
    name: 'settingsChangeLanguage',
    path: 'language/change',
    route: '/wallet/settings/language/change',
    Component: ChangeLanguagePage,
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
    key: ROUTES_MAP.SETTINGS_CHANGEPATHINDEX,
    name: 'settingsChangePathIndex',
    path: 'pathindex/change',
    route: '/wallet/settings/pathindex/change',
    Component: ChangePathIndexPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_CHANGEEXPLORER,
    name: 'settingsChangeExplorer',
    path: 'explorer/change',
    route: '/wallet/settings/explorer/change',
    Component: ChangeExplorerPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_SECURITY,
    name: 'settingsSecurity',
    path: 'security',
    route: '/wallet/settings/security',
    Component: SecurityPage,
    default: false,
  },
  // {
  //   key: ROUTES_MAP.SETTINGS_NOTIFICATIONS,
  //   name: 'settingsNotifications',
  //   path: 'notifications',
  //   route: '/wallet/settings/notifications',
  //   Component: NotificationsPage,
  //   default: false,
  // },
  {
    key: ROUTES_MAP.SETTINGS_TRUSTEDAPPS,
    name: 'settingsTrustedApps',
    path: 'trustedapps',
    route: '/wallet/settings/trustedapps',
    Component: TrustedAppsPage,
    default: false,
  },
  {
    key: ROUTES_MAP.SETTINGS_HELPSUPPORT,
    name: 'settingsHelpSupport',
    path: 'help',
    route: '/wallet/settings/help',
    Component: HelpSupportPage,
    default: false,
  },
];

export default routes;
