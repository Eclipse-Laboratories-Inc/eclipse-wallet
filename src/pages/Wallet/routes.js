import WalletOverview from './WalletOverviewPage';
import SwapPage from './SwapPage';
import TransactionsPage from '../Transactions/TransactionsPage';
import SettingsSection from '../Settings';
import NftsSection from '../Nfts';

import IconWallet from '../../assets/images/IconWallet.png';
import IconNFT from '../../assets/images/IconNFT.png';
import IconSwap from '../../assets/images/IconSwap.png';
import IconBalance from '../../assets/images/IconBalance.png';
import IconSettings from '../../assets/images/IconSettings.png';
import { getDefaultRouteKey, getRoutesWithParent } from '../../routes/utils';

export const ROUTES_MAP = {
  WALLET_OVERVIEW: 'WALLET_OVERVIEW',
  WALLET_NFTS: 'WALLET_NFTS',
  WALLET_SWAP: 'WALLET_SWAP',
  WALLET_TRANSACTIONS: 'WALLET_TRANSACTIONS',
  WALLET_SETTINGS: 'WALLET_SETTINGS',
};

const NFTS_ROUTES = require('../Nfts/routes').default;
const SETTINGS_ROUTES = require('../Settings/routes').default;

const routes = [
  {
    key: ROUTES_MAP.WALLET_OVERVIEW,
    name: 'Wallet',
    path: '',
    route: '/wallet',
    Component: WalletOverview,
    default: true,
    icon: IconWallet,
  },
  {
    key: ROUTES_MAP.WALLET_NFTS,
    defaultScreen: getDefaultRouteKey(NFTS_ROUTES),
    name: 'NFT',
    path: 'nfts/*',
    route: '/wallet/nfts',
    Component: NftsSection,
    default: false,
    icon: IconNFT,
  },
  {
    key: ROUTES_MAP.WALLET_SWAP,
    name: 'Swap',
    path: 'swap',
    route: '/wallet/swap',
    Component: SwapPage,
    default: false,
    icon: IconSwap,
  },
  {
    key: ROUTES_MAP.WALLET_TRANSACTIONS,
    name: 'Transactions',
    path: 'transactions/*',
    route: '/wallet/transactions',
    Component: TransactionsPage,
    default: false,
    icon: IconBalance,
  },
  {
    key: ROUTES_MAP.WALLET_SETTINGS,
    defaultScreen: getDefaultRouteKey(SETTINGS_ROUTES),
    name: 'Settings',
    path: 'settings/*',
    route: '/wallet/settings',
    Component: SettingsSection,
    default: false,
    icon: IconSettings,
  },
  ...getRoutesWithParent(NFTS_ROUTES, ROUTES_MAP.WALLET_NFTS),
  ...getRoutesWithParent(SETTINGS_ROUTES, ROUTES_MAP.WALLET_SETTINGS),
];

export default routes;
